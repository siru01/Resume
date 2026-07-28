import { useEffect, useState } from 'react';
import {
  fetchLeetCodeStats,
  formatRanking,
  LEETCODE_PROFILE_URL,
  LEETCODE_USERNAME,
} from '../lib/leetcode';
import './LeetCodeStats.css';

export default function LeetCodeStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchLeetCodeStats()
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="prog-leetcode-block">
      <h3 className="prog-leetcode-heading">LeetCode</h3>

      <div className="prog-leetcode-card">
        {loading && (
          <p className="prog-leetcode-status">Loading stats… (first load can take a moment)</p>
        )}

        {!loading && error && (
          <div className="prog-leetcode-fallback">
            <p className="prog-leetcode-status">
              Stats could not be loaded right now.
            </p>
            <a
              href={LEETCODE_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="prog-leetcode-profile-link"
            >
              View profile on LeetCode ↗
            </a>
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <div className="prog-leetcode-summary">
              <div className="prog-leetcode-stat prog-leetcode-stat-primary">
                <span className="prog-leetcode-stat-value">{stats.totalSolved}</span>
                <span className="prog-leetcode-stat-label">Solved</span>
              </div>
              <div className="prog-leetcode-stat">
                <span className="prog-leetcode-stat-value">
                  {formatRanking(stats.ranking)}
                </span>
                <span className="prog-leetcode-stat-label">Global rank</span>
              </div>
              <div className="prog-leetcode-stat">
                <span className="prog-leetcode-stat-value">
                  {stats.acceptanceRate != null ? `${stats.acceptanceRate}%` : '—'}
                </span>
                <span className="prog-leetcode-stat-label">Acceptance</span>
              </div>
            </div>

            <div className="prog-leetcode-difficulty">
              <div className="prog-leetcode-pill prog-leetcode-pill-easy">
                <span>Easy</span>
                <strong>{stats.easy}</strong>
              </div>
              <div className="prog-leetcode-pill prog-leetcode-pill-medium">
                <span>Medium</span>
                <strong>{stats.medium}</strong>
              </div>
              <div className="prog-leetcode-pill prog-leetcode-pill-hard">
                <span>Hard</span>
                <strong>{stats.hard}</strong>
              </div>
            </div>

            <a
              href={stats.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="prog-leetcode-profile-link"
            >
              @{LEETCODE_USERNAME} on LeetCode ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}
