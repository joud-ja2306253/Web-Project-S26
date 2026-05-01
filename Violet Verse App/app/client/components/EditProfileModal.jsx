'use client';
import { useState } from 'react';

const DEFAULT_PIC = 'https://i.pinimg.com/1200x/28/16/5a/28165aaca2ee560b4a6b760765efe976.jpg';

export default function EditProfileModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    username: user.username || '',
    displayName: user.displayName || '',
    bio: user.bio || '',
    profilePic: user.profilePic || DEFAULT_PIC,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm({ ...form, profilePic: ev.target.result });
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file');
    }
  };

  const deletePhoto = () => {
    if (confirm('Remove profile picture? It will be set to default.')) {
      setForm({ ...form, profilePic: DEFAULT_PIC });
    }
  };

  const handleSubmit = async () => {
    if (!form.username.trim() || !form.displayName.trim()) {
      alert('Username and display name cannot be empty');
      return;
    }
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <>
      <div id="overlay" className="active" onClick={onClose}></div>
      <div id="settingsPanel" className="active">
        <div className="editProfileTop">
          <button onClick={onClose}><i className="fa-solid fa-angle-left"></i></button>
          <p>Edit Profile</p>
        </div>
        <div className="editProfilePicContainer">
          <img className="editProfilePic" src={form.profilePic} alt="profile" />
          <div className="photoActions">
            <label htmlFor="changePhoto" className="changePhoto">Change Photo</label>
            <input type="file" id="changePhoto" hidden accept="image/*" onChange={handlePhotoChange} />
            <label className="deletePhotoBtn" onClick={deletePhoto}>Delete Photo</label>
          </div>
        </div>
        <div className="editRow">
          <label>Username</label>
          <input name="username" className="editInput" value={form.username} onChange={handleChange} />
        </div>
        <div className="editRow">
          <label>Name</label>
          <input name="displayName" className="editInput" value={form.displayName} onChange={handleChange} />
        </div>
        <div className="editRow">
          <label>Bio</label>
          <input name="bio" className="editInput" placeholder="Your bio should go here" value={form.bio} onChange={handleChange} />
        </div>
        <div className="saveBtnWrapper">
          <button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </>
  );
}