// app/client/profile/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../auth/AuthenticateUser'
import PostCard from '../components/PostCard'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useUser()
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    profilePic: ''
  })

  // Fetch profile data
  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    const response = await fetch(`/server/api/users/${user.id}`)
    const data = await response.json()
    setProfileUser(data)
    setEditForm({
      username: data.username || '',
      displayName: data.displayName || '',
      bio: data.bio || '',
      profilePic: data.profilePic || ''
    })
    setPosts(data.posts || [])
    setLoading(false)
  }

  const handleEditSubmit = async () => {
    const response = await fetch(`/server/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })

    if (response.ok) {
      const updatedUser = await response.json()
      setProfileUser(updatedUser)
      setShowSettings(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/server/api/auth/logout', { method: 'POST' })
    router.push('/client/auth/login')
  }

  if (authLoading || loading) {
    return <div className="loading">Loading profile...</div>
  }

  if (!profileUser) {
    return <div className="error">User not found</div>
  }

  return (
    <div className="profile-info-container">
      <div className="profile-info">
        <div className="top-field">
          <img 
            className="profile-pic" 
            src={profileUser.profilePic || '/default-avatar.png'} 
            alt="profile picture" 
          />
          <div className="top-row">
            <div className="names">
              <h3 className="displayName">{profileUser.displayName}</h3>
              <p className="username">@{profileUser.username}</p>
            </div>
            <div>
              <button 
                className="settingsBtn" 
                id="settingsBtn" 
                onClick={() => setShowSettings(true)}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="bio">
          <p>{profileUser.bio || 'No bio yet'}</p>
        </div>

        <div className="profile-data">
          <div>
            <p>{posts.length}</p>
            <p className="labeling">Posts</p>
          </div>
          <div>
            <p>{profileUser._count?.followers || 0}</p>
            <p className="labeling">Followers</p>
          </div>
          <div>
            <p>{profileUser._count?.following || 0}</p>
            <p className="labeling">Following</p>
          </div>
        </div>
      </div>

      {/* Settings Panel Modal */}
      {showSettings && (
        <>
          <div id="overlay" className="active" onClick={() => setShowSettings(false)}></div>
          <div id="settingsPanel" className="active">
            <div className="editProfileTop">
              <button onClick={() => setShowSettings(false)}>
                <i className="fa-solid fa-angle-left"></i>
              </button>
              <p>Edit Profile</p>
            </div>

            <div className="editProfilePicContainer">
              <img 
                className="editProfilePic" 
                src={editForm.profilePic} 
                alt="profile picture" 
              />
            </div>

            <div className="editRow">
              <label>Username</label>
              <input 
                type="text" 
                className="editInput" 
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
              />
            </div>

            <div className="editRow">
              <label>Name</label>
              <input 
                type="text" 
                className="editInput" 
                value={editForm.displayName}
                onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
              />
            </div>

            <div className="editRow">
              <label>Bio</label>
              <input 
                type="text" 
                className="editInput" 
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Your bio should go here"
              />
            </div>

            <div className="saveBtnWrapper">
              <button onClick={handleEditSubmit}>Save</button>
            </div>
            <div className="logoutBtn">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </>
      )}

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button className="tab-btn active" data-tab="photos">
          <i className="fa-solid fa-image"></i> Photos
        </button>
        <button className="tab-btn" data-tab="text">
          <i className="fa-solid fa-align-left"></i> Posts
        </button>
      </div>

      {/* Posts Container */}
      <div className="feed-container">
        <div id="postsContainer">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet.</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id}
                post={post}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}