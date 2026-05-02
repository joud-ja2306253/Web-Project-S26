"use client";
import { useState, useEffect } from "react";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";

export default function CommentSection({ postId, postAuthorId }) {
  const { user } = useUser();
  const { showAlert } = useAlert();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    const text = newComment.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (res.ok) {
        const added = await res.json();
        setComments([added, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
      showAlert("Failed to add comment", "error");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
        showAlert("Comment deleted", "success");
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
      showAlert("Failed to delete comment", "error");
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = async (commentId) => {
    if (!editContent.trim()) {
      showAlert("Comment cannot be empty!", "warning");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editContent }),
      });
      if (res.ok) {
        setComments(
          comments.map((c) =>
            c.id === commentId ? { ...c, content: editContent } : c,
          ),
        );
        setEditingCommentId(null);
        setEditContent("");
        showAlert("Comment updated", "success");
      }
    } catch (error) {
      console.error("Failed to edit comment", error);
      showAlert("Failed to edit comment", "error");
    }
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="commentBox">
      <div className="write-send-comment">
        <input
          className="enterComment"
          id={`enterComment-${postId}`}
          type="text"
          placeholder="write your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="sendComment"
          id={`sendComment-${postId}`}
          onClick={addComment}
        >
          Send
        </button>
      </div>
      <p className="loadedCommnetText" id={`loadedCommnetText-${postId}`}>
        {comments.map((comment) => (
          <div key={comment.id} className="comment_row">
            {editingCommentId === comment.id ? (
              <div className="comment-edit">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="edit-comment-input"
                />
                <button
                  onClick={() => saveEdit(comment.id)}
                  className="save-edit-btn"
                >
                  Save
                </button>
                <button onClick={cancelEdit} className="cancel-edit-btn">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="box" id={`comment-${comment.id}`}>
                  <strong>{comment.author?.displayName || comment.name}</strong>
                  :
                  <span
                    className="comment-text"
                    id={`commentText-${comment.id}`}
                  >
                    {comment.content}
                  </span>
                </p>
                {(user?.id === comment.authorId ||
                  user?.id === postAuthorId) && (
                  <button
                    className="menu_btn CommentBtn"
                    onClick={() => deleteComment(comment.id)}
                  >
                    Delete
                  </button>
                )}
                {user?.id === comment.authorId && (
                  <button
                    className="menu_btn CommentBtn edit-save-btn"
                    id={`editBtn-${comment.id}`}
                    onClick={() => startEdit(comment)}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </p>
    </div>
  );

}
