// app/components/FollowButton.jsx
'use client'
import { useState } from 'react'

export default function FollowButton({ targetUserId, currentUserId, initialIsFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    if (!currentUserId) {
      alert('Please login to follow users')
      return
    }

    if (currentUserId === targetUserId) {
      alert('You cannot follow yourself')
      return
    }

    setLoading(true)

    const response = await fetch(`/api/users/${targetUserId}/follow`, {
      method: isFollowing ? 'DELETE' : 'POST'
    })

    if (response.ok) {
      setIsFollowing(!isFollowing)
    }

    setLoading(false)
  }

  return (
    <button 
      className="follow-btn" 
      id="followBtn" 
      type="button"
      onClick={handleFollow}
      disabled={loading}
    >
      <i className="fas fa-plus"></i>
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}