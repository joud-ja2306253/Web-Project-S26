const post_Key = "post";
const likes_Key = "likes";

function getPost() {
  return JSON.parse(localStorage.getItem(post_Key)) || [];
}

function savePost(posts) {
  localStorage.setItem(post_Key, JSON.stringify(posts));
}

function getLikes() {
  return JSON.parse(localStorage.getItem(likes_Key)) || [];
}

function saveLikes(likes) {
  localStorage.setItem(likes_Key, JSON.stringify(likes));
}

const container = document.getElementById("postsContainer");
const post_btn = document.getElementById("postBtn");
const enter_post = document.getElementById("postInput");

const currentUser = "User";

function loadPost() {
  const data = getPost();
  const likes = getLikes();

  const post_data = data.map(post => {
    const postLikes = likes.filter(like => like.postID === post.id);
    const userLike = likes.find(
      like => like.postID === post.id && like.userID === currentUser
    );
// ${userLike ? "♥" : "♡"}
    return `
      <div class="post_R">
        <div class="post-header">
          <h4>${post.name}</h4>
          <span class="time">${post.time}</span>
        </div>

        <div class="post-content">
          <p>${post.comment}</p>
        </div>

        <div class="post-actions">
          <div class="post_actions">
            <button id="likeBtn-${post.id}" class="menu_btn" onclick="addlike(${post.id})">♡
              
            </button>
            <p id="likeCount-${post.id}">${postLikes.length} likes</p>
          </div>

<div class="menu">
  <button class="menu_btn" onclick="toggleMenu(${post.id})">⋮</button>

  <ul id="menuList-${post.id}" style="display: none">
    <li>
      <button class="menu_btn" style="font-size: 15px">
        Edit post
      </button>
    </li>
    <li>
      <button class="menu_btn" onclick="deletePost(${post.id})" style="font-size: 15px">
        Delete post
      </button>
    </li>
  </ul>
</div>

              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = post_data;
}


function toggleMenu(id) {
  const menu = document.getElementById(`menuList-${id}`);

  if (menu.style.display === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
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

function deleteComment(id) {
  let comments = getComments();

  comments = comments.filter(c => c.id !== id);

  saveComments(comments);
  loadComments();
}


//like ===========================
function reloadLikeButtons() {
  const likes = getLikes();
  const posts = getPost();

  posts.forEach(post => {
    const likeBtn = document.getElementById(`likeBtn-${post.id}`);
    const likeCount = document.getElementById(`likeCount-${post.id}`);

    const postLikes = likes.filter(like => like.postID === post.id);
    const userLike = likes.find(
      like => like.postID === post.id && like.userID === currentUser
    );

    if (likeBtn) {
      if (userLike) {
        likeBtn.textContent = "♥";
        likeBtn.classList.add("liked");
      } else {
        likeBtn.textContent = "♡";
        likeBtn.classList.remove("liked");
      }
    }

    if (likeCount) {
      likeCount.textContent = `${postLikes.length} likes`;
    }
  });
}
function addlike(postID) {
  let likes = getLikes();
  const likeBtn = document.getElementById(`likeBtn-${postID}`);
  const likeCount = document.getElementById(`likeCount-${postID}`);

  const existingLike = likes.find(
    like => like.postID === postID && like.userID === currentUser
  );

  if (!existingLike) {
    const newLike = {
      id: Date.now(),
      userID: currentUser,
      postID: postID
    };

    likes.push(newLike);
    likeBtn.classList.add("liked");
    likeBtn.textContent = "♥";
  } else {
    likes = likes.filter(
      like => !(like.postID === postID && like.userID === currentUser)
    );

    likeBtn.classList.remove("liked");
    likeBtn.textContent = "♡";
  }

  saveLikes(likes);

  const postLikes = likes.filter(like => like.postID === postID);
  likeCount.textContent = `${postLikes.length} likes`;
}



// btn.addEventListener("click", show_ED);

function deletePost(id) {
  let posts = getPost();
  let likes = getLikes();

  posts = posts.filter(post => post.id !== id);
  likes = likes.filter(like => like.postID !== id);

  savePost(posts);
  saveLikes(likes);

  loadPost();
  reloadLikeButtons();
}
loadPost();
reloadLikeButtons();