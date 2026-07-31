const LEETCODE_API = 'https://alfa-leetcode-api.onrender.com';
const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

export const LEETCODE_USERNAME = 'SIRU10';
export const LEETCODE_PROFILE_URL = 'https://leetcode.com/u/SIRU10/';

function byDifficulty(entries, difficulty) {
  return entries?.find((entry) => entry.difficulty === difficulty);
}

const CACHE_KEY_PREFIX = 'leetcode-dashboard';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

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
  } catch (error) {
    console.warn('Cache retrieval failed:', error);
    return null;
  }
}

function setCachedDashboard(username, data) {
  try {
    sessionStorage.setItem(
      `${CACHE_KEY_PREFIX}:${username}`,
      JSON.stringify({ savedAt: Date.now(), data }),
    );
  } catch (error) {
    console.warn('Cache storage failed:', error);
  }
}

function clearCache(username) {
  try {
    sessionStorage.removeItem(`${CACHE_KEY_PREFIX}:${username}`);
  } catch (error) {
    console.warn('Cache clear failed:', error);
  }
}

async function fetchJson(path, { 
  retries = 4, 
  delayMs = 2000, 
  timeoutMs = 15000,
  baseUrl = LEETCODE_API 
} = {}) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `${baseUrl}${path}`;
      console.log(`[Attempt ${attempt + 1}/${retries}] Fetching: ${url}`);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load ${path}`);
      }

      const data = await response.json();
      console.log(`✓ Successfully fetched: ${path}`);
      return data;
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
      console.warn(`✗ Attempt ${attempt + 1} failed:`, error.message);

      if (attempt < retries - 1) {
        // Exponential backoff with jitter
        const baseDelay = delayMs * Math.pow(1.5, attempt);
        const jitter = Math.random() * 500;
        const totalDelay = baseDelay + jitter;
        
        console.log(`⏳ Retrying in ${Math.round(totalDelay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, totalDelay));
      }
    }
  }

  throw new Error(`Failed after ${retries} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Alternative: GraphQL API for more reliable data fetching
async function fetchLeetCodeGraphQL(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          realName
          reputation
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        problemsSolvedBeatsStats {
          difficulty
          percentage
        }
        userCalendar {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
        }
        badges {
          id
          displayName
          medal {
            slug
            config {
              icon
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
    }

    return data.data?.matchedUser;
  } catch (error) {
    console.error('GraphQL fetch failed:', error);
    return null;
  }
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

function formatDateLocal(year, month, day) {
  const yyyy = year;
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
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
      while (col.length < 7) {
        col.push({ isPlaceholder: true });
      }
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
  // Try to return cached data first
  const cached = getCachedDashboard(username);
  if (cached) {
    console.log('📦 Returning cached dashboard');
    return cached;
  }

  try {
    console.log('🔄 Fetching fresh LeetCode data...');
    
    // Try primary API with better retry logic
    const profile = await fetchJson(`/${username}/profile`, { 
      retries: 5, 
      delayMs: 2500,
      timeoutMs: 20000
    });

    const [contestResult, badgesResult, calendarResult, progressResult] = await Promise.allSettled([
      fetchJson(`/${username}/contest`, { retries: 3, delayMs: 2000 }),
      fetchJson(`/${username}/badges`, { retries: 3, delayMs: 2000 }),
      fetchJson(`/${username}/calendar`, { retries: 3, delayMs: 2000 }),
      fetchJson(`/${username}/progress`, { retries: 3, delayMs: 2000 }),
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
    console.log('✅ Dashboard fetched and cached successfully');
    return dashboard;
  } catch (error) {
    console.error('❌ Primary API failed:', error.message);
    
    // Fallback: Try GraphQL API as alternative
    console.log('🔄 Attempting GraphQL API fallback...');
    const graphqlData = await fetchLeetCodeGraphQL(username);
    
    if (graphqlData) {
      const fallbackDashboard = {
        username,
        profileUrl: LEETCODE_PROFILE_URL,
        contest: parseContest({}, graphqlData.profile?.ranking),
        problems: {
          totalSolved: graphqlData.submitStats?.acSubmissionNum?.reduce((sum, s) => sum + s.count, 0) || 0,
          totalQuestions: graphqlData.submitStats?.totalSubmissionNum?.reduce((sum, s) => sum + s.count, 0) || 0,
          easy: graphqlData.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Easy')?.count || 0,
          medium: graphqlData.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Medium')?.count || 0,
          hard: graphqlData.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Hard')?.count || 0,
          ranking: graphqlData.profile?.ranking || null,
          acceptanceRate: null,
        },
        badges: {
          count: graphqlData.badges?.length || 0,
          recent: graphqlData.badges?.[0] || null,
          featured: graphqlData.badges?.slice(0, 3) || [],
          upcoming: [],
        },
        activity: {
          submissionsPastYear: 0,
          totalActiveDays: graphqlData.userCalendar?.totalActiveDays || 0,
          currentStreak: graphqlData.userCalendar?.streak || 0,
          maxStreak: 0,
          heatmap: [],
          calendar: parseSubmissionCalendar(graphqlData.userCalendar?.submissionCalendar),
        }
      };
      setCachedDashboard(username, fallbackDashboard);
      console.log('✅ Fallback GraphQL data cached');
      return fallbackDashboard;
    }

    throw new Error(`All APIs failed. Last error: ${error.message}`);
  }
}

export function formatRanking(ranking) {
  if (ranking == null) return '—';
  return ranking.toLocaleString('en-US');
}

export function formatNumber(value) {
  if (value == null) return '—';
  return value.toLocaleString('en-US');
}

// Helper: Clear cache if needed (call this on retry button click)
export function clearLeetCodeCache(username = LEETCODE_USERNAME) {
  clearCache(username);
  console.log(`✓ Cache cleared for ${username}`);
}