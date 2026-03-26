// ================================
// Feed Rendering (Girl 2)
// ================================

// get posts from localStorage
function getPosts() {
  const posts = localStorage.getItem("posts");
  return posts ? JSON.parse(posts) : [];
}

// render posts
function renderPosts() {
  const container = document.getElementById("postsContainer");
  const posts = getPosts();

  container.innerHTML = "";

  posts.slice().reverse().forEach(post => {

    const postElement = document.createElement("article");
    postElement.classList.add("post-card");

    // IMPORTANT for Girl 3
    postElement.setAttribute("data-id", post.id);

    postElement.innerHTML = `
      <div class="post-header">
        <h4>${post.username}</h4>
          <span class="time">${post.time}</span>
      </div>

      <div class="post-content">
        <p>${post.content}</p>
      </div>

      <!-- Buttons (Girl 3 will control them) -->
      <div class="post-actions">
        <button class="menu_btn like-btn">♡</button>
        <button class="menu_btn comment-btn">🗨️</button>
      </div>
    `;

    container.appendChild(postElement);
  });

}

function searchUsers() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsBox = document.getElementById("searchResults");

  // hide results if input is empty
  if (query === "") {
    resultsBox.style.display = "none";
    resultsBox.innerHTML = "";
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  // filter users by username or displayName
  const matched = allUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(query) ||
      user.displayName.toLowerCase().includes(query)
  );

  if (matched.length === 0) {
    resultsBox.innerHTML = `<p class="no-results">No users found</p>`;
    resultsBox.style.display = "block";
    return;
  }

  resultsBox.innerHTML = matched
    .map(
      (user) => `
      <div class="search-result-item" onclick="goToProfile('${user.id}')">
        <img 
          class="search-avatar" 
          src="${user.profilePic || 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_640.png'}" 
          alt="avatar"
        />
        <div>
          <p class="search-display-name">${user.displayName}</p>
          <p class="search-username">@${user.username}</p>
        </div>
      </div>
    `
    )
    .join("");

  resultsBox.style.display = "block";
}

function goToProfile(userId) {
  // save the profile we want to view, then go to profile page
  localStorage.setItem("viewingUserId", userId);
  window.location.href = "profile-page.html";
}

// close results when clicking outside
document.addEventListener("click", (e) => {
  const container = document.querySelector(".search-container");
  if (!container.contains(e.target)) {
    document.getElementById("searchResults").style.display = "none";
  }
});

// load on page start
document.addEventListener("DOMContentLoaded", renderPosts);