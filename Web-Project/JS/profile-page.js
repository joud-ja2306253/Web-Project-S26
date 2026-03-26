// ===================================
//         Profile Page
// ===================================

//If both scripts are linked in HTML, they share the same global scope.
// This file runs AFTER feed2.js
// It uses functions from feed2.js without redeclaring anything

// =========================================================
//      1st step: Display from LocalStorage on Load
// =========================================================

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

// ===========================
//       Helper Functions
// ===========================
function loadProfile(user) {
  displayNameElem.textContent = user.displayName;
  displayUsernameElem.textContent = "@" + user.username;
  displayBioElem.textContent = user.bio;
  displayPicElem.src = user.profilePic || "images/default.png";
}

// // ===========================
// //       Load Display
// // ===========================

// function loadSavedData() {
//   const user = allUsers.find((u) => u.id === currentUserObj.id);

//   if (user) {
//     loadProfile(user);

//     const profiledataDiv = document.querySelector(".profile-data");
//     if (profiledataDiv) {
//       profiledataDiv.innerHTML = `
//         <div class="profile-data">
//           <div>
//             <p>${user.posts ? user.posts.length : 0}</p>
//             <p class="labeling">Posts</p>
//           </div>
//           <div>
//             <p>${user.followers ? user.followers.length : 0}</p>
//             <p class="labeling">Followers</p>
//           </div>
//           <div>
//             <p>${user.following ? user.following.length : 0}</p>
//             <p class="labeling">Following</p>
//           </div>
//         </div>
//       `;
//     }
//   }
// }
// // call on page load
// loadSavedData();

// ====================================
//    Decide which button to show
// ====================================

//Buttons
const settingsBtn = document.querySelector("#settingsBtn");
const followBtn = document.querySelector("#followBtn");

// Guard clauses
if (!settingsBtn || !followBtn) {
  console.log("Buttons not found - exiting profile page");
  // return;
}

// // currentUserObj.id → the logged-in user (from currentUser in localStorage)
// // profileUserId → the user whose profile page we are viewing, which could be

// //but before i need to set it!
// //Get profile user
// const profileUserId = Number(localStorage.getItem("profileUserId"));
// const profileUser = allUsers.find((u) => u.id === profileUserId);
// //This searches through your allUsers array (which contains all registered users) and finds the one whose id matches profileUserId.

// if (!profileUser) {
//   alert("User not found!");
// } else {
//   // Display info
//   displayNameElem.textContent = profileUser.displayName;
//   displayUsernameElem.textContent = "@" + profileUser.username;
//   displayBioElem.textContent = profileUser.bio;
//   displayPicElem.src = profileUser.profilePic;

//   // Decide which button to show
//   if (currentUserObj.id === profileUserId) {
//     // Your own profile
//     settingsBtn.style.display = "block";
//     followBtn.style.display = "none";
//   } else {
//     // Someone else's profile
//     settingsBtn.style.display = "none";
//     followBtn.style.display = "block";

//     const originalHTML = followBtn.innerHTML;
//     let isFollowing = false;

//     followBtn.addEventListener("click", () => {
//       isFollowing = !isFollowing;
//       followBtn.innerHTML = isFollowing ? "Following" : originalHTML;
//       followBtn.classList.toggle("following", isFollowing);
//     });
//   }
//}

// 1) getting elements
const profileUserId = localStorage.getItem("profileUserId");

// 2) update profile stats
function updateProfileStats(user) {
  const profiledataDiv = document.querySelector(".profile-data");
  if (profiledataDiv) {
    profiledataDiv.innerHTML = `
      <div class="profile-data">
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
      </div>
    `;
  }
}

// 3) display main profile and stats
function displayProfile(user) {
  if (!user) return;
  loadProfile(user);
  updateProfileStats(user);
}

// 4) which profile to show
let profileUser = null;

if (profileUserId) {
  profileUser = allUsers.find((u) => u.id === profileUserId);
}

// 5) show the correct profile
if (profileUser && profileUserId !== currentUserObj?.id) {
  // SHOWING SOMEONE ELSE'S PROFILE
  displayProfile(profileUser);

  // Show/hide buttons
  if (settingsBtn) settingsBtn.style.display = "none";
  if (followBtn) followBtn.style.display = "block";

  // FOLLOW SYSTEM
  let isFollowing = currentUserObj?.following?.includes(profileUserId) || false;
  followBtn.innerHTML = isFollowing ? "Following" : "Follow";
  followBtn.classList.toggle("following", isFollowing);

  // Remove old event listeners and add new one
  const newFollowBtn = followBtn.cloneNode(true);
  followBtn.parentNode.replaceChild(newFollowBtn, followBtn);

  newFollowBtn.addEventListener("click", () => {
    // Get fresh data
    let users = JSON.parse(localStorage.getItem("allUsers")) || [];
    const currentIndex = users.findIndex((u) => u.id === currentUserObj.id);
    const profileIndex = users.findIndex((u) => u.id === profileUserId);

    if (currentIndex === -1 || profileIndex === -1) return;

    const freshCurrentUser = users[currentIndex];
    const freshProfileUser = users[profileIndex];

    // Initialize arrays
    if (!freshCurrentUser.following) freshCurrentUser.following = [];
    if (!freshProfileUser.followers) freshProfileUser.followers = [];

    if (isFollowing) {
      // UNFOLLOW
      freshCurrentUser.following = freshCurrentUser.following.filter(
        (id) => id !== profileUserId,
      );
      freshProfileUser.followers = freshProfileUser.followers.filter(
        (id) => id !== currentUserObj.id,
      );
    } else {
      // FOLLOW
      freshCurrentUser.following.push(profileUserId);
      freshProfileUser.followers.push(currentUserObj.id);
    }

    isFollowing = !isFollowing;

    // Update button
    newFollowBtn.innerHTML = isFollowing ? "Following" : "Follow";
    newFollowBtn.classList.toggle("following", isFollowing);

    // Save to localStorage
    users[currentIndex] = freshCurrentUser;
    users[profileIndex] = freshProfileUser;
    localStorage.setItem("allUsers", JSON.stringify(users));

    // Update currentUserObj in memory
    if (currentUserObj) {
      currentUserObj.following = freshCurrentUser.following;
    }

    // Refresh stats with updated follower count
    updateProfileStats(freshProfileUser);
  });
} else {
  // SHOWING OWN PROFILE
  const currentUser = allUsers.find((u) => u.id === currentUserObj?.id);

  if (currentUser) {
    displayProfile(currentUser);

    // Show/hide buttons
    if (settingsBtn) settingsBtn.style.display = "block";
    if (followBtn) followBtn.style.display = "none";
  } else {
    // Fallback - try to show currentUserObj directly
    if (currentUserObj) {
      displayProfile(currentUserObj);
    }
  }
}

// if (profileUserId && Number(profileUserId) !== currentUserObj.id) {
//   // Viewing someone else's profile
//   const profileUser = allUsers.find((u) => u.id === Number(profileUserId));

//   if (profileUser) {
//     // Override the display with the other user's data
//     displayNameElem.textContent = profileUser.displayName;
//     displayUsernameElem.textContent = "@" + profileUser.username;
//     displayBioElem.textContent = profileUser.bio;
//     displayPicElem.src = profileUser.profilePic || "images/default.png";

//     // Update stats for the other user
//     const profiledataDiv = document.querySelector(".profile-data");
//     if (profiledataDiv) {
//       profiledataDiv.innerHTML = `
//         <div class="profile-data">
//           <div>
//             <p>${profileUser.posts ? profileUser.posts.length : 0}</p>
//             <p class="labeling">Posts</p>
//           </div>
//           <div>
//             <p>${profileUser.followers ? profileUser.followers.length : 0}</p>
//             <p class="labeling">Followers</p>
//           </div>
//           <div>
//             <p>${profileUser.following ? profileUser.following.length : 0}</p>
//             <p class="labeling">Following</p>
//           </div>
//         </div>
//       `;
//     }

// // Show/hide buttons for other user's profile
// if (settingsBtn) settingsBtn.style.display = "none";
// if (followBtn) followBtn.style.display = "block";

// // Check if current user is already following this profile
// const isFollowing = currentUserObj.following?.includes(profileUser.id);
// followBtn.textContent = isFollowing ? "Following" : "Follow";
// if (isFollowing) {
//   followBtn.classList.add("following");
// }

//     // Add follow/unfollow functionality
//     followBtn.addEventListener("click", () => {
//       toggleFollow(currentUserObj.id, profileUser.id);
//     });

//     console.log(`Viewing profile of: ${profileUser.username}`);
//   } else {
//     console.log("Profile user not found, showing current user");
//     loadSavedData();
//   }
// } else {
//   // Viewing own profile
//   if (settingsBtn) settingsBtn.style.display = "block";
//   if (followBtn) followBtn.style.display = "none";
//   console.log("Viewing own profile");
// }

// ====================================
//    Follow/Unfollow Function
// ====================================

// function toggleFollow(currentUserId, profileUserId) {
//   // Get fresh data
//   let users = getAllUsers() || [];

//   // Find indexes
//   const currentUserIndex = users.findIndex((u) => u.id === currentUserId);
//   const profileUserIndex = users.findIndex((u) => u.id === profileUserId);

//   if (currentUserIndex === -1 || profileUserIndex === -1) return;

//   const currentUser = users[currentUserIndex];
//   const profileUser = users[profileUserIndex];

//   // Initialize arrays if they don't exist
//   if (!currentUser.following) currentUser.following = [];
//   if (!profileUser.followers) profileUser.followers = [];

//   // Check if already following
//   const isFollowing = currentUser.following.includes(profileUserId);

//   if (isFollowing) {
//     // Unfollow
//     currentUser.following = currentUser.following.filter(
//       (id) => id !== profileUserId,
//     );
//     profileUser.followers = profileUser.followers.filter(
//       (id) => id !== currentUserId,
//     );
//     followBtn.textContent = "Follow";
//     followBtn.classList.remove("following");
//     console.log("Unfollowed user");
//   } else {
//     // Follow
//     currentUser.following.push(profileUserId);
//     profileUser.followers.push(currentUserId);
//     followBtn.textContent = "Following";
//     followBtn.classList.add("following");
//     console.log("Followed user");
//   }

//   // Save updated users
//   users[currentUserIndex] = currentUser;
//   users[profileUserIndex] = profileUser;
//   saveAllUsers(users);

//   // Update currentUserObj
//   if (currentUserId === currentUserObj.id) {
//     currentUserObj.following = currentUser.following;
//   }

//   // Refresh stats to update follower count
//   const profiledataDiv = document.querySelector(".profile-data");
//   if (profiledataDiv) {
//     profiledataDiv.innerHTML = `
//       <div class="profile-data">
//         <div>
//           <p>${profileUser.posts ? profileUser.posts.length : 0}</p>
//           <p class="labeling">Posts</p>
//         </div>
//         <div>
//           <p>${profileUser.followers ? profileUser.followers.length : 0}</p>
//           <p class="labeling">Followers</p>
//         </div>
//         <div>
//           <p>${profileUser.following ? profileUser.following.length : 0}</p>
//           <p class="labeling">Following</p>
//         </div>
//       </div>
//     `;
//   }
// }

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
//didnt implement edit profile pic
//const editProfilePic = document.querySelector(".profile-pic");

settingsBtn.addEventListener("click", () => {
  // Load current displayed values into edit inputs
  editUsername.value = displayUsernameElem.textContent.replace("@", ""); // Remove @ symbol if present
  editDisplayName.value = displayNameElem.textContent;
  editBio.value = displayBioElem.textContent;
  //editProfilePic.src

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

// // ======================================
// //        Edit Profile Save Changes
// // ======================================
// saveBtn?.addEventListener("click", () => {
//   // Update currentUser object
//   currentUserObj.username = editUsername.value.trim();
//   currentUserObj.displayName = editDisplayName.value.trim();
//   currentUserObj.bio = editBio.value.trim();

//   // 2. Get all users
//   //alr in feed2.js
//   //const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

//   // 3. Find user by ID
//   const index = allUsers.findIndex((user) => user.id === currentUserObj.id);

//   if (index !== -1) {
//     // 4. Update existing user (NOT push)
//     allUsers[index] = { ...allUsers[index], ...currentUserObj };
//   }

//   // 5. Save updated array
//   saveAllUsers(allUsers);

//   //6. Update UI display
//   displayNameElem.textContent = currentUserObj.displayName;
//   displayUsernameElem.textContent = "@" + currentUserObj.username;
//   displayBioElem.textContent = currentUserObj.bio;

//   closePanel();
// });
// save changes
saveBtn?.addEventListener("click", () => {
  currentUserObj.username = editUsername.value.trim();
  currentUserObj.displayName = editDisplayName.value.trim();
  currentUserObj.bio = editBio.value.trim();

  let users = JSON.parse(localStorage.getItem("allUsers")) || [];
  const index = users.findIndex((u) => u.id === currentUserObj.id);

  if (index !== -1) {
    users[index] = { ...users[index], ...currentUserObj };
  }

  localStorage.setItem("allUsers", JSON.stringify(users));

  // Update UI display
  displayNameElem.textContent = currentUserObj.displayName;
  displayUsernameElem.textContent = "@" + currentUserObj.username;
  displayBioElem.textContent = currentUserObj.bio;

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

//========================================
//         Render Posts
//========================================

// loadPost() handled in feed2.js
