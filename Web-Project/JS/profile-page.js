
// ===================================
//         Profile Page
// ===================================

//If both scripts are linked in HTML, they share the same global scope.
// This file runs AFTER feed2.js
// It uses functions from feed2.js without redeclaring anything

// =======================================
//        Display from LocalStorage
// =======================================

// Select Elements
const viewingUserId = localStorage.getItem("viewingUserId");
const currentUserID = localStorage.getItem("currentUser");
const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

// if viewing someone else use their id, otherwise use logged in user
const profileUser = viewingUserId
  ? allUsers.find((u) => u.id === viewingUserId)
  : allUsers.find((u) => u.id === currentUserID);

if (!profileUser) {
  window.location.href = "login-page.html";
}

// is this our own profile or someone else's?
const isOwnProfile = profileUser.id === currentUserID;


const displayNameElem = document.querySelector(".displayName");
const displayUsernameElem = document.querySelector(".username");
const displayBioElem = document.querySelector(".bio p");
const displayPicElem = document.querySelector(".profile-pic");

displayNameElem.textContent = currentUserObj.displayName;
displayUsernameElem.textContent = "@" + currentUserObj.username;
displayBioElem.textContent = currentUserObj.bio;
displayPicElem.textContent = currentUserObj.profilePic.src;

//====================================
//    Decide which button to show
//====================================

profileUserId = 123;

// displayNameElem.textContent = currentUser.displayName;
// displayUsernameElem.textContent = "@" + currentUser.username;
// displayBioElem.textContent = currentUser.bio || "No bio yet";

const settingsBtn = document.querySelector("#settingsBtn");
const followBtn = document.querySelector("#followBtn");

// Guard clauses
if (!settingsBtn && !followBtn) {
  console.log("Buttons not found - exiting profile page");
  // return;
}

// if (currentUserObj.id === profileUserId) {
  if (123 === profileUserId) {

  // User's own profile - show settings, hide follow
  followBtn.style.display = "none";
} else {
  // Someone else's profile - show follow, hide settings
  settingsBtn.style.display = "none";

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
const panel = document.getElementById("settingsPanel");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Edit input elements
const editUsername = document.getElementById("editUsername");
const editDisplayName = document.getElementById("editDisplayName");
const editBio = document.getElementById("editBio");
const editProfilePic = document.querySelector(".profile-pic");

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
closeBtn?.addEventListener("click", closePanel);
overlay?.addEventListener("click", closePanel);

function closePanel() {
  panel.classList.remove("active");
  overlay.classList.remove("active");
}

// Load saved data on page load
function loadSavedData() {
  const saved = JSON.parse(localStorage.getItem("profileData")) || {};

  // Fall back to currentUser if no saved profile edits yet
  displayNameElem.textContent = saved.displayName || currentUser.displayName || "";
  displayUsernameElem.textContent = "@" + (saved.username || currentUser.username || "");
  displayBioElem.textContent = saved.bio || currentUser.bio || "No bio yet";
}

function loadData() {
  return JSON.parse(localStorage.getItem("profileData")) || {};
}

// call on page load
loadSavedData();

//========================================
//         Profile Data (numbers)
//========================================

//========================================
//         Render Posts
//========================================

//done fully in feed

// ===============================
//        Save Changes
// ===============================
saveBtn?.addEventListener("click", () => {
  // Update currentUser object
  currentUserObj.username = editUsername.value.trim();
  currentUserObj.displayName = editDisplayName.value.trim();
  currentUserObj.bio = editBio.value.trim();

  //check joud
  // Save back to localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update UI
  displayNameElem.textContent = currentUser.displayName;
  displayUsernameElem.textContent = "@" + currentUser.username;
  displayBioElem.textContent = currentUser.bio;

  closePanel();
});

// ===============================
//           Logout
// ===============================

// Logout functionality
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("Logged out successfully");
  // Redirect to login page
  window.location.href = "login-page.html";
});
