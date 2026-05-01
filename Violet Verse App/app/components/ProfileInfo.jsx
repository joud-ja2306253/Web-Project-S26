'use client';
import FollowButton from '@/components/FollowButton';

export default function ProfileInfo({ profileUser, currentUserId, isOwnProfile, onFollowChange }) {
  const postCount = profileUser.posts?.length || 0;
  const followersCount = profileUser._count?.followers || 0;
  const followingCount = profileUser._count?.following || 0;

  return (
    <div className="profile-info-container">
      <div className="profile-info">
        <div className="top-field">
          <img className="profile-pic" src={profileUser.profilePic || '/default-avatar.png'} alt="profile" />
          <div className="top-row">
            <div className="names">
              <h3 className="displayName">{profileUser.displayName}</h3>
              <p className="username">@{profileUser.username}</p>
            </div>
            <div>
              {!isOwnProfile && (
                <FollowButton
                  targetUserId={profileUser.id}
                  currentUserId={currentUserId}
                  initialIsFollowing={profileUser.isFollowing || false}
                />
              )}
              {isOwnProfile && (
                <button className="settingsBtn" id="settingsBtn">Settings</button>
              )}
            </div>
          </div>
        </div>
        <div className="bio">
          <p>{profileUser.bio || 'No bio yet'}</p>
        </div>
        <div className="profile-data">
          <div><p>{postCount}</p><p className="labeling">Posts</p></div>
          <div><p>{followersCount}</p><p className="labeling">Followers</p></div>
          <div><p>{followingCount}</p><p className="labeling">Following</p></div>
        </div>
      </div>
    </div>
  );
}