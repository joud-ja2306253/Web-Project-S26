// ===================================
//         Joud Profile Page
//====================================

// ===================================
//         Profile Action Button
// ===================================

//If both scripts are linked in HTML, they share the same global scope.
// This file runs AFTER feed2.js
// It uses functions from feed2.js without redeclaring anything

//====dont need this
// const currentUserId = loggedInUser.id; // Get from your auth system
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "login-page.html";
}

// ===============================
//        Select Elements
// ===============================

// Profile display
const displayNameElem = document.querySelector(".displayName");
const displayUsernameElem = document.querySelector(".username");
const displayBioElem = document.querySelector(".bio p");

// Buttons
const settingsBtn = document.querySelector("#settingsBtn");
const followBtn = document.querySelector("#followBtn");

// Guard clauses
if (!settingsBtn && !followBtn) {
  console.log("Buttons not found - exiting Joud's script");
  //   return;
}

// Decide which button to show
if (currentUserObj.id === profileUserId) {
  // User's own profile - show settings, hide follow
  //   editProfileBtn.style.display = "flex";
  followBtn.style.display = "none";
} else {
  // Someone else's profile - show follow, hide settings
  settingsBtn.style.display = "none";
  //   followBtn.style.display = "";

  const originalHTML = followBtn.innerHTML;
  let isFollowing = false;

  followBtn.addEventListener("click", () => {
    // if (!followBtn) return;
    isFollowing = !isFollowing;
    followBtn.innerHTML = isFollowing ? "Following" : originalHTML;
    //this selector in css .follow-btn.following
    followBtn.classList.toggle("following", isFollowing);
  });
}

//===========================
//         Settings
//===========================

// settings panel elements

// const settingsBtn = document.getElementById("settingsBtn");
const panel = document.getElementById("settingsPanel");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Edit input elements
const editUsername = document.getElementById("editUsername");
const editDisplayName = document.getElementById("editDisplayName");
const editBio = document.getElementById("editBio");

// Main display elements (where user sees their info)
const displayNameElem = document.querySelector(".displayName");
const displayUsernameElem = document.querySelector(".username");
const displayBioElem = document.querySelector(".bio p");

settingsBtn.addEventListener("click", () => {
  // Load current displayed values into edit inputs
  editUsername.value = displayUsernameElem.textContent.replace("@", ""); // Remove @ symbol if present
  editDisplayName.value = displayNameElem.textContent;
  editBio.value = displayBioElem.textContent;

  // Show panel
  overlay.classList.add("active");
  panel.classList.add("active");
});

// Close panel
closeBtn.addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);

function closePanel() {
  panel.classList.remove("active");
  overlay.classList.remove("active");
}

// Save data
saveBtn.addEventListener("click", () => {
  const data = {
    username: editUsername.value,
    displayName: editDisplayName.value,
    bio: editBio.value,
  };

  saveData(data);

  // Update main display
  displayNameElem.textContent = data.displayName;
  displayUsernameElem.textContent = `@${data.username}`;
  displayBioElem.textContent = data.bio;

  // Close panel
  closePanel();
});

function saveData(data) {
  localStorage.setItem("profileData", JSON.stringify(data));
}

// Load saved data on page load
function loadSavedData() {
  const data = loadData(); // load the JSON object

  // Update main display
  displayUsernameElem.textContent = data.username ? `@${data.username}` : "";
  displayNameElem.textContent = data.displayName || "";
  displayBioElem.textContent = data.bio || "";
}

function loadData() {
  return JSON.parse(localStorage.getItem("profileData")) || {};
}

// call on page load
loadSavedData();

// Logout functionality
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("Logged out successfully");
  // Redirect to login page
  window.location.href = "login-page.html";
});

//========================================
//         Profile Data (numbers)
//========================================

//========================================
//         Render Posts
//========================================

//applied logic in registration.js in loadPost

// ===================================
//         Joud Profile Page
// ===================================

//If both scripts are linked in HTML, they share the same global scope.
// This file runs AFTER feed2.js
// It uses functions from feed2.js without redeclaring anything

// const currentUserId = loggedInUser.id; // Get from your auth system
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "login-page.html";
}
//==================

const profileUserId = currentUser.id; // Get from URL/profile data

// const displayNameElem = document.querySelector(".displayName");
// const displayUsernameElem = document.querySelector(".username");
// const displayBioElem = document.querySelector(".bio p");

// displayNameElem.textContent = currentUser.displayName;
// displayUsernameElem.textContent = "@" + currentUser.username;
// displayBioElem.textContent = currentUser.bio || "No bio yet";

const settingsBtn = document.querySelector("#settingsBtn");
const followBtn = document.querySelector("#followBtn");

// Settings panel
const panel = document.getElementById("settingsPanel");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Edit inputs
const editUsername = document.getElementById("editUsername");
const editDisplayName = document.getElementById("editDisplayName");
const editBio = document.getElementById("editBio");

// ===============================
//        Display User Data
// ===============================
displayNameElem.textContent = currentUser.displayName;
displayUsernameElem.textContent = "@" + currentUser.username;
displayBioElem.textContent = currentUser.bio || "No bio yet";

// ===============================
//        Profile Buttons Logic
// ===============================

// Own profile → hide follow
if (followBtn) {
  followBtn.style.display = "none";
}

// ===============================
//        Settings Panel
// ===============================

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    editUsername.value = currentUser.username;
    editDisplayName.value = currentUser.displayName;
    editBio.value = currentUser.bio || "";

    overlay.classList.add("active");
    panel.classList.add("active");
  });
}

// Close panel
function closePanel() {
  panel.classList.remove("active");
  overlay.classList.remove("active");
}

closeBtn?.addEventListener("click", closePanel);
overlay?.addEventListener("click", closePanel);

// ===============================
//        Save Changes
// ===============================
saveBtn?.addEventListener("click", () => {
  // Update currentUser object
  currentUser.username = editUsername.value.trim();
  currentUser.displayName = editDisplayName.value.trim();
  currentUser.bio = editBio.value.trim();

  // Save back to localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update UI
  displayNameElem.textContent = currentUser.displayName;
  displayUsernameElem.textContent = "@" + currentUser.username;
  displayBioElem.textContent = currentUser.bio;

  closePanel();
});

// ===============================
//        Logout
// ===============================
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("Logged out successfully");
  window.location.href = "login-page.html";
});