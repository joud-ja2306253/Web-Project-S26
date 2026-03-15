// like ===================

const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

let liked = false;
let count = 0;

likeBtn.addEventListener("click", function(){

    if(!liked){
        likeBtn.classList.add("liked");
        likeBtn.textContent = "♥"; 
        count++;
        liked = true;
    } else {
        likeBtn.classList.remove("liked");
        likeBtn.textContent = "♡";
        count--;
        liked = false;
    }

    likeCount.textContent = count;
});
//=====================================

//edit/delete menu

const btn = document.querySelector("#menuBtn");
const menu = document.querySelector("#menuList");

const choise_Edit_post = document.querySelector("#edit_post");
const Edit_post_form = document.querySelector("#edit_post_form");

btn.addEventListener("click", show_ED);

function show_ED() {
  if (menu.style.display === 'none') {
    menu.style.display = '';
  } else {
    menu.style.display = 'none';
    Edit_post_form.style.display = 'none';
  }
}
//================================================
 
// edit post form
choise_Edit_post.addEventListener("click", show_editPost_form);

function show_editPost_form(){
  if (Edit_post_form.style.display === 'none'){
    Edit_post_form.style.display = '';
  } else {
    Edit_post_form.style.display = 'none';
  }
}

//==================================

// comment/ edit comment / delete 
//to show and hide the comment section 
const commentBtn= document.querySelector('#commentBtn');
const commentBox= document.querySelector('#commentBox');

commentBtn.addEventListener("click", show_comment_box);

function show_comment_box(){
  if (commentBox.style.display === 'none'){
    commentBox.style.display = '';
  } else {
    commentBox.style.display = 'none';
  }
}



// to add comment 

//first step- to get id 

const loadBtn_comment= document.querySelector('#commentBtn');
const enterComment = document.querySelector('#enterComment');
const loadedCommnetText= document.querySelector('#loadedCommnetText');
// we can skip this one and write the url immiditly 
const api_url= 'https://69b5d54f583f543fbd9c755b.mockapi.io/api/comments';

// step two the event
loadBtn_comment.addEventListener('click', loadComments);

//step three code the function 
async function loadComments() {
  const response = await fetch(api_url);
  const data = await response.json();

  const comment_data = data.map(t => `
    <div class="comment_row">
      <p class="box" id="comment-${t.id}" data-name="${t.name}">${t.name}: ${t.comment}</p>
      
      <button class="menu_btn CommentBtn" onclick="deleteTransaction(${t.id})">Delete</button>
      <button class="menu_btn CommentBtn" id="editBtn-${t.id}" onclick="EditTransaction(${t.id})">Edit</button>
      <button class="menu_btn CommentBtn" id="saveBtn-${t.id}" onclick="saveEdit(${t.id})" style="display:none;">Save</button>
    </div>
  `).join("");

  loadedCommnetText.innerHTML = comment_data;
}

// delete
async function deleteTransaction(id) {
  await fetch(`${api_url}/${id}`, {
    method: "DELETE"
  });
  loadComments();
}

// edit in same place
function EditTransaction(id) {
  const commentText = document.querySelector(`#comment-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  commentText.contentEditable = true;
  commentText.focus();

  saveBtn.style.display = "inline-block";
  editBtn.style.display = "none";
}

// save edited comment
async function saveEdit(id) {
  const commentText = document.querySelector(`#comment-${id}`);
  const saveBtn = document.querySelector(`#saveBtn-${id}`);
  const editBtn = document.querySelector(`#editBtn-${id}`);

  const originalName = commentText.dataset.name;
  const fullText = commentText.textContent.trim();

  const updatedComment = fullText.replace(`${originalName}:`, "").trim();

  await fetch(`${api_url}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: updatedComment })
  });

  commentText.contentEditable = false;
  saveBtn.style.display = "none";
  editBtn.style.display = "inline-block";

  loadComments();
}
  // const commentMenu = document.querySelector('#commentMenu');
    // if (commentMenu.style.display === 'block'){
    //   commentMenu.style.display = 'none';
    // } else {
    //   commentMenu.style.display = 'block';
    // }











// to add comment
const sendCommentBtn = document.querySelector('#sendComment');
sendCommentBtn.addEventListener('click', addComment);

async function addComment(){

    const newComment = {
        name: "User",
        comment: enterComment.value
    };

    await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
    });

    enterComment.value = ""; // clear input
    loadComments(); // reload comments
}

// ===================================
//         Joud Profile Page
//====================================
/* Follow button toggle */
const followBtn = document.getElementById("followBtn");
let isFollowing = false;

if (followBtn) {
  followBtn.addEventListener("click", () => {
    isFollowing = !isFollowing;
    followBtn.textContent = isFollowing ? "Following" : "Follow";
    followBtn.classList.toggle("following", isFollowing);
  });





