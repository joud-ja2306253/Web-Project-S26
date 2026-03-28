// ===================================
//         Profile Page
// ===================================

// Select Elements - MUST be at the very top!
const displayNameElem = document.querySelector(".displayName");
const displayUsernameElem = document.querySelector(".username");
const displayBioElem = document.querySelector(".bio p");
const displayPicElem = document.querySelector(".profile-pic");

// Buttons
const settingsBtn = document.querySelector("#settingsBtn");
const followBtn = document.querySelector("#followBtn");

// Settings panel elements
const panel = document.getElementById("settingsPanel");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Edit input elements
const editUsername = document.getElementById("editUsername");
const editDisplayName = document.getElementById("editDisplayName");
const editBio = document.getElementById("editBio");
const editProfilePic = document.querySelector(".editProfilePic");
const changePhotoInput = document.getElementById("changePhoto");

// ===========================
//       Helper Functions
// ===========================
function loadProfile(user) {
  displayNameElem.textContent = user.displayName;
  displayUsernameElem.textContent = "@" + user.username;
  displayBioElem.textContent = user.bio;
  displayPicElem.src = user.profilePic || "images/default.png";
}

function updateProfileStats(user) {
  const profiledataDiv = document.querySelector(".profile-data");
  if (profiledataDiv) {
    profiledataDiv.innerHTML = `
      <div>
        <p>${user.posts ? user.posts.length : 0}</p>
        <p class="labeling">Posts</p>
      </div>
      <div>
        <p>${user.followers ? user.followers.length : 0}</p>
        <p class="labeling">Followers</p>
      </div>
      <div>
        <p>${user.following ? user.following.length : 0}</p>
        <p class="labeling">Following</p>
      </div>
    `;
  }
}

function displayProfile(user) {
  if (!user) return;
  loadProfile(user);
  updateProfileStats(user);
}

// ===========================
//       Main Logic
// ===========================

// Get the current user ID (it's a STRING with letters, not a number!)
const currentUserId = localStorage.getItem("currentUser");
const allUsersFresh = JSON.parse(localStorage.getItem("allUsers")) || [];
const profileUserId = localStorage.getItem("profileUserId");

// Find the full current user object - DON'T use Number(), compare as strings
const currentUser = allUsersFresh.find((u) => u.id === currentUserId);

let profileUser = null;
let isOwnProfile = false;

if (profileUserId && currentUser) {
  // Viewing someone's profile - DON'T use Number(), compare as strings
  profileUser = allUsersFresh.find((u) => u.id === profileUserId);
  isOwnProfile = profileUser?.id === currentUser.id;
} else if (currentUser) {
  // Viewing own profile
  profileUser = currentUser;
  isOwnProfile = true;
}

if (!profileUser) {
  console.error("Profile user not found");
} else {
  displayProfile(profileUser);
}

// Show correct button
if (settingsBtn && followBtn) {
  if (isOwnProfile) {
    settingsBtn.style.display = "block";
    followBtn.style.display = "none";
  } else {
    settingsBtn.style.display = "none";
    followBtn.style.display = "block";

    // Setup follow button
    let isFollowing = currentUser?.following?.includes(profileUser.id) || false;
    followBtn.innerHTML = isFollowing ? "Following" : "Follow";
    followBtn.classList.toggle("following", isFollowing);

    followBtn.onclick = () => {
      // Get fresh data again
      let users = JSON.parse(localStorage.getItem("allUsers")) || [];
      const currentIdx = users.findIndex((u) => u.id === currentUser.id);
      const profileIdx = users.findIndex((u) => u.id === profileUser.id);

      if (currentIdx === -1 || profileIdx === -1) return;

      if (isFollowing) {
        users[currentIdx].following = users[currentIdx].following.filter(
          (id) => id !== profileUser.id,
        );
        users[profileIdx].followers = users[profileIdx].followers.filter(
          (id) => id !== currentUser.id,
        );
      } else {
        if (!users[currentIdx].following) users[currentIdx].following = [];
        if (!users[profileIdx].followers) users[profileIdx].followers = [];
        users[currentIdx].following.push(profileUser.id);
        users[profileIdx].followers.push(currentUser.id);
      }

      localStorage.setItem("allUsers", JSON.stringify(users));

      isFollowing = !isFollowing;
      followBtn.innerHTML = isFollowing ? "Following" : "Follow";
      followBtn.classList.toggle("following", isFollowing);

      // Update stats
      const updatedProfileUser = users[profileIdx];
      updateProfileStats(updatedProfileUser);
    };
  }
}

// Clear profileUserId after viewing (so next time it shows own profile)
if (profileUserId) {
  localStorage.removeItem("profileUserId");
}

// ===========================
//       Settings Panel
// ===========================
if (settingsBtn && (isOwnProfile || profileUser?.id === currentUser?.id)) {
  settingsBtn.addEventListener("click", () => {
    if (currentUser) {
      editUsername.value = currentUser.username || "";
      editDisplayName.value = currentUser.displayName || "";
      editBio.value = currentUser.bio || "";

      // Load profile picture into edit panel
      if (editProfilePic) {
        editProfilePic.src = currentUser.profilePic || "images/default.png";
        editProfilePic.alt = currentUser.displayName;
      }

      overlay.classList.add("active");
      panel.classList.add("active");
    }
  });
}

// Handle photo change
if (changePhotoInput) {
  changePhotoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (editProfilePic) {
          editProfilePic.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

function closePanel() {
  panel.classList.remove("active");
  overlay.classList.remove("active");
}

closeBtn?.addEventListener("click", closePanel);
overlay?.addEventListener("click", closePanel);

saveBtn?.addEventListener("click", () => {
  if (!currentUser) return;

  const newUsername = editUsername.value.trim();
  const newDisplayName = editDisplayName.value.trim();

  //  Check if username is empty
  if (newUsername === "") {
    alert("Username cannot be empty!");
    return;
  }

  //  Check if display name is empty
  if (newDisplayName === "") {
    alert("Display name cannot be empty!");
    return;
  }

  //  Check for duplicate username case insensitive
  let users1 = JSON.parse(localStorage.getItem("allUsers")) || [];
  const usernameExists = users1.some(
    (user) => user.id !== currentUser.id && user.username.toLowerCase() === newUsername.toLowerCase()
  );

  if (usernameExists) {
    alert("Username already taken! Please choose another one.");
    return;
  }
  
  currentUser.username = newUsername;
  currentUser.displayName = newDisplayName;
  currentUser.bio = editBio.value.trim();

  // Save profile picture if changed
  if (editProfilePic && editProfilePic.src) {
    currentUser.profilePic = editProfilePic.src;
  }

  let users = JSON.parse(localStorage.getItem("allUsers")) || [];
  const index = users.findIndex((u) => u.id === currentUser.id);

  // save all updated info to allUsers
  if (index !== -1) {
    // If user was found
    users[index] = { ...users[index], ...currentUser };
    localStorage.setItem("allUsers", JSON.stringify(users));
  }

  //update post name displays by that user
  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts = posts.map((post) => {
    if (post.userId === currentUser.id) {
      // This post belongs to current user, update it
      return { ...post, name: currentUser.displayName };
    }
    // This post belongs to someone else, leave it as is
    return post;
  });

  localStorage.setItem("posts", JSON.stringify(posts));

  //update comment name displays by that user
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments = comments.map((comment) => {
    if (comment.userId === currentUser.id) {
      return { ...comment, name: currentUser.displayName };
    }
    return comment;
  });
  localStorage.setItem("comments", JSON.stringify(comments));

  displayNameElem.textContent = currentUser.displayName;
  displayUsernameElem.textContent = "@" + currentUser.username;
  displayBioElem.textContent = currentUser.bio;
  displayPicElem.src = currentUser.profilePic || "images/default.png";

  // Refresh feed
  if (typeof loadPost === "function") {
    loadPost();
  }

  closePanel();
});

// ===============================
//           Logout
// ===============================
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("profileUserId");
  window.location.href = "login-page.html";
});
