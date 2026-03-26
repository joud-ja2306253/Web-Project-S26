// ==================== Joud GET CURRENT USER ====================

// Get all users
function getAllUsers() {
  return JSON.parse(localStorage.getItem("allUsers"));
}

function saveAllUsers(allUsers) {
  localStorage.setItem("allUsers", JSON.stringify(allUsers));
}
const allUsers = getAllUsers() || [];

// Get logged-in user
function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

//=============
//  Get current logged-in user by id match to allUsers and return its object

//gets id
const currentUserID = getCurrentUser();
if (!currentUserID) {
  window.location.href = "login-page.html";
}
//gets obj
const currentUserObj = allUsers.find((user) => user.id === currentUserID);
//=============

//==================================================

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

// let currentPosts = [];
// let allPosts = getPost();

function loadPost() {
  //const data = getPost();

  // Get current page name from URL
  const path = window.location.pathname; // e.g., "/profile-page.html"
  const page = path.split("/").pop(); // gets "profile-page.html" or "feed.html"

  const allPosts = getPost();
  let data;

  if (page === "profile-page.html") {
    // Only show posts by the current user
    data = allPosts.filter((post) => post.userId === currentUserObj.id);
  } else {
    // Home/feed page shows all posts
    data = allPosts;
  }
  const likes = getLikes();

  const post_data = data
    .map((post) => {
      const postLikes = likes.filter((like) => like.postID === post.id);
      const userLike = likes.find(
        (like) => like.postID === post.id && like.userID === currentUserObj.id,
      );

      return `
      <div class="post_R">
        <div class="post-header">
          <h4>${post.name}</h4>
          <span class="time">${post.time}</span>
          
          <div class="menu">
            <button class="menu_btn" onclick="toggleMenu(${post.id})">⋮</button>

            <ul id="menuList-${post.id}" style="display: none">
              <li>
                <button id="edit_post" class="menu_btn" onclick="editPost(${post.id})" style="font-size: 15px">
                  Edit post
                </button>
              </li>
              <li>
                <button id="delte_post" class="menu_btn" onclick="deletePost(${post.id})" style="font-size: 15px">
                  Delete post
                </button>
              </li>
            </ul>
        </div>
        </div>

        <div class="post-content">
          <p id="postText-${post.id}">${post.comment}</p>
          <button id="savePost-${post.id}" 
            onclick="savePostEdit(${post.id})" 
            style="display:none;">
          Save
          </button>
          
        </div>

        <div class="post-actions">
          <div class="post_actions">
          
            <button id="likeBtn-${post.id}" class="menu_btn" onclick="addlike(${post.id})">♡
              
            </button>
            <p id="likeCount-${post.id}">${postLikes.length} likes</p>
        </div>



        <div>
          <button id="commentBtn-${post.id}" class="menu_btn" onclick="toggleComments(${post.id})">🗨️</button>
        </div>

        <div class="commentBox" style="display: none" id="commentBox-${post.id}">
          <input
            class="enterComment"
            id="enterComment-${post.id}"
            type="text"
            placeholder="write your comment"
          />
          <button class="sendComment" id="sendComment-${post.id}" onclick="addComment(${post.id})">Send</button>
          <p class="loadedCommnetText" id="loadedCommnetText-${post.id}">
            comments will load here
          </p>
        </div>



        

          </div>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML = post_data;
}

//delet menue
function toggleMenu(id) {
  const menu = document.getElementById(`menuList-${id}`);

  if (menu.style.display === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
}

//add post
//joud modified and added gaurd (the if statement)
if (post_btn) {
  post_btn.addEventListener("click", addPost);
  function addPost() {
    const text = enter_post.value.trim();

    if (text === "") {
      return;
    }

    const posts = getPost();

    const newPost = {
      id: Date.now(),

      // joud Create post with USER ID and USERNAME
      userId: currentUserObj.id, //  Link to user who created it
      username: currentUserObj.username, //  Store username for display

      name: currentUserObj.displayName,
      comment: text,
      time: new Date().toLocaleString(),
    };

    //joud modify new posts on top
    posts.unshift(newPost);
    savePost(posts);

    // joud Update user's posts array
    currentUserObj.posts.push(newPost.id);
    saveAllUsers(allUsers);
    // localStorage.setItem('allUsers', JSON.stringify(currentUserObj));

    enter_post.value = "";
    loadPost();
  }
} else {
  console.warn("Add post elements not found or user not logged in.");
}

//like ===========================
function reloadLikeButtons() {
  const likes = getLikes();
  const posts = getPost();

  posts.forEach((post) => {
    const likeBtn = document.getElementById(`likeBtn-${post.id}`);
    const likeCount = document.getElementById(`likeCount-${post.id}`);

    const postLikes = likes.filter((like) => like.postID === post.id);
    const userLike = likes.find(
      (like) => like.postID === post.id && like.userID === currentUserObj.id,
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
//add like ===================
function addlike(postID) {
  let likes = getLikes();
  const likeBtn = document.getElementById(`likeBtn-${postID}`);
  const likeCount = document.getElementById(`likeCount-${postID}`);

  const existingLike = likes.find(
    (like) => like.postID === postID && like.userID === currentUserObj.id,
  );

  if (!existingLike) {
    const newLike = {
      id: Date.now(),

      // joud modify
      userID: currentUserObj.id,

      postID: postID,
    };

    likes.push(newLike);
    likeBtn.classList.add("liked");
    likeBtn.textContent = "♥";
  } else {
    likes = likes.filter(
      (like) => !(like.postID === postID && like.userID === currentUserObj.id),
    );

    likeBtn.classList.remove("liked");
    likeBtn.textContent = "♡";
  }

  saveLikes(likes);

  const postLikes = likes.filter((like) => like.postID === postID);
  likeCount.textContent = `${postLikes.length} likes`;
}

//delete post
function deletePost(id) {
  let posts = getPost();
  let likes = getLikes();

  posts = posts.filter((post) => post.id !== id);
  likes = likes.filter((like) => like.postID !== id);

  savePost(posts);
  saveLikes(likes);

  loadPost();
  reloadLikeButtons();
}

const comments_Key = "comments";

function getComments() {
  return JSON.parse(localStorage.getItem(comments_Key)) || [];
}

function saveComments(comments) {
  localStorage.setItem(comments_Key, JSON.stringify(comments));
}

function toggleComments(postID) {
  const box = document.getElementById(`commentBox-${postID}`);

  if (box.style.display === "none" || box.style.display === "") {
    box.style.display = "block";
    loadComments(postID);
  } else {
    box.style.display = "none";
  }
}

function loadComments(postID) {
  const data = getComments();
  const loadedCommnetText = document.getElementById(
    `loadedCommnetText-${postID}`,
  );

  const filteredComments = data.filter((comment) => comment.postID === postID);

  const comment_data = filteredComments
    .map(
      (t) => `
    <div class="comment_row">
      <p class="box" id="comment-${t.id}" data-name="${t.name}">
        ${t.name}: ${t.comment}
      </p>

      <button class="menu_btn CommentBtn" onclick="deleteComment(${t.id}, ${postID})">Delete</button>
      <button class="menu_btn CommentBtn" id="editBtn-${t.id}" onclick="editComment(${t.id})">Edit</button>
      <button class="menu_btn CommentBtn" id="saveBtn-${t.id}" onclick="saveEdit(${t.id}, ${postID})" style="display:none;">Save</button>
    </div>
  `,
    )
    .join("");

  loadedCommnetText.innerHTML = comment_data;
}

function addComment(postID) {
  const enterComment = document.getElementById(`enterComment-${postID}`);
  const text = enterComment.value.trim();

  if (text === "") {
    return;
  }

  const comments = getComments();

  const newComment = {
    id: Date.now(),
    postID: postID,
    name: "User",
    comment: text,
  };

  comments.push(newComment);
  saveComments(comments);

  enterComment.value = "";
  loadComments(postID);
}

function deleteComment(id, postID) {
  let comments = getComments();

  comments = comments.filter((c) => c.id !== id);

  saveComments(comments);
  loadComments(postID);
}

function editComment(id) {
  const commentText = document.querySelector(`#comment-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  commentText.contentEditable = true;
  commentText.focus();

  saveBtn.style.display = "inline-block";
  editBtn.style.display = "none";
}

function saveEdit(id, postID) {
  const commentText = document.querySelector(`#comment-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  const originalName = commentText.dataset.name;
  const fullText = commentText.textContent.trim();
  const updatedComment = fullText.replace(`${originalName}:`, "").trim();

  const comments = getComments();
  const index = comments.findIndex((c) => c.id === id);

  if (index !== -1) {
    comments[index].comment = updatedComment;
    saveComments(comments);
  }

  commentText.contentEditable = false;
  saveBtn.style.display = "none";
  editBtn.style.display = "inline-block";

  loadComments(postID);
}

function editPost(id) {
  const postText = document.querySelector(`#postText-${id}`);
  const saveBtn = document.querySelector(`#savePost-${id}`);
  const editBtn = document.querySelector(`#edit_post-${id}`);

  postText.contentEditable = true;
  postText.focus();

  saveBtn.style.display = "inline-block";
  editBtn.style.display = "none";
}

function savePostEdit(id) {
  const postText = document.querySelector(`#postText-${id}`);
  const saveBtn = document.querySelector(`#savePost-${id}`);
  const editBtn = document.querySelector(`#edit_post-${id}`);

  const updatedText = postText.textContent.trim();

  const posts = getPost();
  const index = posts.findIndex((p) => p.id === id);

  if (index !== -1) {
    posts[index].comment = updatedText;
    savePost(posts);
  }

  postText.contentEditable = false;
  saveBtn.style.display = "none";
  editBtn.style.display = "inline-block";

  loadPost();
  reloadLikeButtons();
}
loadPost();
reloadLikeButtons();
