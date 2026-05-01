'use client';
import { useState } from 'react';
import { useUser } from '../AuthenticateUser';

export default function FollowButton({ targetUserId, currentUserId, initialIsFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    if (!currentUserId || currentUserId === targetUserId) return;
    setLoading(true);
    const method = isFollowing ? 'DELETE' : 'POST';
    try {
      const res = await fetch(`/server/api/users/${targetUserId}/follow`, { method });
      if (res.ok) setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow action failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`follow-btn ${isFollowing ? 'following' : ''}`}
      onClick={toggleFollow}
      disabled={loading}
    >
      <i className="fas fa-plus"></i> {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}