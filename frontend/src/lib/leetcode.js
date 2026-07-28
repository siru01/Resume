const LEETCODE_API = 'https://alfa-leetcode-api.onrender.com';

export const LEETCODE_USERNAME = 'SIRU10';
export const LEETCODE_PROFILE_URL = 'https://leetcode.com/u/SIRU10/';

function byDifficulty(entries, difficulty) {
  return entries?.find((entry) => entry.difficulty === difficulty);
}

export function parseLeetCodeProfile(data) {
  const acAll = byDifficulty(data.matchedUserStats?.acSubmissionNum, 'All');
  const totalAll = byDifficulty(data.matchedUserStats?.totalSubmissionNum, 'All');

  const acceptanceRate =
    acAll && totalAll && totalAll.submissions > 0
      ? Math.round((acAll.submissions / totalAll.submissions) * 100)
      : null;

  return {
    totalSolved: data.totalSolved ?? 0,
    easy: data.easySolved ?? 0,
    medium: data.mediumSolved ?? 0,
    hard: data.hardSolved ?? 0,
    ranking: data.ranking ?? null,
    acceptanceRate,
    profileUrl: LEETCODE_PROFILE_URL,
  };
}

export async function fetchLeetCodeStats(username = LEETCODE_USERNAME) {
  const response = await fetch(`${LEETCODE_API}/${username}/profile`);
  if (!response.ok) {
    throw new Error('Failed to load LeetCode stats');
  }
  const data = await response.json();
  return parseLeetCodeProfile(data);
}

export function formatRanking(ranking) {
  if (ranking == null) return '—';
  return ranking.toLocaleString('en-US');
}
