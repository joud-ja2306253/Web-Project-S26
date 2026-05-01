// app/components/ProfileTabs.jsx
'use client';

export default function ProfileTabs({ activeTab, onTabChange }) {
  return (
    <div className="profile-tabs">
      <button 
        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
        data-tab="text"
        onClick={() => onTabChange('posts')}
      >
        <i className="fa-solid fa-align-left"></i> Posts
      </button>
      <button 
        className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
        data-tab="photos"
        onClick={() => onTabChange('photos')}
      >
        <i className="fa-solid fa-image"></i> Photos
      </button>
    </div>
  );
}