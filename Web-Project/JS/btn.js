// // like ===================

// // const likeBtn = document.getElementById("likeBtn");
// // const likeCount = document.getElementById("likeCount");

// // let liked = false;
// // let count = 0;

// // likeBtn.addEventListener("click", function(){

// //     if(!liked){
// //         likeBtn.classList.add("liked");
// //         likeBtn.textContent = "♥"; 
// //         count++;
// //         liked = true;
// //     } else {
// //         likeBtn.classList.remove("liked");
// //         likeBtn.textContent = "♡";
// //         count--;
// //         liked = false;
// //     }

// //     likeCount.textContent = count;
// // });
// //=====================================

// //edit/delete menu

// const btn = document.querySelector("#menuBtn");
// const menu = document.querySelector("#menuList");

// const choise_Edit_post = document.querySelector("#edit_post");
// const Edit_post_form = document.querySelector("#edit_post_form");

// btn.addEventListener("click", show_ED);

// function show_ED() {
//   if (menu.style.display === 'none') {
//     menu.style.display = '';
//   } else {
//     menu.style.display = 'none';
//     Edit_post_form.style.display = 'none';
//   }
// }
// //================================================
 
// // edit post form
// choise_Edit_post.addEventListener("click", show_editPost_form);

// function show_editPost_form(){
//   if (Edit_post_form.style.display === 'none'){
//     Edit_post_form.style.display = '';
//   } else {
//     Edit_post_form.style.display = 'none';
//   }
// }

// //==================================

// // comment/ edit comment / delete 
// //to show and hide the comment section 
// const commentBtn= document.querySelector('#commentBtn');
// const commentBox= document.querySelector('#commentBox');

// commentBtn.addEventListener("click", show_comment_box);

// function show_comment_box(){
//   if (commentBox.style.display === 'none'){
//     commentBox.style.display = '';
//   } else {
//     commentBox.style.display = 'none';
//   }
// }



// // to add comment 

// //first step- to get id 

// const loadBtn_comment= document.querySelector('#commentBtn');
// const enterComment = document.querySelector('#enterComment');
// const loadedCommnetText= document.querySelector('#loadedCommnetText');
// // we can skip this one and write the url immiditly 
// const api_url= 'https://69b5d54f583f543fbd9c755b.mockapi.io/api/comments';

// // step two the event
// loadBtn_comment.addEventListener('click', loadComments);

// //step three code the function 
// async function loadComments() {
//   const response = await fetch(api_url);
//   const data = await response.json();

//   const comment_data = data.map(t => `
//     <div class="comment_row">
//       <p class="box" id="comment-${t.id}" data-name="${t.name}">${t.name}: ${t.comment}</p>
      
//       <button class="menu_btn CommentBtn" onclick="deleteTransaction(${t.id})">Delete</button>
//       <button class="menu_btn CommentBtn" id="editBtn-${t.id}" onclick="EditTransaction(${t.id})">Edit</button>
//       <button class="menu_btn CommentBtn" id="saveBtn-${t.id}" onclick="saveEdit(${t.id})" style="display:none;">Save</button>
//     </div>
//   `).join("");

//   loadedCommnetText.innerHTML = comment_data;
// }

// // delete
// async function deleteTransaction(id) {
//   await fetch(`${api_url}/${id}`, {
//     method: "DELETE"
//   });
//   loadComments();
// }

// // edit in same place
// function EditTransaction(id) {
//   const commentText = document.querySelector(`#comment-${id}`);
//   const saveBtn = document.querySelector(`#saveBtn-${id}`);
//   const editBtn = document.querySelector(`#editBtn-${id}`);

//   commentText.contentEditable = true;
//   commentText.focus();

//   saveBtn.style.display = "inline-block";
//   editBtn.style.display = "none";
// }

// // save edited comment
// async function saveEdit(id) {
//   const commentText = document.querySelector(`#comment-${id}`);
//   const saveBtn = document.querySelector(`#saveBtn-${id}`);
//   const editBtn = document.querySelector(`#editBtn-${id}`);

//   const originalName = commentText.dataset.name;
//   const fullText = commentText.textContent.trim();

//   const updatedComment = fullText.replace(`${originalName}:`, "").trim();

//   await fetch(`${api_url}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ comment: updatedComment })
//   });

//   commentText.contentEditable = false;
//   saveBtn.style.display = "none";
//   editBtn.style.display = "inline-block";

//   loadComments();
// }

// // to add comment
// const sendCommentBtn = document.querySelector('#sendComment');
// sendCommentBtn.addEventListener('click', addComment);

// async function addComment(){

//     const newComment = {
//         name: "User",
//         comment: enterComment.value
//     };

//     await fetch(api_url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newComment)
//     });

//     enterComment.value = ""; // clear input
//     loadComments(); // reload comments
// }
// // to like and remove like 
// const api_url_likes = 'https://69b5d54f583f543fbd9c755b.mockapi.io/api/likes';
// const likeBtn = document.querySelector('#likeBtn');
// const likeCount = document.getElementById("likeCount");

// let liked = false;
// let count = 0;

// loadLikes();// because i always need it to load even if the user did not press any buttn 
// likeBtn.addEventListener('click', addlike);

// async function loadLikes() {
//     const response = await fetch(api_url_likes);
//     const data = await response.json();

//     count = data.length;
//     // display data 
//     likeCount.textContent = count +' likes';
//     likeBtn.textContent = "♡";
// }

// async function addlike() {
//     if (!liked) {
//         await fetch(api_url_likes, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
            
//                 postID: 1 // we are refering to one post only, should be changed dfter have multiple posts
//             })
//         });

//         liked = true;
//         count++;
//         likeBtn.classList.add("liked");
//         likeBtn.textContent = "♥";
//     } else {
//         liked = false;
//         count--;
//         likeBtn.classList.remove("liked");
//         likeBtn.textContent = "♡";
//     }

//     likeCount.textContent = count+' likes';
// }




// ==============================
// edit/delete menu
// ==============================

const btn = document.querySelector("#menuBtn");
const menu = document.querySelector("#menuList");

const choise_Edit_post = document.querySelector("#edit_post");
const Edit_post_form = document.querySelector("#edit_post_form");

btn.addEventListener("click", show_ED);

function show_ED() {
  if (menu.style.display === "none") {
    menu.style.display = "";
  } else {
    menu.style.display = "none";
    Edit_post_form.style.display = "none";
  }
}

// ==============================
// edit post form
// ==============================

choise_Edit_post.addEventListener("click", show_editPost_form);

function show_editPost_form() {
  if (Edit_post_form.style.display === "none") {
    Edit_post_form.style.display = "";
  } else {
    Edit_post_form.style.display = "none";
  }
}

// ==============================
// comment section show/hide
// ==============================

const commentBtn = document.querySelector("#commentBtn");
const commentBox = document.querySelector("#commentBox");

commentBtn.addEventListener("click", show_comment_box);

function show_comment_box() {
  if (commentBox.style.display === "none") {
    commentBox.style.display = "";
  } else {
    commentBox.style.display = "none";
  }
}

// ==============================
// localStorage helpers
// ==============================

const comments_Key = "comments";
const likes_key = "likes";

function getComments() {
  return JSON.parse(localStorage.getItem(comments_Key)||[]) ;
}

function saveComments(comments) {
  localStorage.setItem(comments_Key, JSON.stringify(comments));
}

function getLikes() {
  return JSON.parse(localStorage.getItem(likes_key)||[]);
}

function saveLikes(likes) {
  localStorage.setItem(likes_key, JSON.stringify(likes));
}


// ==============================
// comments
// ==============================

const loadBtn_comment = document.querySelector("#commentBtn");
const enterComment = document.querySelector("#enterComment");
const loadedCommnetText = document.querySelector("#loadedCommnetText");
const sendCommentBtn = document.querySelector("#sendComment");

// when comment button clicked -> load comments too
loadBtn_comment.addEventListener("click", loadComments);

// add comment button
sendCommentBtn.addEventListener("click", addComment);

// load comments from localStorage
function loadComments() {
  const data = getComments();

  const comment_data = data.map(t => `
    <div class="comment_row">
      <p class="box" id="comment-${t.id}" data-name="${t.name}">
        ${t.name}: ${t.comment}
      </p>

      <button class="menu_btn CommentBtn" onclick="deleteComment(${t.id})">Delete</button>
      <button class="menu_btn CommentBtn" id="editBtn-${t.id}" onclick="editComment(${t.id})">Edit</button>
      <button class="menu_btn CommentBtn" id="saveBtn-${t.id}" onclick="saveEdit(${t.id})" style="display:none;">Save</button>
    </div>
  `).join("");

  loadedCommnetText.innerHTML = comment_data;
}

// add comment
function addComment() {
  
  const text = enterComment.value;
// this wont accept empty string
  if (text === "") {
    return;
  }

  const comments = getComments();

  const newComment = {
    id: Date.now(),
    name: "User",
    comment: text
  };

  comments.push(newComment);
  saveComments(comments);

  enterComment.value = "";
  loadComments();
}

// delete comment
function deleteComment(id) {
  let comments = getComments();

  comments = comments.filter(c => c.id !== id);

  saveComments(comments);
  loadComments();
}

// make comment editable
function editComment(id) {
  const commentText = document.querySelector(`#comment-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  commentText.contentEditable = true;
  commentText.focus();

  saveBtn.style.display = "inline-block";
  editBtn.style.display = "none";
}

// save edited comment
function saveEdit(id) {
  const commentText = document.querySelector(`#comment-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  const originalName = commentText.dataset.name;
  const fullText = commentText.textContent.trim();

  const updatedComment = fullText.replace(`${originalName}:`, "").trim();

  const comments = getComments();
  const index = comments.findIndex(c => c.id === id);

  if (index !== -1) {
    comments[index].comment = updatedComment;
    saveComments(comments);
  }

  commentText.contentEditable = false;
  saveBtn.style.display = "none";
  editBtn.style.display = "inline-block";

  loadComments();
}

// ==============================
// likes
// ==============================

const likeBtn = document.querySelector("#likeBtn");
const likeCount = document.getElementById("likeCount");

const currentUser = "User";
const currentPostID = 1;

likeBtn.addEventListener("click", addlike);

// load likes when page opens
loadLikes();

function loadLikes() {
  const likes = getLikes();

  const postLikes = likes.filter(like => like.postID === currentPostID);
  const userLike = likes.find(
    like => like.postID === currentPostID && like.userID === currentUser
  );

  likeCount.textContent = postLikes.length + " likes";

  if (userLike) {
    likeBtn.classList.add("liked");
    likeBtn.textContent = "♥";
  } else {
    likeBtn.classList.remove("liked");
    likeBtn.textContent = "♡";
  }
}

function addlike() {
  let likes = getLikes();

  const existingLike = likes.find(
    like => like.postID === currentPostID && like.userID === currentUser
  );

  if (!existingLike) {
    const newLike = {
      id: Date.now(),
      userID: currentUser,
      postID: currentPostID
    };

    likes.push(newLike);
    saveLikes(likes);

    likeBtn.classList.add("liked");
    likeBtn.textContent = "♥";
  } else {
    likes = likes.filter(
      like => !(like.postID === currentPostID && like.userID === currentUser)
    );

    saveLikes(likes);

    likeBtn.classList.remove("liked");
    likeBtn.textContent = "♡";
  }

  loadLikes();
}
