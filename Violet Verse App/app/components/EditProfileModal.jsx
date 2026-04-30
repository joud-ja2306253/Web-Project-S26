// app/components/EditProfileModal.jsx
'use client'
import { useState, useRef } from 'react'

const DEFAULT_PROFILE_PIC = "https://i.pinimg.com/1200x/28/16/5a/28165aaca2ee560b4a6b760765efe976.jpg"

export default function EditProfileModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    username: user.username || '',
    displayName: user.displayName || '',
    bio: user.bio || '',
    profilePic: user.profilePic || DEFAULT_PROFILE_PIC
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    setError('')
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file!')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, profilePic: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeletePhoto = () => {
    if (confirm('Remove your profile picture? It will be set to the default avatar.')) {
      setFormData(prev => ({ ...prev, profilePic: DEFAULT_PROFILE_PIC }))
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    const { username, displayName } = formData

    if (!username.trim()) {
      setError('Username cannot be empty!')
      return
    }

    if (!displayName.trim()) {
      setError('Display name cannot be empty!')
      return
    }

    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  return (
    <>
      <div id="overlay" className="active" onClick={onClose}></div>
      <div id="settingsPanel" className="active">
        <div className="editProfileTop">
          <button id="closeBtn" onClick={onClose}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <p>Edit Profile</p>
        </div>

        {/* Profile Picture */}
        <div className="editProfilePicContainer">
          <img 
            className="editProfilePic" 
            src={formData.profilePic} 
            alt="profile picture" 
          />
          <div className="photoActions">
            <label htmlFor="changePhoto" className="changePhoto">
              Change Photo
            </label>
            <input 
              type="file" 
              id="changePhoto" 
              hidden 
              ref={fileInputRef}
              onChange={handlePhotoChange}
            />
            <label 
              id="deletePhotoBtn" 
              className="deletePhotoBtn"
              onClick={handleDeletePhoto}
            >
              Delete Photo
            </label>
          </div>
        </div>

        {/* Username */}
        <div className="editRow">
          <label htmlFor="username">Username</label>
          <input 
            id="username" 
            type="text" 
            className="editInput" 
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        {/* Name */}
        <div className="editRow">
          <label htmlFor="displayName">Name</label>
          <input 
            id="displayName" 
            type="text" 
            className="editInput" 
            value={formData.displayName}
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <div className="editRow">
          <label htmlFor="bio">Bio</label>
          <input 
            id="bio" 
            type="text" 
            className="editInput" 
            placeholder="Your bio should go here"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div className="saveBtnWrapper">
          <button id="saveBtn" type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </>
  )
}