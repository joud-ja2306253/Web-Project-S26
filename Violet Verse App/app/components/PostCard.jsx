'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '../AuthenticateUser';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.id === post.authorId;

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`/server/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        post.content = editContent;
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Edit failed', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/server/api/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok && onPostDeleted) onPostDeleted(post.id);
    } catch (error) {
      console.error('Delete failed', error);
    } finally {
      setDeleting(false);
    }
  };

  const likedByUser = post.likes?.some(l => l.userId === user?.id) || false;

  return (
    <div className="post_R" data-has-images={(post.images?.length || 0) > 0}>
      <div className="post-header">
        <div className="post-user-info" onClick={() => window.location.href = `/users/${post.authorId}`}>
          <img src={post.author?.profilePic || '/default-avatar.png'} className="post-profile-pic" alt="" />
          <h4>{post.author?.displayName || 'Unknown'}</h4>
        </div>
        <span className="time">{new Date(post.createdAt).toLocaleString()}</span>
        {isOwner && (
          <div className="menu">
            <button className="menu_btn" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
            {menuOpen && (
              <ul className="menu_li" style={{ display: 'block' }}>
                <li><button onClick={() => { setIsEditing(true); setMenuOpen(false); }}>Edit post</button></li>
                <li><button onClick={handleDelete} disabled={deleting}>Delete post</button></li>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        {isEditing ? (
          <div className="post-edit">
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <p id={`postText-${post.id}`}>{post.content}</p>
        )}
      </div>

      <div className="post-actions">
        <div className="post_actions">
          <LikeButton postId={post.id} initialLikes={post.likes?.length || 0} initialLiked={likedByUser} />
          <p id={`likeCount-${post.id}`}>{post.likes?.length || 0} likes</p>
        </div>
        <div>
          <button className="menu_btn" onClick={() => setShowComments(!showComments)}>🗨️</button>
        </div>
      </div>

      {showComments && (
        <CommentSection postId={post.id} postAuthorId={post.authorId} />
      )}
    </div>
  );
}