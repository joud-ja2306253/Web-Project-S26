// ===================================
//         Joud Profile Page
//====================================

// ===================================
//         Profile Action Button
// ===================================

const currentUserId = "123"; // Get from your auth system
const profileUserId = "456"; // Get from URL/profile data

const editProfileBtn = document.querySelector("#editProfileBtn");
const followBtn = document.querySelector("#followBtn");

// Guard clauses
if (!editProfileBtn && !followBtn) {
  console.log("Buttons not found - exiting Joud's script");
  return;
}
//this code only runs if both follow and edit are there (in profile page of browser/current user)

// Decide which button to show
if (currentUserId === profileUserId) {
  // User's own profile - show edit, hide follow
  //   editProfileBtn.style.display = "flex";
  followBtn.style.display = "none";

  // Add edit profile functionality
  editProfileBtn.addEventListener("click", () => {
    // Your edit profile logic
  });
} else {
  // Someone else's profile - show follow, hide edit
  editProfileBtn.style.display = "none";
  //   followBtn.style.display = "flex";
  // or
  //   followBtn.style.display = "";

  let isFollowing = false;

  followBtn.addEventListener("click", () => {
    if (!followBtn) return;
    isFollowing = !isFollowing;
    followBtn.textContent = isFollowing ? "Following" : "Follow";
    followBtn.classList.toggle("following", isFollowing);
  });
}
