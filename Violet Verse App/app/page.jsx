// app/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import SearchBar from "./client/components/SearchBar";
import CreateTextPost from "./client/components/CreateTextPost";
import PostCard from "./client/components/PostCard";

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts/feed");
    const data = await response.json();
    setPosts(data);
    setLoading(false);
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <section id="feed-page">
      <SearchBar currentUserId={user?.id} />

      <div className="feed-container">
        <CreateTextPost onPostCreated={handlePostCreated} />

        <div id="postsContainer">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet from you or the accounts you follow.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
