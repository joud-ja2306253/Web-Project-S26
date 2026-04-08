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

// ====================================
//       Search Users Function
// ====================================
function searchUsers() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const searchTerm = searchInput.value.toLowerCase().trim();
  const resultsContainer = document.getElementById("searchResults");

  if (!resultsContainer) return;

  if (searchTerm === "") {
    resultsContainer.style.display = "none";
    resultsContainer.innerHTML = "";
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  const filteredUsers = allUsers.filter((user) => {
    const usernameMatch = user.username?.toLowerCase().includes(searchTerm);
    const displayNameMatch = user.displayName
      ?.toLowerCase()
      .includes(searchTerm);
    return usernameMatch || displayNameMatch;
  });

  // If no users found
  if (filteredUsers.length === 0) {
    resultsContainer.innerHTML = '<div class="no-results">No users found</div>';
    resultsContainer.style.display = "block";
    return;
  }

  // Display search results
  resultsContainer.innerHTML = filteredUsers.map((user) => `
    <div class="search-result-item" data-user-id="${user.id}">
      <img src="${user.profilePic}" class="search-result-img" />
      <div class="search-result-info">
        <div class="search-result-name">${user.displayName}</div>
        <div class="search-result-username">@${user.username}</div>
      </div>
    </div>`,).join("");

  resultsContainer.style.display = "block";

  // Add click event listeners to each search result

  document.querySelectorAll(".search-result-item").forEach((item) => {
    item.addEventListener("click", () => {
      const userId = item.dataset.userId;
      viewUserProfile(userId);
    });
  });
}

// ===============================
//       Close Search Results
// ===============================
// Close search results when clicking outside
document.addEventListener("click", function (event) {
  const searchContainer = document.querySelector(".search-input-row");
  const resultsContainer = document.getElementById("searchResults");
  if (
    searchContainer &&
    resultsContainer &&
    !searchContainer.contains(event.target)
  ) {
    resultsContainer.style.display = "none";
  }
});

// ===========================
//       View User Profile
// ===========================
function viewUserProfile(userId) {
  // Save the user ID to localStorage
  localStorage.setItem("profileUserId", userId);
  // Navigate to profile page
  window.location.href = "profile-page.html";
}

const post_Key = "posts";
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

// Helper Method
function moveCursorToEnd(element) {
  if (!element) return;

  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false); // false = end, true = beginning
  selection.removeAllRanges();
  selection.addRange(range);
}

function loadPost() {
  // FORCE FRESH DATA
  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
  const currentUserObj = allUsers.find(
    (u) =>
      u.id === (window.currentUserId || localStorage.getItem("currentUser")),
  );

  // Get current page name from URL
  const path = window.location.pathname; // e.g., "/profile-page.html"
  const page = path.split("/").pop(); // gets "profile-page.html" or "feed.html"

  const allPosts = getPost();
  let data;

  if (page === "profile-page.html") {
    // Show posts for the profile user, not current user
    const profileUserId = localStorage.getItem("profileUserId");
    let userIdToShow;

    if (profileUserId) {
      // Showing someone's profile (could be own or other)
      userIdToShow = profileUserId;
    } else {
      // No profileUserId, fallback to current user
      userIdToShow = currentUserObj.id;
    }

    data = allPosts.filter((post) => post.userId === userIdToShow);
  } else {
    // Home/feed page shows all posts
    data = allPosts;
  }

  // Check if there are no posts
  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="no-posts">
        <p>Posts will load here...</p>
      </div>`;
    return;
  }

  //remaining load post normal code

  const likes = getLikes();

  const post_data = data
    .map((post) => {
      // post is a variable that represents each post object
      const postLikes = likes.filter((like) => like.postID === post.id);
      const userLike = likes.find(
        (like) => like.postID === post.id && like.userID === currentUserObj.id,
      );

      //add for verification of post actions
      const isPostOwner = post.userId === currentUserObj.id;
      //Get the user who made this post
      const postUser = allUsers.find((u) => u.id === post.userId);
      const profilePic = postUser?.profilePic;
      const name = postUser?.displayName;

      return `
      <div class="post_R" data-has-images="${post.images && post.images.length > 0 ? "true" : "false"}">
        <div class="post-header">
          <div class="post-user-info" onclick="viewUserProfile('${post.userId}')">
            <img src="${profilePic}" class="post-profile-pic" />
            <h4>${name}</h4>
          </div>
          <span class="time">${post.time}</span>

        ${isPostOwner? `

          <div class="menu">
            <button class="menu_btn" onclick="toggleMenu(${post.id})">⋮</button>
                
            <ul id="menuList-${post.id}" style="display: none" class="menu_li">
              <li>
                <button id="edit_post-${post.id}" class="menu_li" onclick="editPost(${post.id})">
                  Edit post
                </button>
              </li>
              <li>
                <button id="delte_post-${post.id}" class="menu_li" onclick="deletePost(${post.id})">
                  Delete post
                </button>
              </li>
            </ul>
          </div>`: ""}
  
        </div>

        <div class="post-content">

        ${post.images && post.images.length > 0? `
        <div class="post-carousel" id="carousel-${post.id}">
        <div class="post-carousel-track" id="track-${post.id}" style="display:flex; transition: transform 0.35s ease;">
          ${post.images.map((src, i) => `
            <div class="post-carousel-slide" style="min-width:100%; box-sizing:border-box;">
              <img src="${src}" class="post-image" alt="post image ${i + 1}" style="width:100%; object-fit:cover;" />
            </div>`,).join("")}
        </div>
        ${post.images.length > 1? `
          <button class="post-carousel-arrow post-carousel-prev" onclick="slidePost('${post.id}', -1)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="post-carousel-arrow post-carousel-next" onclick="slidePost('${post.id}', 1)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
          <div class="post-carousel-dots" id="dots-${post.id}">
            ${post.images.map((_, i) => `
              <span class="post-dot ${i === 0 ? "active" : ""}" onclick="goToPostSlide('${post.id}', ${i}, ${post.images.length})"></span>`,).join("")}
          </div>`: "" }
        </div>`: ""}

          <div class="postEditContainer">
            <p id="postText-${post.id}">${post.comment}</p>
            <button id="savePost-${post.id}" class= "postSaveBtn" 
              onclick="savePostEdit(${post.id})" 
              style="display:none;">
            Save
            </button>
          </div>

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

        

          </div>
          <div class="commentBox" style="display: none" id="commentBox-${post.id}">
          <div class="write-send-comment">
          <input
            class="enterComment"
            id="enterComment-${post.id}"
            type="text"
            placeholder="write your comment"
          />
          <button class="sendComment" id="sendComment-${post.id}" onclick="addComment(${post.id})">Send</button>
          </div>
          <p class="loadedCommnetText" id="loadedCommnetText-${post.id}">
            comments will load here
          </p>
        </div>

        </div>`;}).join("");

  container.innerHTML = post_data;
}

const postSlideIndex = {};

function slidePost(postId, direction) {
  const track = document.getElementById(`track-${postId}`);
  const dots = document.querySelectorAll(`#dots-${postId} .post-dot`);
  const total = track.children.length;

  if (!postSlideIndex[postId]) postSlideIndex[postId] = 0;
  postSlideIndex[postId] = Math.max(0, Math.min(total - 1, postSlideIndex[postId] + direction));

  track.style.transform = `translateX(-${postSlideIndex[postId] * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === postSlideIndex[postId]));
}

function goToPostSlide(postId, index, total) {
  const track = document.getElementById(`track-${postId}`);
  const dots = document.querySelectorAll(`#dots-${postId} .post-dot`);

  postSlideIndex[postId] = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

//delete menu
function toggleMenu(id) {
  const menu = document.getElementById(`menuList-${id}`);

  if (menu.style.display === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";

    //  Cancel edit mode (remove save)
    const saveBtn = document.querySelector(`#savePost-${id}`);
    const postText = document.querySelector(`#postText-${id}`);
    const editBtn = document.querySelector(`#edit_post-${id}`);

    if (saveBtn && saveBtn.style.display === "inline-block") {
      // Cancel edit mode
      postText.contentEditable = false;
      postText.classList.remove("post-text-editing");

      saveBtn.style.display = "none";
      if (editBtn) editBtn.style.display = "inline-block";
    }
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
      comment: text,
      time: new Date().toLocaleString(),
    };

    //joud modify new posts on top
    posts.unshift(newPost);
    savePost(posts);

    // joud Update user's posts array
    currentUserObj.posts.unshift(newPost.id);
    saveAllUsers(allUsers);
    // localStorage.setItem('allUsers', JSON.stringify(currentUserObj));

    enter_post.value = "";
    loadPost();
  }
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
  const userConfirmed = confirm("Are you sure you want to delete this post?");
  if (!userConfirmed) {
    return;
  }

  let posts = getPost();
  let likes = getLikes();

  const postToDelete = posts.find((post) => post.id === id);
  if (!postToDelete) {
    console.error("Post not found");
    return;
  }

  posts = posts.filter((post) => post.id !== id);
  likes = likes.filter((like) => like.postID !== id);

  // Update the user who created the post
  const updatedUsers = allUsers.map((user) => {
    if (user.id === postToDelete.userId) {
      // Remove the post ID from this user's posts
      return {
        ...user,
        posts: user.posts.filter((postId) => postId !== id),
      };
    }
    return user;
  });

  savePost(posts);
  saveLikes(likes);
  saveAllUsers(updatedUsers);

  loadPost();
  reloadLikeButtons();

  // update profile stats on profile page without reload
  if (typeof updateProfileStats === "function") {
    const currentUser = updatedUsers.find((u) => u.id === currentUserObj.id);
    updateProfileStats(currentUser);
  }
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
    //  Get the post to find its owner
    const posts = getPost();
    const post = posts.find((p) => p.id === postID);
    const postOwnerId = post ? post.userId : null;

    //  Pass postOwnerId to loadComments
    loadComments(postID, postOwnerId);
  } else {
    box.style.display = "none";
  }
}

function loadComments(postID, postOwnerId) {
  const data = getComments();
  const loadedCommnetText = document.getElementById(
    `loadedCommnetText-${postID}`,
  );

  const filteredComments = data.filter((comment) => comment.postID === postID);

  const comment_data = filteredComments
    .map((t) => {
      //  Use postOwnerId that was passed in
      const isCommentOwner = t.userId === currentUserObj.id;
      const isPostOwner = postOwnerId === currentUserObj.id;

      return `
    <div class="comment_row">
      <p class="box" id="comment-${t.id}">
        <strong>${t.name}</strong>: 
        <span  class="comment-text" id="commentText-${t.id}">${t.comment}</span>
      </p>

      ${
        isCommentOwner || isPostOwner
          ? `
        <button class="menu_btn CommentBtn" onclick="deleteComment(${t.id}, ${postID})">Delete</button>  
      `
          : ""
      }
      
      ${
        isCommentOwner
          ? `
        <button class="menu_btn CommentBtn edit-save-btn" id="editBtn-${t.id}" onclick="editComment(${t.id})">Edit</button>
        <button class="menu_btn CommentBtn edit-save-btn" id="saveBtn-${t.id}" onclick="saveEdit(${t.id}, ${postID})" style="display:none;">Save</button>
      `
          : ""
      }
    </div>
  `;
    })
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
    userId: currentUserObj.id, //  store user ID that commented
    name: currentUserObj.displayName, //  Store displayname for display
    comment: text,
  };

  comments.unshift(newComment);
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
  const commentText = document.querySelector(`#commentText-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  commentText.classList.add("comment-text-editing");
  commentText.contentEditable = true;
  commentText.focus();
  moveCursorToEnd(commentText);

  saveBtn.style.display = "inline-block";
  editBtn.style.display = "none";
}

function saveEdit(id, postID) {
  const commentText = document.querySelector(`#commentText-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  const updatedComment = commentText.textContent.trim();
  if (updatedComment === "") {
    alert("Comment cannot be empty!");

    // Roll back to original comment without reloading
    const comments = getComments();
    const originalComment = comments.find((c) => c.id === id);
    if (originalComment) {
      commentText.textContent = originalComment.comment;
    }

    // Keep edit mode open
    commentText.focus();
    moveCursorToEnd(commentText);
    return;
  }

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

  postText.contentEditable = true;
  postText.classList.add("post-text-editing");
  postText.focus();
  moveCursorToEnd(postText);

  saveBtn.style.display = "inline-block";
}

function savePostEdit(id) {
  const postText = document.querySelector(`#postText-${id}`);
  const saveBtn = document.querySelector(`#savePost-${id}`);
  const editBtn = document.querySelector(`#edit_post-${id}`);

  const updatedText = postText.textContent.trim();

  if (updatedText === "") {
    alert("Post cannot be empty!");
    // roll back to original text from stored post
    const posts = getPost();
    const originalPost = posts.find((p) => p.id === id);
    if (originalPost) {
      postText.textContent = originalPost.comment;
    }
    postText.focus();
    moveCursorToEnd(postText);
    return;
  }

  const posts = getPost();
  const index = posts.findIndex((p) => p.id === id);

  if (index !== -1) {
    posts[index].comment = updatedText;
    savePost(posts);
  }

  postText.contentEditable = false;
  postText.classList.remove("post-text-editing");
  saveBtn.style.display = "none";
  editBtn.style.display = "inline-block";

  // close the menu after saving
  const menu = document.getElementById(`menuList-${id}`);
  if (menu) {
    menu.style.display = "none";
  }
}
loadPost();
reloadLikeButtons();
