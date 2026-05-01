'use client';
import { useState } from 'react';
import { useUser } from '@/auth/AuthenticateUser';

export default function CreateTextPost({ onPostCreated }) {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const text = content.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      const res = await fetch('/server/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, images: [] }),
      });
      if (res.ok) {
        const newPost = await res.json();
        setContent('');
        if (onPostCreated) onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Failed to create post', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post">
      <textarea
        className="postInput"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />
      <button className="postBtn" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}