// const likeBtn = document.getElementById("likeBtn");
// const likeCount = document.getElementById("likeCount");

// let liked = false;
// let count = 0;

// likeBtn.addEventListener("click", function(){

//     if(!liked){
//         likeBtn.classList.add("liked");
//         likeBtn.textContent = "♥";
//         count++;
//         liked = true;
//     } else {
//         likeBtn.classList.remove("liked");
//         likeBtn.textContent = "♡";
//         count--;
//         liked = false;
//     }

//     likeCount.textContent = count;
// });

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


choise_Edit_post.addEventListener("click", show_editPost_form);
function show_editPost_form(){
    if (Edit_post_form.style.display === 'none'){
        Edit_post_form.style.display = '';
    } else {
        Edit_post_form.style.display = 'none';
    }
}