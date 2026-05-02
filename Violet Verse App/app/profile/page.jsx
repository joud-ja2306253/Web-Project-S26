// app/profile/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";
import PostCard from "../components/PostCard";
import ProfileInfo from "../components/ProfileInfo";
import EditProfileModal from "../components/EditProfileModal";
import ProfileTabs from "../components/ProfileTabs";

export default function ProfilePage() {
  const { user: currentUser } = useUser();
  const { showAlert, AlertComponent } = useAlert();
  const searchParams = useSearchParams();

  const profileUserId = searchParams.get("userId");
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile = !profileUserId || profileUserId === currentUser?.id;

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [profileUserId, currentUser]);

  const fetchProfile = async () => {
    const userId = isOwnProfile ? currentUser.id : profileUserId;

    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setProfileUser(data);

      const postsRes = await fetch(`/api/posts/user/${userId}`);
      const postsData = await postsRes.json();
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error("Failed to load profile", error);
      showAlert("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = () => {
    fetchProfile();
  };

  const handleUpdateUser = (updatedUser) => {
    setProfileUser(updatedUser);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));

    // decrement post count in profile user data without reload
    setProfileUser((prev) => ({
      ...prev,
      _count: {
        ...prev._count,
        posts: Math.max((prev._count?.posts || 1) - 1, 0),
      },
    }));
  };

  const filteredPosts =
    activeTab === "photos"
      ? posts.filter((post) => post.images && post.images.length > 0)
      : posts.filter((post) => !post.images || post.images.length === 0);

      
  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profileUser) return <div className="error">User not found</div>;

  return (
    <>
      <ProfileInfo
        profileUser={profileUser}
        isOwnProfile={isOwnProfile}
        currentUserId={currentUser?.id}
        onFollowChange={handleFollowChange}
        onSettingsClick={() => setShowEditModal(true)}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="feed-container">
        <div id="postsContainer">
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onSave={handleUpdateUser}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <AlertComponent />
    </>
  );
}
