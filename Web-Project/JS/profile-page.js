// ===================================
//         Joud Profile Page
//====================================

// ===================================
//         Profile Action Button
// ===================================

const currentUserId = "123"; // Get from your auth system
const profileUserId = "123"; // Get from URL/profile data

const settingsBtn = document.querySelector("#settingsBtn");
const followBtn = document.querySelector("#followBtn");

// Guard clauses
if (!settingsBtn && !followBtn) {
  console.log("Buttons not found - exiting Joud's script");
  //   return;
}

// Decide which button to show
if (currentUserId === profileUserId) {
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
  // Clear localStorage if you want
  // localStorage.clear();

  // Redirect to login page or home
  window.location.href = "login-page.html"; // Change to your login page
});

//========================================
//         Profile Data (numbers)
//========================================

console.log(Date.now());

//========================================
//         Render Posts
//========================================

function renderUserPosts() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
}
