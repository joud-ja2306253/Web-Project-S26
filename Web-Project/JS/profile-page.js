// ===================================
//         Joud Profile Page
//====================================

// ===================================
//         Profile Action Button
// ===================================

const currentUserId = "123"; // Get from your auth system
const profileUserId = "123"; // Get from URL/profile data

const editProfileBtn = document.querySelector("#editProfileBtn");
const followBtn = document.querySelector("#followBtn");

// Guard clauses
if (!editProfileBtn && !followBtn) {
  console.log("Buttons not found - exiting Joud's script");
  //   return;
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

  const originalHTML = followBtn.innerHTML;
  let isFollowing = false;

  followBtn.addEventListener("click", () => {
    if (!followBtn) return;
    isFollowing = !isFollowing;
    followBtn.textContent = isFollowing ? "Following" : originalHTML;
    followBtn.classList.toggle("following", isFollowing);
  });
}


// edit profile

// const editBtn = document.getElementById("editProfileBtn");

const panel = document.getElementById("editPanel");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");

editProfileBtn.addEventListener("click", () => {
  overlay.classList.add("active");
  panel.classList.add("active");

//   // Load existing data from localStorage
//   document.getElementById("name").value = localStorage.getItem("name") || "";
//   document.getElementById("email").value = localStorage.getItem("email") || "";
});

closeBtn.addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);

function closePanel() {
  panel.classList.remove("active");
  overlay.classList.remove("active");
}

// // Save data
// document.getElementById("saveBtn").addEventListener("click", () => {
//   const name = document.getElementById("name").value;
//   const email = document.getElementById("email").value;

//   localStorage.setItem("name", name);
//   localStorage.setItem("email", email);

  // closePanel();
// });