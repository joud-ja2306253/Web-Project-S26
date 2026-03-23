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

// load on page start
document.addEventListener("DOMContentLoaded", renderPosts);