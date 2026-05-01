// app/components/CreateTextPost.jsx
'use client';
import { useState } from 'react';
import { useUser } from '../AuthenticateUser';
import { useAlert } from '../hooks/useAlert';

export default function CreateTextPost({ onPostCreated }) {
  const { user } = useUser();
  const { showAlert } = useAlert();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const text = content.trim();
    if (!text) return;

    setSubmitting(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, images: [] }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setContent('');
        showAlert("Post shared!", "success", () => {
          if (onPostCreated) onPostCreated(newPost);
        });
      } else {
        const error = await res.json();
        showAlert(error.error || "Failed to create post", "error");
      }
    } catch (error) {
      console.error('Failed to create post', error);
      showAlert("Failed to create post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post">
      <textarea
        className="postInput"
        id="postInput"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="postBtn" id="postBtn" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
}