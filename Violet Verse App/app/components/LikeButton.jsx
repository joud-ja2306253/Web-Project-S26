// app/components/LikeButton.jsx
'use client';
import { useState } from 'react';
import { useUser } from '../AuthenticateUser';
import { useAlert } from '../hooks/useAlert';

export default function LikeButton({ postId, initialLikes, initialLiked }) {
  const { user } = useUser();
  const { showAlert } = useAlert();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    // Original: if (!currentUserObj) return;
    if (!user) return;
    
    setLoading(true);
    
    // Original: if (!existingLike) { add } else { remove }
    const method = liked ? 'DELETE' : 'POST';
    
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method });
      
      // Original: update like count and button text
      if (res.ok) {
        if (liked) {
          // Original: likes = likes.filter(...) and likeBtn.textContent = "♡"
          setLiked(false);
          setLikesCount(prev => prev - 1);
        } else {
          // Original: likes.push(newLike) and likeBtn.textContent = "♥"
          setLiked(true);
          setLikesCount(prev => prev + 1);
        }
      } else {
        const error = await res.json();
        showAlert(error.error || "Failed to like post", "error");
      }
    } catch (error) {
      console.error('Like toggle failed', error);
      showAlert("Failed to like post", "error");
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