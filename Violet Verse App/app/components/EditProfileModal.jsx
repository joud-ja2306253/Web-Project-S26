// app/components/EditProfileModal.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";

const DEFAULT_PROFILE_PIC =
  "https://i.pinimg.com/1200x/28/16/5a/28165aaca2ee560b4a6b760765efe976.jpg";

export default function EditProfileModal({ user, onSave, onClose }) {
  const { updateUser, logout } = useUser();
  const { showAlert, showConfirm, showLogoutConfirm, AlertComponent } =
    useAlert();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: user.username || "",
    displayName: user.displayName || "",
    bio: user.bio || "",
    profilePic: user.profilePic || DEFAULT_PROFILE_PIC,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, profilePic: event.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      showAlert("Please select an image file!", "error");
    }
  };

  const handleDeletePhoto = () => {
    showConfirm(
      "Delete your profile picture? It will be set to the default avatar.",
      () => {
        setFormData({ ...formData, profilePic: DEFAULT_PROFILE_PIC });
      },
    );
  };

  const handleSubmit = async () => {
    if (!formData.username.trim() || !formData.displayName.trim()) {
      showAlert("Username and display name cannot be empty!", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          displayName: formData.displayName,
          bio: formData.bio,
          profilePic: formData.profilePic,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        onSave(updatedUser);
        if (updateUser) updateUser(updatedUser);
        showAlert("Profile updated!", "success");
        onClose();
      } else {
        const error = await res.json();
        if (error.error === "Username already taken") {
          showAlert(
            "Username already taken! Please choose another one.",
            "warning",
          );
        } else {
          showAlert(error.error || "Failed to update profile", "error");
        }
      }
    } catch (error) {
      showAlert("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    showLogoutConfirm("Are you sure you want to logout?", async () => {
      await logout();
      router.push("/login");
    });
  };

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
              accept="image/*"
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

        <div className="editRow">
          <label htmlFor="editUsername">Username</label>
          <input
            id="editUsername"
            name="username"
            type="text"
            className="editInput"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
        </div>

        <div className="editRow">
          <label htmlFor="editDisplayName">Name</label>
          <input
            id="editDisplayName"
            name="displayName"
            type="text"
            className="editInput"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Display Name"
          />
        </div>

        <div className="editRow">
          <label htmlFor="editBio">Bio</label>
          <input
            id="editBio"
            name="bio"
            type="text"
            className="editInput"
            placeholder="Your bio should go here"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="saveBtnWrapper">
          <button id="saveBtn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="logoutBtn">
          <button id="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <AlertComponent />
    </>
  );
}
