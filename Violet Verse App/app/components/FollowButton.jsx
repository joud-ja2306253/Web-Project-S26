// 'use client';
// import { useState } from 'react';
// import { useUser } from '../AuthenticateUser';

// export default function FollowButton({ targetUserId, currentUserId, initialIsFollowing }) {
//   const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
//   const [loading, setLoading] = useState(false);

//   const toggleFollow = async () => {
//     if (!currentUserId || currentUserId === targetUserId) return;
//     setLoading(true);
//     const method = isFollowing ? 'DELETE' : 'POST';
//     try {
//       const res = await fetch(`/api/users/${targetUserId}/follow`, { method });
//       if (res.ok) setIsFollowing(!isFollowing);
//     } catch (error) {
//       console.error('Follow action failed', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       className={`follow-btn ${isFollowing ? 'following' : ''}`}
//       onClick={toggleFollow}
//       disabled={loading}
//     >
//       <i className="fas fa-plus"></i> {isFollowing ? 'Following' : 'Follow'}
//     </button>
//   );
// }
"use client";
import { useState } from "react";

export default function FollowButton({
  targetUserId,
  currentUserId,
  initialIsFollowing,
  onFollowChange,
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    if (!currentUserId || currentUserId === targetUserId) return;

    setLoading(true);

    try {
      const method = isFollowing ? "DELETE" : "POST";

      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method,
      });

      const data = await res.json();

      if (res.ok) {
        setIsFollowing(data.following);

        if (onFollowChange) {
          onFollowChange();
        }
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Follow action failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`follow-btn ${isFollowing ? "following" : ""}`}
      onClick={toggleFollow}
      disabled={loading}
    >
      <i className="fas fa-plus"></i> {isFollowing ? "Following" : "Follow"}
    </button>
  );
}