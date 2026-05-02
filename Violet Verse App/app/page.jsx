// app/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useUser } from "./AuthenticateUser";
import SearchBar from "./components/SearchBar";
import CreateTextPost from "./components/CreateTextPost";
import PostCard from "./components/PostCard";

export default function HomePage() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/feed");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load posts", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <>
      <section id="feed-page">
        <SearchBar />
        <div className="feed-container">
          <CreateTextPost onPostCreated={handlePostCreated} />
          <div id="postsContainer">
            {(!posts || posts.length === 0) && <p>No posts yet.</p>}
            {posts && posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}