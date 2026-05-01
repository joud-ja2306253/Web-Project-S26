// app/components/ProfileInfo.jsx
'use client';
import FollowButton from './FollowButton';

export default function ProfileInfo({ profileUser, isOwnProfile, currentUserId, onFollowChange, onSettingsClick }) {
  return (
    <div className="profile-info-container">
      <div className="profile-info">
        <div className="top-field">
          <img 
            className="profile-pic" 
            src={profileUser.profilePic || '/default-avatar.png'} 
            alt="profile picture" 
          />
          <div className="top-row">
            <div className="names">
              <h3 className="displayName">{profileUser.displayName}</h3>
              <p className="username">@{profileUser.username}</p>
            </div>
            <div>
              {isOwnProfile ? (
                <button className="settingsBtn" id="settingsBtn" onClick={onSettingsClick}>
                  Settings
                </button>
              ) : (
                <FollowButton 
                  targetUserId={profileUser.id}
                  currentUserId={currentUserId}
                  initialIsFollowing={profileUser.isFollowing || false}
                  onFollowChange={onFollowChange}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bio">
          <p>{profileUser.bio || 'No bio yet'}</p>
        </div>

        <div className="profile-data">
          <div>
            <p>{profileUser._count?.posts || 0}</p>
            <p className="labeling">Posts</p>
          </div>
          <div>
            <p>{profileUser._count?.followers || 0}</p>
            <p className="labeling">Followers</p>
          </div>
          <div>
            <p>{profileUser._count?.following || 0}</p>
            <p className="labeling">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
}