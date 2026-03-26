// ===================================
//         Joud Profile Page
//====================================

// ===================================
//         Profile Action Button
// ===================================

//If both scripts are linked in HTML, they share the same global scope.
// This file runs AFTER feed2.js
// It uses functions from feed2.js without redeclaring anything

//currentUser local storage
// {"id":"123","username":"joud","displayName":"Joud Haytham",
// "bio":"CS student","email":"joud@email.com","password":"123456",
// "createdAt":"2026-03-25T12:34:56.789Z",
// "posts":["",1774452295367,1774452305953,1774452311180,1774452318132,1774452903971],
// "followers":[""],"following":[""]}

// // Get logged-in user
// function getCurrentUser() {
//   return JSON.parse(localStorage.getItem("currentUser"));
// }

// // Joud Get current logged-in user
// const currentUser = getCurrentUser();
// console.log("hi");

//i dont thinkn this should be commented but it gives an error
// if (!currentUser) {
//   window.location.href = "login.html";
// }

// const currentUserId = loggedInUser.id; // Get from your auth system
const profileUserId = "1234"; // Get from URL/profile data

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
