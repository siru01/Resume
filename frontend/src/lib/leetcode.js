// ─── API Hosts ──────────────────────────────────────────────────────────────
// Profile: faisalshohag vercel returns all needed fields in one call.
// Secondary (contest/badges/calendar): alfa-leetcode-api-three vercel.
// Fallback hosts are tried in order if the primary fails.

const PROFILE_HOSTS = [
  (u) => `https://leetcode-api-faisalshohag.vercel.app/${u}`,
  (u) => `https://alfa-leetcode-api-three.vercel.app/userProfile/${u}`,
  (u) => `https://alfa-leetcode-api.onrender.com/userProfile/${u}`,
];

const SECONDARY_HOSTS = [
  'https://alfa-leetcode-api-three.vercel.app',
  'https://alfa-leetcode-api.onrender.com',
];

export const LEETCODE_USERNAME = 'SIRU10';
export const LEETCODE_PROFILE_URL = 'https://leetcode.com/u/SIRU10/';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function byDifficulty(entries, difficulty) {
  return entries?.find((entry) => entry.difficulty === difficulty);
}

// ─── Cache ───────────────────────────────────────────────────────────────────
const CACHE_KEY_PREFIX = 'leetcode-dashboard';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCachedDashboard(username) {
  try {
    const raw = sessionStorage.getItem(`${CACHE_KEY_PREFIX}:${username}`);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(`${CACHE_KEY_PREFIX}:${username}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedDashboard(username, data) {
  try {
    sessionStorage.setItem(
      `${CACHE_KEY_PREFIX}:${username}`,
      JSON.stringify({ savedAt: Date.now(), data }),
    );
  } catch {
    // Ignore storage quota errors.
  }
}

export function clearLeetCodeCache(username = LEETCODE_USERNAME) {
  try {
    sessionStorage.removeItem(`${CACHE_KEY_PREFIX}:${username}`);
  } catch {
    // ignore
  }
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function getJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/** Fetch the LeetCode profile, trying each host in turn. */
async function fetchProfile(username) {
  let lastErr;
  for (const getUrl of PROFILE_HOSTS) {
    try {
      const data = await getJson(getUrl(username), 8000);
      // Validate that this looks like real profile data
      if (data && (data.totalSolved !== undefined || data.matchedUserStats)) {
        return data;
      }
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error('All profile hosts failed');
}

/** Fetch a secondary endpoint (/contest, /badges, etc.) with host fallback. */
async function fetchSecondary(username, path) {
  for (const host of SECONDARY_HOSTS) {
    try {
      const data = await getJson(`${host}/${username}${path}`, 6000);
      if (data) return data;
    } catch {
      // try next host
    }
  }
  return null;
}

// ─── Calendar / streak utilities ──────────────────────────────────────────────
export function parseSubmissionCalendar(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

export function totalSubmissionsInYear(calendar) {
  const oneYearAgo = Date.now() / 1000 - 365 * 86400;
  return Object.entries(calendar).reduce((sum, [ts, count]) => {
    return Number(ts) >= oneYearAgo ? sum + Number(count) : sum;
  }, 0);
}

export function computeMaxStreak(calendar) {
  const days = Object.keys(calendar)
    .map((ts) => {
      const date = new Date(Number(ts) * 1000);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => a - b);

  if (!days.length) return 0;

  let max = 1;
  let current = 1;

  for (let i = 1; i < days.length; i += 1) {
    const diff = (days[i] - days[i - 1]) / 86400000;
    if (diff === 1) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 1;
    }
  }

  return max;
}

function computeCurrentStreak(calendar) {
  const days = Object.keys(calendar || {})
    .map((ts) => {
      const date = new Date(Number(ts) * 1000);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => a - b);

  if (!days.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const yesterdayMs = todayMs - 86400000;

  const lastDay = days[days.length - 1];
  if (lastDay !== todayMs && lastDay !== yesterdayMs) return 0;

  let streak = 1;
  for (let i = days.length - 1; i > 0; i -= 1) {
    if ((days[i] - days[i - 1]) / 86400000 === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────
function formatDateLocal(year, month, day) {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function buildHeatmap(calendar) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countsByDay = {};
  for (const [ts, count] of Object.entries(calendar || {})) {
    const date = new Date(Number(ts) * 1000);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    countsByDay[key] = (countsByDay[key] || 0) + Number(count);
  }

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const months = [];
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const name = d.toLocaleDateString('en-US', { month: 'short' });
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let dayNum = 1; dayNum <= totalDays; dayNum += 1) {
      const dateKey = formatDateLocal(year, month, dayNum);
      const count = countsByDay[dateKey] || 0;
      days.push({ date: dateKey, dayNum, count, isPlaceholder: false });
    }

    const columns = [];
    for (let j = 0; j < days.length; j += 7) {
      const col = days.slice(j, j + 7);
      while (col.length < 7) col.push({ isPlaceholder: true });
      columns.push(col);
    }

    months.push({
      key: `${year}-${String(month + 1).padStart(2, '0')}`,
      name,
      year,
      month,
      totalDays,
      columns,
    });
  }

  return months;
}

export function heatmapLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

export function badgeIconUrl(icon) {
  if (!icon) return null;
  if (icon.startsWith('http')) return icon;
  return `https://leetcode.com${icon}`;
}

// ─── Parsers ──────────────────────────────────────────────────────────────────
function parseContest(contestData, profileRanking) {
  const hasContests = Boolean(contestData?.contestAttend);

  const ratingHistory = (contestData?.contestParticipation ?? [])
    .filter((entry) => entry.attended && entry.rating && entry.contest?.startTime)
    .sort((a, b) => a.contest.startTime - b.contest.startTime)
    .map((entry) => ({
      rating: Math.round(entry.rating),
      date: new Date(entry.contest.startTime * 1000),
      label: new Date(entry.contest.startTime * 1000).getFullYear().toString(),
    }));

  return {
    hasContests,
    rating: hasContests ? Math.round(contestData.contestRating) : null,
    badge: contestData?.contestBadges?.name ?? null,
    globalRank: contestData?.contestGlobalRanking ?? null,
    totalParticipants: contestData?.totalParticipants ?? null,
    contestsAttended: contestData?.contestAttend ?? 0,
    topPercentage: contestData?.contestTopPercentage ?? null,
    profileRanking,
    ratingHistory: ratingHistory.slice(-24),
  };
}

function parseProblems(profileData, progressData) {
  const progress = progressData?.numAcceptedQuestions ?? {};
  const failed = progress.numFailedQuestions ?? [];
  const attempting = failed.reduce((sum, item) => sum + (item.count ?? 0), 0);

  const acAll = byDifficulty(profileData.matchedUserStats?.acSubmissionNum, 'All');
  const totalAll = byDifficulty(profileData.matchedUserStats?.totalSubmissionNum, 'All');
  const acceptanceRate =
    acAll && totalAll && totalAll.submissions > 0
      ? Math.round((acAll.submissions / totalAll.submissions) * 100)
      : null;

  return {
    totalSolved: profileData.totalSolved ?? 0,
    totalQuestions: profileData.totalQuestions ?? 0,
    easy: profileData.easySolved ?? 0,
    totalEasy: profileData.totalEasy ?? 0,
    medium: profileData.mediumSolved ?? 0,
    totalMedium: profileData.totalMedium ?? 0,
    hard: profileData.hardSolved ?? 0,
    totalHard: profileData.totalHard ?? 0,
    attempting,
    ranking: profileData.ranking ?? null,
    acceptanceRate,
  };
}

function parseBadges(badgesData) {
  const badges = badgesData?.badges ?? [];
  const recent = badges[0] ?? badgesData?.activeBadge ?? null;

  return {
    count: badgesData?.badgesCount ?? badges.length,
    recent,
    featured: badges.slice(0, 3),
    upcoming: badgesData?.upcomingBadges ?? [],
  };
}

function parseActivity(profileData, calendarData) {
  const profileCalendar = parseSubmissionCalendar(profileData.submissionCalendar);
  const endpointCalendar = parseSubmissionCalendar(calendarData?.submissionCalendar);
  const calendar = Object.keys(endpointCalendar).length ? endpointCalendar : profileCalendar;

  return {
    submissionsPastYear: totalSubmissionsInYear(calendar),
    totalActiveDays: calendarData?.totalActiveDays ?? Object.keys(calendar).length,
    currentStreak: calendarData?.streak ?? computeCurrentStreak(calendar),
    maxStreak: computeMaxStreak(calendar),
    heatmap: buildHeatmap(calendar),
    calendar,
  };
}

function buildDashboard(username, profile, contest, badges, calendar, progress) {
  return {
    username,
    profileUrl: LEETCODE_PROFILE_URL,
    contest: parseContest(contest, profile.ranking),
    problems: parseProblems(profile, progress),
    badges: parseBadges(badges),
    activity: parseActivity(profile, calendar),
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function fetchLeetCodeDashboard(username = LEETCODE_USERNAME) {
  const cached = getCachedDashboard(username);
  if (cached) return cached;

  // Fetch profile (critical – throws if all hosts fail)
  const profile = await fetchProfile(username);

  // Fetch optional secondary endpoints concurrently with host fallback
  const [contestResult, badgesResult, calendarResult, progressResult] = await Promise.allSettled([
    fetchSecondary(username, '/contest'),
    fetchSecondary(username, '/badges'),
    fetchSecondary(username, '/calendar'),
    fetchSecondary(username, '/progress'),
  ]);

  const contest = contestResult.status === 'fulfilled' && contestResult.value
    ? contestResult.value
    : { contestParticipation: [] };

  const badges = badgesResult.status === 'fulfilled' && badgesResult.value
    ? badgesResult.value
    : { badgesCount: 0, badges: [], upcomingBadges: [] };

  const calendar = calendarResult.status === 'fulfilled' && calendarResult.value
    ? calendarResult.value
    : {};

  const progress = progressResult.status === 'fulfilled' && progressResult.value
    ? progressResult.value
    : null;

  const dashboard = buildDashboard(username, profile, contest, badges, calendar, progress);
  setCachedDashboard(username, dashboard);
  return dashboard;
}

// ─── Formatters ───────────────────────────────────────────────────────────────
export function formatRanking(ranking) {
  if (ranking == null) return '—';
  return ranking.toLocaleString('en-US');
}

export function formatNumber(value) {
  if (value == null) return '—';
  return value.toLocaleString('en-US');
}