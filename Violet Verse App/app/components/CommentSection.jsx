"use client";
import { useState, useEffect } from "react";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";

export default function CommentSection({ postId, postAuthorId }) {
  const { user } = useUser();
  const { showAlert, showConfirm, AlertComponent } = useAlert();

  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
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
        showAlert("Comment updated!", "success");
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

  const getUserName = (authorId) => {
    const u = users.find((user) => user.id === authorId);
    return u ? u.displayName : "Unknown";
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <>
      <div className="commentBox">
        {/* Add comment */}
        <div className="write-send-comment">
          <input
            className="enterComment"
            id={`enterComment-${postId}`}
            type="text"
            placeholder="write your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addComment();
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

        {/* Comments list */}
        <div className="loadedCommnetText">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`comment_row ${
                editingCommentId === comment.id ? "comment_row_editing" : ""
              }`}
            >
              
              <div className="box">
                <strong>{getUserName(comment.authorId)}</strong>:

                {editingCommentId === comment.id ? (
                  <>
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
                  <span className="comment-text">
                    {comment.content}
                  </span>
                )}
              </div>

              {editingCommentId !== comment.id &&
                (user?.id === comment.authorId ||
                user?.id === postAuthorId) && (
                <button
                  className="menu_btn CommentBtn"
                  onClick={() => deleteComment(comment.id)}
                >
                  Delete
                </button>
              )}

              {user?.id === comment.authorId &&
                editingCommentId !== comment.id && (
                  <button
                    className="menu_btn CommentBtn edit-save-btn"
                    onClick={() => startEdit(comment)}
                  >
                    Edit
                  </button>
                )}
            </div>
          ))}
        </div>
      </div>

      <AlertComponent />
    </>
  );
}
