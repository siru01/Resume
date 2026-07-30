const LEETCODE_API = 'https://alfa-leetcode-api.onrender.com';

export const LEETCODE_USERNAME = 'SIRU10';
export const LEETCODE_PROFILE_URL = 'https://leetcode.com/u/SIRU10/';

function byDifficulty(entries, difficulty) {
  return entries?.find((entry) => entry.difficulty === difficulty);
}

const CACHE_KEY_PREFIX = 'leetcode-dashboard';
const CACHE_TTL_MS = 60 * 60 * 1000;

function getCachedDashboard(username) {
  try {
    const raw = sessionStorage.getItem(`${CACHE_KEY_PREFIX}:${username}`);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL_MS) return null;
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

async function fetchJson(path, { retries = 3, delayMs = 2500, timeoutMs = 60000 } = {}) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${LEETCODE_API}${path}`, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`Failed to load ${path} (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timer);
      lastError = error;

      if (attempt < retries - 1) {
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs * (attempt + 1));
        });
      }
    }
  }

  throw lastError;
}

export function parseSubmissionCalendar(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
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

function formatDateLocal(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function buildHeatmap(calendar, weeks = 26) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get Saturday of the current week
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));

  // Get start date (Sunday) of the 26-week period
  const start = new Date(end);
  start.setDate(start.getDate() - (weeks * 7 - 1));

  const countsByDay = {};
  for (const [ts, count] of Object.entries(calendar)) {
    const date = new Date(Number(ts) * 1000);
    const key = formatDateLocal(date);
    countsByDay[key] = (countsByDay[key] || 0) + Number(count);
  }

  const grid = [];
  const cursor = new Date(start);

  for (let w = 0; w < weeks; w += 1) {
    const week = [];
    for (let d = 0; d < 7; d += 1) {
      const key = formatDateLocal(cursor);
      week.push({ date: key, count: countsByDay[key] || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    grid.push(week);
  }

  return grid;
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

  const recentHistory = ratingHistory.slice(-24);

  return {
    hasContests,
    rating: hasContests ? Math.round(contestData.contestRating) : null,
    badge: contestData?.contestBadges?.name ?? null,
    globalRank: contestData?.contestGlobalRanking ?? null,
    totalParticipants: contestData?.totalParticipants ?? null,
    contestsAttended: contestData?.contestAttend ?? 0,
    topPercentage: contestData?.contestTopPercentage ?? null,
    profileRanking,
    ratingHistory: recentHistory,
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
    currentStreak: calendarData?.streak ?? 0,
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

export async function fetchLeetCodeDashboard(username = LEETCODE_USERNAME) {
  const cached = getCachedDashboard(username);
  if (cached) return cached;

  const profile = await fetchJson(`/${username}/profile`, { retries: 4, delayMs: 3000 });

  const [contestResult, badgesResult, calendarResult, progressResult] = await Promise.allSettled([
    fetchJson(`/${username}/contest`, { retries: 2 }),
    fetchJson(`/${username}/badges`, { retries: 2 }),
    fetchJson(`/${username}/calendar`, { retries: 2 }),
    fetchJson(`/${username}/progress`, { retries: 2 }),
  ]);

  const contest = contestResult.status === 'fulfilled'
    ? contestResult.value
    : { contestParticipation: [] };
  const badges = badgesResult.status === 'fulfilled'
    ? badgesResult.value
    : { badgesCount: 0, badges: [], upcomingBadges: [] };
  const calendar = calendarResult.status === 'fulfilled' ? calendarResult.value : {};
  const progress = progressResult.status === 'fulfilled' ? progressResult.value : null;

  const dashboard = buildDashboard(username, profile, contest, badges, calendar, progress);
  setCachedDashboard(username, dashboard);
  return dashboard;
}

export function formatRanking(ranking) {
  if (ranking == null) return '—';
  return ranking.toLocaleString('en-US');
}

export function formatNumber(value) {
  if (value == null) return '—';
  return value.toLocaleString('en-US');
}
