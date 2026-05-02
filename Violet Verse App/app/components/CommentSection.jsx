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
    if (text === "") return;

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
    }
  };

  const deleteComment = async (commentId) => {
    showConfirm("Are you sure you want to delete this comment?", async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setComments(comments.filter((c) => c.id !== commentId));
        }
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    });
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = async (commentId) => {
    const updated = editContent.trim();

    if (updated === "") {
      showAlert("Comment cannot be empty!", "warning");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: updated }),
      });

      if (res.ok) {
        setComments(
          comments.map((c) =>
            c.id === commentId ? { ...c, content: updated } : c
          )
        );
        setEditingCommentId(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Failed to edit comment", error);
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
        {/* input */}
        <div className="write-send-comment">
          <input
            className="enterComment"
            type="text"
            placeholder="write your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addComment();
            }}
          />
          <button className="sendComment" onClick={addComment}>
            Send
          </button>
        </div>

        {/* comments */}
        {comments.map((comment) => (
          <div key={comment.id} className="comment_row">
            {editingCommentId === comment.id ? (
              <>
                {/* ✅ uses your CSS */}
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="comment-text-editing"
                />

                <button
                  onClick={() => saveEdit(comment.id)}
                  className="menu_btn CommentBtn"
                >
                  Save
                </button>

                <button
                  onClick={cancelEdit}
                  className="menu_btn CommentBtn"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="box">
                  <strong>
                    {comment.author?.displayName || comment.name}
                  </strong>
                  :
                  <span className="comment-text">
                    {comment.content}
                  </span>
                </div>

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
                    onClick={() => startEdit(comment)}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <AlertComponent />
    </>
  );
}