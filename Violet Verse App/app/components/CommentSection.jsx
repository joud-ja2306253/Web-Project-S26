'use client';
import { useState, useEffect } from 'react';
import { useUser } from '../AuthenticateUser';

export default function CommentSection({ postId, postAuthorId }) {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/server/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`/server/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const added = await res.json();
        setComments([added, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/server/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="commentBox">
      <div className="write-send-comment">
        <input
          className="enterComment"
          type="text"
          placeholder="write your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="sendComment" onClick={addComment}>Send</button>
      </div>
      <div className="comments-list">
        {comments.length === 0 && <p className="no-comments">No comments yet. Be the first!</p>}
        {comments.map(comment => (
          <div key={comment.id} className="comment_row">
            <p className="box">
              <strong>{comment.author?.displayName || comment.name}</strong>:{' '}
              <span className="comment-text">{comment.content}</span>
            </p>
            {(user?.id === comment.authorId || user?.id === postAuthorId) && (
              <button className="menu_btn CommentBtn" onClick={() => deleteComment(comment.id)}>Delete</button>
            )}
            {user?.id === comment.authorId && (
              <>
                <button className="menu_btn edit-save-btn" onClick={() => {/* edit logic */}}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}