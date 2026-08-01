// ─── Config ───────────────────────────────────────────────────────────────────
export const LEETCODE_USERNAME = 'SIRU10';
export const LEETCODE_PROFILE_URL = 'https://leetcode.com/u/SIRU10/';

// Use Vite proxy path to bypass CSP/CORS restrictions
// In vite.config.js: proxy /api/leetcode -> https://leetcode-api-faisalshohag.vercel.app
const LEETCODE_API_BASE = '/api/leetcode';

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

// ─── Calendar / Streak Utilities ──────────────────────────────────────────────
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
    if ((days[i] - days[i - 1]) / 86400000 === 1) {
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

// ─── Main Export ──────────────────────────────────────────────────────────────
export async function fetchLeetCodeDashboard(username = LEETCODE_USERNAME) {
  const cached = getCachedDashboard(username);
  if (cached) {
    console.log('✅ Using cached LeetCode data');
    return cached;
  }

  try {
    console.log(`🔄 Fetching LeetCode data for ${username}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(`${LEETCODE_API_BASE}/${username}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    
    const apiData = await res.json();
    console.log('✅ LeetCode data fetched successfully');

    const calendar = parseSubmissionCalendar(apiData.submissionCalendar || {});
    
    const acStats = apiData.matchedUserStats?.acSubmissionNum || [];
    const acAll = acStats.find((e) => e.difficulty === 'All')?.count ?? apiData.totalSolved ?? 0;
    const acEasy = acStats.find((e) => e.difficulty === 'Easy')?.count ?? apiData.easySolved ?? 0;
    const acMedium = acStats.find((e) => e.difficulty === 'Medium')?.count ?? apiData.mediumSolved ?? 0;
    const acHard = acStats.find((e) => e.difficulty === 'Hard')?.count ?? apiData.hardSolved ?? 0;

    const totalStats = apiData.matchedUserStats?.totalSubmissionNum || [];
    const totalAll = totalStats.find((e) => e.difficulty === 'All')?.count ?? apiData.totalSubmissions ?? 0;
    const acceptanceRate = totalAll > 0 ? Math.round((acAll / totalAll) * 100) : null;

    const dashboard = {
      username,
      profileUrl: LEETCODE_PROFILE_URL,
      problems: {
        totalSolved: acAll,
        totalQuestions: apiData.totalQuestions ?? 4000,
        easy: acEasy,
        totalEasy: apiData.totalEasy ?? 950,
        medium: acMedium,
        totalMedium: apiData.totalMedium ?? 2000,
        hard: acHard,
        totalHard: apiData.totalHard ?? 950,
        attempting: 0,
        ranking: apiData.ranking ?? null,
        acceptanceRate,
      },
      badges: {
        count: apiData.badges?.length ?? 0,
        recent: apiData.badges?.[0] ?? null,
        featured: apiData.badges?.slice(0, 3) ?? [],
        upcoming: apiData.upcomingBadges ?? [],
      },
      contest: {
        hasContests: Boolean(apiData.userContestRanking?.attendedContestsCount),
        rating: apiData.userContestRanking?.rating ?? null,
        badge: apiData.userContestRanking?.badge?.name ?? null,
        globalRank: apiData.userContestRanking?.globalRanking ?? null,
        totalParticipants: apiData.userContestRanking?.totalParticipants ?? null,
        contestsAttended: apiData.userContestRanking?.attendedContestsCount ?? 0,
        topPercentage: apiData.userContestRanking?.topPercentage ?? null,
        profileRanking: apiData.ranking ?? null,
        ratingHistory: [],
      },
      activity: {
        submissionsPastYear: totalSubmissionsInYear(calendar),
        totalActiveDays: Object.keys(calendar).length,
        currentStreak: computeCurrentStreak(calendar),
        maxStreak: computeMaxStreak(calendar),
        heatmap: buildHeatmap(calendar),
        calendar,
      },
    };

    setCachedDashboard(username, dashboard);
    return dashboard;
  } catch (err) {
    console.error('❌ Error fetching LeetCode data:', err);
    throw new Error(`Failed to fetch LeetCode stats: ${err.message}`);
  }
}

export async function fetchLeetCodeStats(username = LEETCODE_USERNAME) {
  const dashboard = await fetchLeetCodeDashboard(username);
  return {
    profileUrl: dashboard.profileUrl,
    totalSolved: dashboard.problems.totalSolved,
    ranking: dashboard.problems.ranking,
    acceptanceRate: dashboard.problems.acceptanceRate,
    easy: dashboard.problems.easy,
    medium: dashboard.problems.medium,
    hard: dashboard.problems.hard,
  };
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