import { useEffect, useState } from 'react';
import {
  badgeIconUrl,
  fetchLeetCodeDashboard,
  formatNumber,
  formatRanking,
  heatmapLevel,
  LEETCODE_PROFILE_URL,
  LEETCODE_USERNAME,
} from '../lib/leetcode';
import './Progress.css';

function DonutChart({ solved, total }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? solved / total : 0;
  const offset = circumference * (1 - progress);

  return (
    <div className="prog-donut-wrap">
      <svg className="prog-donut" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} className="prog-donut-track" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="prog-donut-fill"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="prog-donut-center">
        <span className="prog-donut-solved">{solved}</span>
        <span className="prog-donut-total">/{total}</span>
      </div>
    </div>
  );
}

function RatingChart({ history }) {
  if (!history.length) {
    return (
      <div className="prog-chart-empty">
        <p>Contest rating trend appears after you join LeetCode contests.</p>
      </div>
    );
  }

  const width = 320;
  const height = 120;
  const padding = 16;
  const ratings = history.map((point) => point.rating);
  const min = Math.min(...ratings) - 40;
  const max = Math.max(...ratings) + 40;

  const points = history.map((point, index) => {
    const x = padding + (index / Math.max(history.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((point.rating - min) / Math.max(max - min, 1)) * (height - padding * 2);
    return `${x},${y}`;
  });

  const years = [...new Set(history.map((point) => point.date.getFullYear()))];

  return (
    <div className="prog-rating-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="prog-rating-svg" aria-hidden="true">
        <polyline points={points.join(' ')} className="prog-rating-line" />
        {history.map((point, index) => {
          const x = padding + (index / Math.max(history.length - 1, 1)) * (width - padding * 2);
          const y = height - padding - ((point.rating - min) / Math.max(max - min, 1)) * (height - padding * 2);
          return <circle key={`${point.date}-${index}`} cx={x} cy={y} r="2.5" className="prog-rating-dot" />;
        })}
      </svg>
      <div className="prog-rating-years">
        {years.map((year) => (
          <span key={year}>{year}</span>
        ))}
      </div>
    </div>
  );
}

function PercentileBars({ topPercentage }) {
  const buckets = [100, 50, 25, 10, 5, 2, 1, 0.5, 0.1];
  const activeIndex = topPercentage == null
    ? -1
    : buckets.findIndex((bucket) => topPercentage >= bucket);

  return (
    <div className="prog-percentile">
      <div className="prog-percentile-bars">
        {buckets.map((bucket, index) => (
          <div
            key={bucket}
            className={`prog-percentile-bar ${index === activeIndex ? 'is-active' : ''}`}
            style={{ height: `${18 + index * 8}px` }}
            title={`Top ${bucket}%`}
          />
        ))}
      </div>
      {topPercentage != null && (
        <p className="prog-percentile-label">Top {topPercentage}%</p>
      )}
    </div>
  );
}

function ContestCard({ contest }) {
  return (
    <article className="prog-card prog-contest-card">
      <h3 className="prog-card-title">Contest Performance</h3>

      <div className="prog-contest-body">
        <div className="prog-contest-left">
          <div className="prog-contest-rating-block">
            <span className="prog-contest-rating-label">Contest Rating</span>
            <span className="prog-contest-rating-value">
              {contest.rating != null ? formatNumber(contest.rating) : '—'}
            </span>
          </div>

          <div className="prog-contest-meta">
            {contest.badge && (
              <span className="prog-contest-badge">
                <span className="prog-shield" aria-hidden="true">◆</span>
                {contest.badge}
              </span>
            )}
            <span>
              {contest.hasContests
                ? `${formatRanking(contest.globalRank)} / ${formatRanking(contest.totalParticipants)}`
                : `Global rank ${formatRanking(contest.profileRanking)}`}
            </span>
            <span>{contest.contestsAttended} contests attended</span>
          </div>
        </div>

        <div className="prog-contest-charts">
          <RatingChart history={contest.ratingHistory} />
          <PercentileBars topPercentage={contest.topPercentage} />
        </div>
      </div>
    </article>
  );
}

function ProblemsCard({ problems }) {
  return (
    <article className="prog-card prog-problems-card">
      <h3 className="prog-card-title">Problem Solving Stats</h3>
      <div className="prog-problems-body">
        <DonutChart solved={problems.totalSolved} total={problems.totalQuestions} />
        <div className="prog-problems-breakdown">
          <div className="prog-diff-row easy">
            <span>Easy</span>
            <strong>{problems.easy} / {problems.totalEasy}</strong>
          </div>
          <div className="prog-diff-row medium">
            <span>Med.</span>
            <strong>{problems.medium} / {problems.totalMedium}</strong>
          </div>
          <div className="prog-diff-row hard">
            <span>Hard</span>
            <strong>{problems.hard} / {problems.totalHard}</strong>
          </div>
          {problems.attempting > 0 && (
            <p className="prog-attempting">{problems.attempting} attempting</p>
          )}
          <div className="prog-problems-meta">
            <span>Rank {formatRanking(problems.ranking)}</span>
            {problems.acceptanceRate != null && (
              <span>{problems.acceptanceRate}% acceptance</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function BadgesCard({ badges }) {
  const recentName = badges.recent?.displayName ?? 'No badges yet';

  return (
    <article className="prog-card prog-badges-card">
      <h3 className="prog-card-title">Badges</h3>
      <div className="prog-badges-body">
        <div className="prog-badges-count">{badges.count}</div>
        <div className="prog-badges-icons">
          {badges.featured.length > 0 ? (
            badges.featured.map((badge) => (
              <img
                key={badge.id}
                src={badgeIconUrl(badge.icon)}
                alt={badge.displayName}
                title={badge.displayName}
                className="prog-badge-icon"
              />
            ))
          ) : (
            badges.upcoming.slice(0, 2).map((badge) => (
              <img
                key={badge.name}
                src={badgeIconUrl(badge.icon)}
                alt={badge.name}
                title={badge.name}
                className="prog-badge-icon is-dim"
              />
            ))
          )}
        </div>
        <p className="prog-badges-recent">
          Most Recent Badge
          <strong>{recentName}</strong>
        </p>
      </div>
    </article>
  );
}

function ActivityCard({ activity }) {
  // Dynamically calculate month labels to match heatmap dates
  const monthLabels = (() => {
    const rawLabels = [];
    let prevMonth = null;

    activity.heatmap.forEach((week, index) => {
      const dateStr = week[0].date;
      const [yearStr, monthStr] = dateStr.split('-');
      const monthKey = `${yearStr}-${monthStr}`;

      if (monthKey !== prevMonth) {
        const date = new Date(Number(yearStr), Number(monthStr) - 1, 1);
        const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        rawLabels.push({ index, label });
        prevMonth = monthKey;
      }
    });

    const filteredLabels = [];
    for (let i = 0; i < rawLabels.length; i += 1) {
      const current = rawLabels[i];
      const next = rawLabels[i + 1];
      if (next && next.index - current.index < 3) {
        continue;
      }
      filteredLabels.push(current);
    }

    return filteredLabels;
  })();

  return (
    <article className="prog-card prog-activity-card">
      <h3 className="prog-card-title">
        {formatNumber(activity.submissionsPastYear)} submissions in the past one year
      </h3>
      <div className="prog-activity-meta">
        <span>Total active days: {activity.totalActiveDays}</span>
        <span>Current streak: {activity.currentStreak}</span>
        <span>Max streak: {activity.maxStreak}</span>
      </div>

      <div className="prog-heatmap-wrap">
        <div className="prog-heatmap">
          {activity.heatmap.map((week, weekIndex) => (
            <div key={weekIndex} className="prog-heatmap-week">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`prog-heatmap-cell level-${heatmapLevel(day.count)}`}
                  title={`${day.date}: ${day.count} submission${day.count === 1 ? '' : 's'}`}
                  aria-label={`${day.date}: ${day.count} submission${day.count === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="prog-heatmap-months">
          {activity.heatmap.map((_, index) => {
            const labelObj = monthLabels.find((ml) => ml.index === index);
            return (
              <div key={index} className="prog-heatmap-month-col">
                {labelObj && (
                  <span className="prog-heatmap-month-label">
                    {labelObj.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchLeetCodeDashboard()
      .then((dashboard) => {
        if (!cancelled) {
          setData(dashboard);
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
  }, [reloadKey]);

  const handleRetry = () => setReloadKey((key) => key + 1);

  return (
    <section className="prog-page">
      <h2 className="prog-section-title">Progress</h2>

      {loading && (
        <p className="prog-status">Loading LeetCode data… first load can take a moment.</p>
      )}

      {!loading && error && (
        <div className="prog-card prog-error-card">
          <p className="prog-status">Could not load LeetCode stats right now.</p>
          <div className="prog-error-actions">
            <button type="button" className="prog-retry-button" onClick={handleRetry}>
              Retry
            </button>
            <a href={LEETCODE_PROFILE_URL} target="_blank" rel="noreferrer" className="prog-profile-link">
              View @{LEETCODE_USERNAME} on LeetCode ↗
            </a>
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <ContestCard contest={data.contest} />

          <div className="prog-grid-two">
            <ProblemsCard problems={data.problems} />
            <BadgesCard badges={data.badges} />
          </div>

          <ActivityCard activity={data.activity} />

          <a
            href={data.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="prog-profile-link"
          >
            @{LEETCODE_USERNAME} on LeetCode ↗
          </a>
        </>
      )}
    </section>
  );
}