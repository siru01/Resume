import './Progress.css';
import LeetCodeStats from './LeetCodeStats';

export default function Progress() {
  return (
    <section className="prog-page">
      <h2 className="prog-section-title">Progress</h2>
      <p className="prog-intro">
        Live coding practice pulled from LeetCode — problem counts, rank, and acceptance rate update when you visit.
      </p>
      <LeetCodeStats />
    </section>
  );
}
