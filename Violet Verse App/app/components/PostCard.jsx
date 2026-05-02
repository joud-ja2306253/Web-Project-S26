"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ImageCarousel from "./ImageCarousel";

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useUser();
  const { showAlert, showConfirm, AlertComponent } = useAlert();
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.comment || post.content);
  const [deleting, setDeleting] = useState(false);

  // Check if current user is the post owner
  const isOwner = user?.id === post.authorId;

  // Check if post has images
  const hasImages = post.images && post.images.length > 0;

  const handleEdit = async () => {
    const updatedText = editContent.trim();

    // Check if post is empty AND has no images
    if (updatedText === "" && !hasImages) {
      showAlert("Post cannot be empty!", "warning");

      // Roll back to original content (stay in edit mode)
      setEditContent(post.comment || post.content);
      return; // Keep edit mode open
    }

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedText }),
      });

      if (res.ok) {
        post.comment = updatedText;
        post.content = updatedText;
        setIsEditing(false);
        setMenuOpen(false);
        showAlert("Post updated!", "success");
      } else {
        showAlert("Failed to update post", "error");
      }
    } catch (error) {
      console.error("Edit failed", error);
      showAlert("Failed to edit post", "error");
    }
  };

  const handleDelete = () => {
    // show confirmation before deleting
    showConfirm("Are you sure you want to delete this post?", async () => {
      setDeleting(true);
      try {
        const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
        if (res.ok && onPostDeleted) {
          onPostDeleted(post.id);
          showAlert("Post deleted!", "success");
        } else {
          showAlert("Failed to delete post", "error");
        }
      } catch (error) {
        console.error("Delete failed", error);
        showAlert("Failed to delete post", "error");
      } finally {
        setDeleting(false);
      }
    });
  };

  const viewUserProfile = () => {
    router.push(`/profile?userId=${post.authorId}`);
  };

  const toggleMenu = () => {
    if (menuOpen) {
      if (isEditing) {
        // Cancel edit mode when closing menu
        setIsEditing(false);
        setEditContent(post.comment || post.content);
      }
    }
    setMenuOpen(!menuOpen);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.comment || post.content);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="post_R" data-has-images={hasImages}>
        <div className="post-header">
          <div
            className="post-user-info"
            onClick={viewUserProfile}
            style={{ cursor: "pointer" }}
          >
            <img
              src={post.author?.profilePic || "/default-avatar.png"}
              className="post-profile-pic"
              alt=""
            />
            <h4>{post.author?.displayName || "Unknown User"}</h4>
          </div>
          <span className="time">
            {post.time || new Date(post.createdAt).toLocaleString()}
          </span>

          {isOwner && (
            <div className="menu">
              <button className="menu_btn" onClick={toggleMenu}>
                ⋮
              </button>
              {menuOpen && (
                <ul
                  id={`menuList-${post.id}`}
                  className="menu_li"
                  style={{ display: "block" }}
                >
                  <li>
                    <button
                      id={`edit_post-${post.id}`}
                      className="menu_li"
                      onClick={() => {
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                    >
                      Edit post
                    </button>
                  </li>
                  <li>
                    <button
                      id={`delete_post-${post.id}`}
                      className="menu_li"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      Delete post
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="post-content">
          {hasImages && (
            /*this is new*/
            <ImageCarousel
              images={post.images.map((img) => img.url || img)}
            />
          )}

          <div className="postEditContainer">
            {isEditing ? (
              <>
                <textarea
                  id={`postText-${post.id}`}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="edit-textarea"
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button
                    id={`savePost-${post.id}`}
                    className="postSaveBtn"
                    onClick={handleEdit}
                  >
                    Save
                  </button>
                  <button
                    className="postCancelBtn"
                    onClick={handleCancelEdit}
                    style={{
                      background: "#888",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p id={`postText-${post.id}`}>{post.comment || post.content}</p>
            )}
          </div>
        </div>

        <div className="post-actions">
          <div className="post_actions">
            <LikeButton postId={post.id} />
            <p id={`likeCount-${post.id}`}>{post.likes?.length || 0} likes</p>
          </div>
          <div>
            <button
              id={`commentBtn-${post.id}`}
              className="menu_btn"
              onClick={() => setShowComments(!showComments)}
            >
              🗨️
            </button>
          </div>
        </div>

        {showComments && (
          <div className="commentBox" style={{ display: "block" }}>
            <CommentSection postId={post.id} postAuthorId={post.authorId} />
          </div>
        )}
      </div>

      <AlertComponent />
    </>
  );
}
