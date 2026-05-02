"use client";
import { useState, useEffect } from "react";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";

export default function CommentSection({ postId, postAuthorId }) {
  const { user } = useUser();
  const { showAlert, showConfirm, AlertComponent } = useAlert();
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
    
    // Check if comment is empty
    if (text === "") {
      return; // Just return silently like vanilla JS
    }

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
        showAlert("Comment added!", "success");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
      showAlert("Failed to add comment", "error");
    }
  };

  const deleteComment = async (commentId) => {
    // Show confirmation before deleting
    showConfirm("Are you sure you want to delete this comment?", async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setComments(comments.filter((c) => c.id !== commentId));
          showAlert("Comment deleted!", "success");
        } else {
          showAlert("Failed to delete comment", "error");
        }
      } catch (error) {
        console.error("Failed to delete comment", error);
        showAlert("Failed to delete comment", "error");
      }
    });
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = async (commentId) => {
    const updatedComment = editContent.trim();
    
    // Check if comment is empty
    if (updatedComment === "") {
      showAlert("Comment cannot be empty!", "warning");
      
      // Roll back to original comment (stay in edit mode)
      const originalComment = comments.find((c) => c.id === commentId);
      if (originalComment) {
        setEditContent(originalComment.content);
      }
      return; // Keep edit mode open
    }

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: updatedComment }),
      });
      if (res.ok) {
        setComments(
          comments.map((c) =>
            c.id === commentId ? { ...c, content: updatedComment } : c,
          ),
        );
        setEditingCommentId(null);
        setEditContent("");
        showAlert("Comment updated!", "success");
      } else {
        showAlert("Failed to update comment", "error");
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
    <>
      <div className="commentBox">
        <div className="write-send-comment">
          <input
            className="enterComment"
            id={`enterComment-${postId}`}
            type="text"
            placeholder="write your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addComment();
              }
            }}
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
      
      <AlertComponent />
    </>
  );
}