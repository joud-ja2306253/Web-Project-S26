"use client";

import { useEffect, useState } from "react";
import { useUser } from "../AuthenticateUser";

export default function LikeButton({ postId, initialLikes = 0, initialLiked = false }) {
  const { user } = useUser();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(initialLikes);
  }, [initialLiked, initialLikes]);

  const toggleLike = async () => {
    if (!user || loading) return;

    setLoading(true);

    try {
      const method = liked ? "DELETE" : "POST";

      const res = await fetch(`/api/posts/${postId}/like`, {
        method,
      });

      const data = await res.json();

      if (res.ok) {
        setLiked(data.liked);
        setLikesCount(data.likeCount);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Like toggle failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="like_action">
      <button
        id={`likeBtn-${postId}`}
        className={`menu_btn ${liked ? "liked" : ""}`}
        onClick={toggleLike}
        disabled={loading}
        aria-label={liked ? "Unlike post" : "Like post"}
        title={liked ? "Unlike post" : "Like post"}
      >
        {liked ? "\u2665" : "\u2661"}
      </button>
      <span className="like_count">{likesCount}</span>
    </div>
  );
}
