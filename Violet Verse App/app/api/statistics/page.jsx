'use client';
import { useState, useEffect } from 'react';

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/statistics')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="stats-loading">Loading statistics...</div>;
  if (!stats) return <div className="stats-error">Failed to load statistics</div>;

  const { avg_followers, avg_posts, active_user, top_post, overview, top_users } = stats;

  return (
    <div className="stats-page">
      <h1 className="stats-title">📊 Platform Statistics</h1>

      {/* Overview Cards */}
      <section className="stats-section">
        <h2 className="stats-section-title">Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{overview?.userCount ?? 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{overview?.postCount ?? 0}</span>
            <span className="stat-label">Total Posts</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{overview?.likeCount ?? 0}</span>
            <span className="stat-label">Total Likes</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{overview?.commentCount ?? 0}</span>
            <span className="stat-label">Total Comments</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔗</span>
            <span className="stat-value">{overview?.followCount ?? 0}</span>
            <span className="stat-label">Total Follows</span>
          </div>
        </div>
      </section>

      {/* Averages */}
      <section className="stats-section">
        <h2 className="stats-section-title">Averages</h2>
        <div className="stats-grid">
          <div className="stat-card accent">
            <span className="stat-icon">📈</span>
            <span className="stat-value">{avg_followers}</span>
            <span className="stat-label">Avg Followers per User</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-icon">✍️</span>
            <span className="stat-value">{avg_posts}</span>
            <span className="stat-label">Avg Posts per User</span>
          </div>
        </div>
      </section>

      {/* Most Active User */}
      <section className="stats-section">
        <h2 className="stats-section-title">Most Active User (Last 3 Months)</h2>
        {active_user ? (
          <div className="stat-card highlight">
            <img
              src={active_user.user?.profilePic}
              alt={active_user.user?.displayName}
              className="stat-avatar"
            />
            <div className="stat-user-info">
              <span className="stat-user-name">{active_user.user?.displayName}</span>
              <span className="stat-user-sub">@{active_user.user?.username}</span>
              <span className="stat-badge">{active_user.postCount} posts</span>
            </div>
          </div>
        ) : <p className="stats-empty">No data available</p>}
      </section>

      {/* Most Liked Post */}
      <section className="stats-section">
        <h2 className="stats-section-title">Most Liked Post</h2>
        {top_post ? (
          <div className="stat-card highlight">
            <div className="stat-post-info">
              <p className="stat-post-content">"{top_post.post?.content}"</p>
              <span className="stat-user-sub">by @{top_post.post?.author?.username}</span>
              <span className="stat-badge">❤️ {top_post.likeCount} likes</span>
            </div>
          </div>
        ) : <p className="stats-empty">No data available</p>}
      </section>

      {/* Top Followed Users */}
      <section className="stats-section">
        <h2 className="stats-section-title">Top 5 Most Followed Users</h2>
        <div className="stats-list">
          {top_users?.map((item, index) => (
            <div key={item.user?.id} className="stat-list-item">
              <span className="stat-rank">#{index + 1}</span>
              <img
                src={item.user?.profilePic}
                alt={item.user?.displayName}
                className="stat-avatar-sm"
              />
              <div className="stat-user-info">
                <span className="stat-user-name">{item.user?.displayName}</span>
                <span className="stat-user-sub">@{item.user?.username}</span>
              </div>
              <span className="stat-badge">{item.followerCount} followers</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}