const post_Key = "post";

function getPost() {
  return JSON.parse(localStorage.getItem(post_Key)) || [];
}

function savePost(posts) {
  localStorage.setItem(post_Key, JSON.stringify(posts));
}

const container = document.getElementById("postsContainer");
const post_btn = document.getElementById("postBtn");
const enter_post = document.getElementById("postInput");

function loadPost() {
  const data = getPost();

  const post_data = data.map(post => `
    <div class="post_R">
      <div class="post-header">
        <h4>${post.name}</h4>
        <span class="time">${post.time}</span>
      </div>

      <div class="post-content">
        <p>${post.comment}</p>
      </div>

      <div class="post-actions">
        <button class="menu_btn like-btn">♡</button>
        <button class="menu_btn comment-btn">🗨️</button>
      </div>
    </div>
  `).join("");

  container.innerHTML = post_data;
}

function addPost() {
  const text = enter_post.value.trim();

  if (text === "") {
    return;
  }

  const posts = getPost();

  const newPost = {
    id: Date.now(),
    name: "User",
    comment: text,
    time: new Date().toLocaleString()
  };

  posts.push(newPost);
  savePost(posts);

  enter_post.value = "";
  loadPost();
}

post_btn.addEventListener("click", addPost);

loadPost();