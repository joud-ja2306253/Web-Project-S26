// app/components/PostCard.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../AuthenticateUser';
import { useAlert } from '../hooks/useAlert';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useUser();
  const { showAlert, showConfirm } = useAlert();
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.comment || post.content);
  const [deleting, setDeleting] = useState(false);

  // Check if current user is the post owner (matches original)
  const isOwner = user?.id === post.userId;
  
  // Check if post has images (matches original data-has-images)
  const hasImages = post.images && post.images.length > 0;

  // Handle edit - matches original editPost + savePostEdit logic
  const handleEdit = async () => {
    const updatedText = editContent.trim();
    const hasImages = post.images && post.images.length > 0;

    // Original logic: if empty text AND no images, show warning
    if (updatedText === "" && !hasImages) {
      showAlert("Post cannot be empty!", "warning");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedText }),
      });
      if (res.ok) {
        post.comment = updatedText;
        post.content = updatedText;
        setIsEditing(false);
        setMenuOpen(false);
        showAlert("Post updated!", "success");
      }
    } catch (error) {
      console.error('Edit failed', error);
      showAlert("Failed to edit post", "error");
    }
  };

  // Handle delete - matches original deletePost logic
  const handleDelete = () => {
    showConfirm("Are you sure you want to delete this post?", async () => {
      setDeleting(true);
      try {
        const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
        if (res.ok && onPostDeleted) {
          onPostDeleted(post.id);
          showAlert("Post deleted!", "success");
        }
      } catch (error) {
        console.error('Delete failed', error);
        showAlert("Failed to delete post", "error");
      } finally {
        setDeleting(false);
      }
    });
  };

  // View user profile - matches original viewUserProfile
  const viewUserProfile = () => {
    router.push(`/profile?userId=${post.userId}`);
  };

  // Toggle menu - matches original toggleMenu
  const toggleMenu = () => {
    if (menuOpen) {
      // Cancel edit mode if open
      if (isEditing) {
        setIsEditing(false);
        setEditContent(post.comment || post.content);
      }
    }
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="post_R" data-has-images={hasImages}>
      <div className="post-header">
        <div className="post-user-info" onClick={viewUserProfile} style={{ cursor: 'pointer' }}>
          <img src={post.author?.profilePic || '/default-avatar.png'} className="post-profile-pic" alt="" />
          <h4>{post.author?.displayName || 'Unknown User'}</h4>
        </div>
        <span className="time">{post.time || new Date(post.createdAt).toLocaleString()}</span>
        
        {isOwner && (
          <div className="menu">
            <button className="menu_btn" onClick={toggleMenu}>⋮</button>
            {menuOpen && (
              <ul id={`menuList-${post.id}`} className="menu_li" style={{ display: 'block' }}>
                <li>
                  <button 
                    id={`edit_post-${post.id}`} 
                    className="menu_li" 
                    onClick={() => { setIsEditing(true); setMenuOpen(false); }}
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
        {/* Image Carousel - matches original structure */}
        {hasImages && (
          <div className="post-carousel" id={`carousel-${post.id}`}>
            <div className="post-carousel-track" id={`track-${post.id}`} style={{ display: 'flex' }}>
              {post.images.map((src, i) => (
                <div key={i} className="post-carousel-slide" style={{ minWidth: '100%' }}>
                  <img src={src} className="post-image" alt={`post image ${i + 1}`} />
                </div>
              ))}
            </div>
            {post.images.length > 1 && (
              <>
                <button className="post-carousel-arrow post-carousel-prev" onClick={() => {}}>❮</button>
                <button className="post-carousel-arrow post-carousel-next" onClick={() => {}}>❯</button>
                <div className="post-carousel-dots">
                  {post.images.map((_, i) => (
                    <span key={i} className={`post-dot ${i === 0 ? 'active' : ''}`}></span>
                  ))}
                </div>
              </>
            )}
          </div>
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
              <button 
                id={`savePost-${post.id}`} 
                className="postSaveBtn" 
                onClick={handleEdit}
              >
                Save
              </button>
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
        <div className="commentBox" style={{ display: 'block' }}>
          <CommentSection 
            postId={post.id} 
            postAuthorId={post.userId} 
          />
        </div>
      )}
    </div>
  );
}