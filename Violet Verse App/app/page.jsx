'use client';
import { useState, useEffect } from 'react';    
import { useUser } from './AuthenticateUser';

import SearchBar from './components/SearchBar';
import CreateTextPost from './components/CreateTextPost';
import PostCard from './components/PostCard';

export default function HomePage() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/server/api/posts/feed');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => fetchPosts();
  const handlePostDeleted = (id) => setPosts(prev => prev.filter(p => p.id !== id));

  if (loading) return <div>Loading posts...</div>;

  return (
    <section id="feed-page">
      <SearchBar />
      <div className="feed-container">
        <CreateTextPost onPostCreated={handlePostCreated} />
        <div id="postsContainer">
          {posts.length === 0 && <p>No posts yet.</p>}
          {posts.map(post => (
            <PostCard key={post.id} post={post} onPostDeleted={handlePostDeleted} />
          ))}
        </div>
      </div>
    </section>
  );
}