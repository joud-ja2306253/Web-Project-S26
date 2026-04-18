// ===================================
//         Profile Page
// ===================================

// Select Elements
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
const deletePhotoBtn = document.getElementById("deletePhotoBtn");

const DEFAULT_PROFILE_PIC =
  "https://i.pinimg.com/1200x/28/16/5a/28165aaca2ee560b4a6b760765efe976.jpg";

// ===========================
//       Helper Functions
// ===========================
function loadProfile(user) {
  displayNameElem.textContent = user.displayName;
  displayUsernameElem.textContent = "@" + user.username;
  displayBioElem.textContent = user.bio;
  displayPicElem.src = user.profilePic;
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
        //added "" just incase, though there should always be a pic
        editProfilePic.src = currentUser.profilePic || "";
        editProfilePic.alt = "profile pic";

        //store for rollback!
        originalProfilePicBackup = currentUser.profilePic || "";
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
      if (!file.type.startsWith("image/")) {
        showAlert("Please select an image file!", "error")
        
        changePhotoInput.value = "";
        return;
      }
      // Valid image
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

// Handle delete photo
if (deletePhotoBtn) {
  deletePhotoBtn.addEventListener("click", () => {
    // Confirm with user before deleting

    showConfirm("Remove your profile picture? It will be set to the default avatar.", () => {
  if (editProfilePic) editProfilePic.src = DEFAULT_PROFILE_PIC;
  if (changePhotoInput) changePhotoInput.value = "";
    });

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

  // Store original values for rollback
  const originalUsername = currentUser.username;
  const originalDisplayName = currentUser.displayName;

  const newUsername = editUsername.value.trim();
  const newDisplayName = editDisplayName.value.trim();

  //  Check if username is empty
  if (newUsername === "") {
    showAlert("Username cannot be empty!", "warning");
    editUsername.value = originalUsername;
    return;
  }

  //  Check if display name is empty
  if (newDisplayName === "") {
    showAlert("Display name cannot be empty!", "warning")
    editDisplayName.value = originalDisplayName;
    return;
  }

  //  Check for duplicate username case insensitive
  let users = JSON.parse(localStorage.getItem("allUsers")) || [];
  const usernameExists = users.some(
    (user) =>
      user.id !== currentUser.id &&
      user.username.toLowerCase() === newUsername.toLowerCase(),
  );

  if (usernameExists) {
    showAlert("Username already taken! Please choose another one.", "warning")
    editUsername.value = originalUsername;
    return;
  }

  currentUser.username = newUsername;
  currentUser.displayName = newDisplayName;
  currentUser.bio = editBio.value.trim();

  // Save profile picture if changed
  if (editProfilePic && editProfilePic.src) {
    currentUser.profilePic = editProfilePic.src;
  }

  // let users = JSON.parse(localStorage.getItem("allUsers")) || [];
  const index = users.findIndex((u) => u.id === currentUser.id);

  // save all updated info to allUsers
  if (index !== -1) {
    // If user was found
    users[index] = { ...users[index], ...currentUser };
    localStorage.setItem("allUsers", JSON.stringify(users));
  }

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
  displayPicElem.src = currentUser.profilePic;

  // Refresh feed
  loadPost();
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

// ===========================
//        Profile Tabs
// ===========================

function initProfileTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');

  //filter posts based on active tab
  function filterPostsByActiveTab() {
    const activeBtn = document.querySelector('.tab-btn.active');
    const tab = activeBtn ? activeBtn.dataset.tab : 'text'; 
    const allPosts = document.querySelectorAll('#postsContainer .post_R');

    allPosts.forEach(post => {
      const hasImage = post.dataset.hasImages === 'true';

      if (tab === 'photos') {
        post.style.display = hasImage ? '' : 'none';
      } else {
        post.style.display = !hasImage ? '' : 'none';
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Call the filter function
      filterPostsByActiveTab();
    });
  });

  //Filter posts on initial load (text iis active in html) 
  filterPostsByActiveTab();
}

// Run after posts are loaded
// If feed.js renders posts synchronously, call it right away.
// If it's async, wrap in a small delay:

//setTimeout(initProfileTabs, 300);

// Run immediately when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfileTabs);
} else {
  initProfileTabs();
}