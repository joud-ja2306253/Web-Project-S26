// app/components/LikeButton.jsx
'use client';
import { useState } from 'react';
import { useUser } from '../AuthenticateUser';

export default function LikeButton({ postId, initialLikes, initialLiked }) {
  const { user } = useUser();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (!user) return;
    
    setLoading(true);
    const method = liked ? 'DELETE' : 'POST';
    
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method });
      
      if (res.ok) {
        if (liked) {
          setLiked(false);
          setLikesCount(prev => prev - 1);
        } else {
          setLiked(true);
          setLikesCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Like toggle failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id={`likeBtn-${postId}`}
      className={`menu_btn ${liked ? 'liked' : ''}`}
      onClick={toggleLike}
      disabled={loading}
    >
      {liked ? '♥' : '♡'} {likesCount}
    </button>
  );
}