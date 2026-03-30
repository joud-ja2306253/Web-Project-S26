// ===================================
//         Add Post Page - JS
// ===================================

// ---- Auth Guard ----
const currentUserID = localStorage.getItem("currentUser");
if (!currentUserID) {
  window.location.href = "login-page.html";
}

const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
const currentUserObj = allUsers.find((u) => u.id === currentUserID);

if (!currentUserObj) {
  window.location.href = "login-page.html";
}

// ---- State ----
let selectedImages = []; // Array of base64 strings
let currentSlide = 0;

// ---- DOM refs ----
const uploadZone    = document.getElementById("uploadZone");
const imageInput    = document.getElementById("imageInput");
const previewSection = document.getElementById("previewSection");
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots  = document.getElementById("carouselDots");
const imgCountBadge = document.getElementById("imgCountBadge");
const prevArrow     = document.getElementById("prevArrow");
const nextArrow     = document.getElementById("nextArrow");
const captionInput  = document.getElementById("captionInput");
const charCounter   = document.getElementById("charCounter");

// ===================================
//    Upload Zone — click & drag/drop
// ===================================
uploadZone.addEventListener("click", () => imageInput.click());

uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.classList.add("drag-over");
});

uploadZone.addEventListener("dragleave", () => {
  uploadZone.classList.remove("drag-over");
});

uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("drag-over");
  handleFiles(e.dataTransfer.files);
});

imageInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
  // Reset so same file can be re-added if removed
  imageInput.value = "";
});

// ===================================
//    Handle selected files
// ===================================
function handleFiles(files) {
  const fileArray = Array.from(files);
  const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));

  if (imageFiles.length === 0) return;

  // Max 10 images total (like Instagram)
  const remaining = 10 - selectedImages.length;
  const toProcess = imageFiles.slice(0, remaining);

  if (imageFiles.length > remaining) {
    showToast(`Max 10 photos per post. Added ${toProcess.length} photo(s).`);
  }

  let loaded = 0;
  toProcess.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImages.push(e.target.result);
      loaded++;
      if (loaded === toProcess.length) {
        renderCarousel();
        showPreviewSection();
      }
    };
    reader.readAsDataURL(file);
  });
}

// ===================================
//    Show / hide sections
// ===================================
function showPreviewSection() {
  uploadZone.style.display = "none";
  previewSection.classList.add("has-images");
}

function hidePreviewSection() {
  uploadZone.style.display = "";
  previewSection.classList.remove("has-images");
}

// ===================================
//    Carousel Rendering
// ===================================
function renderCarousel() {
  // Clamp currentSlide
  if (currentSlide >= selectedImages.length) {
    currentSlide = selectedImages.length - 1;
  }
  if (currentSlide < 0) currentSlide = 0;

  // Build slides
  carouselTrack.innerHTML = selectedImages
    .map(
      (src, i) => `
    <div class="carousel-slide">
      <img src="${src}" alt="Post image ${i + 1}" />
      <button class="remove-img-btn" onclick="removeImage(${i})" title="Remove photo">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `
    )
    .join("");

  // Move track to current slide
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  // Disable transition briefly to avoid flash on re-render
  carouselTrack.style.transition = "none";
  requestAnimationFrame(() => {
    carouselTrack.style.transition = "transform 0.35s ease";
  });

  // Build dots
  carouselDots.innerHTML = selectedImages
    .map(
      (_, i) => `
    <button class="dot ${i === currentSlide ? "active" : ""}" onclick="goToSlide(${i})"></button>
  `
    )
    .join("");

  // Badge
  imgCountBadge.textContent = `${currentSlide + 1} / ${selectedImages.length}`;

  // Arrows
  prevArrow.classList.toggle("hidden", selectedImages.length <= 1 || currentSlide === 0);
  nextArrow.classList.toggle("hidden", selectedImages.length <= 1 || currentSlide === selectedImages.length - 1);

  // Hide dots row if only 1 image
  carouselDots.style.display = selectedImages.length <= 1 ? "none" : "flex";
  imgCountBadge.style.display = selectedImages.length <= 1 ? "none" : "";
}

// ===================================
//    Carousel Navigation
// ===================================
function changeSlide(direction) {
  currentSlide += direction;
  renderCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  renderCarousel();
}

// Swipe support
let touchStartX = 0;
document.getElementById("carouselWrapper").addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
document.getElementById("carouselWrapper").addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    if (diff > 0 && currentSlide < selectedImages.length - 1) changeSlide(1);
    else if (diff < 0 && currentSlide > 0) changeSlide(-1);
  }
});

// ===================================
//    Remove an image
// ===================================
function removeImage(index) {
  selectedImages.splice(index, 1);

  if (selectedImages.length === 0) {
    // Back to upload zone
    hidePreviewSection();
    currentSlide = 0;
    return;
  }

  // Adjust currentSlide if needed
  if (currentSlide >= selectedImages.length) {
    currentSlide = selectedImages.length - 1;
  }

  renderCarousel();
}

// ===================================
//    Character Counter
// ===================================
function updateCharCount() {
  const len = captionInput.value.length;
  charCounter.textContent = `${len} / 2200`;
  charCounter.classList.toggle("over", len > 2200);
}

// ===================================
//    Submit Post
// ===================================
function submitPost() {
  const caption = captionInput.value.trim();

  // Must have at least a caption or at least one image
  if (!caption && selectedImages.length === 0) {
    showToast("Please add a photo or write a caption.");
    return;
  }

  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  const newPost = {
    id: Date.now(),
    userId: currentUserObj.id,
    comment: caption,                   // caption used as the post text (matches feed.js key)
    images: [...selectedImages],        // array of base64 image strings
    time: new Date().toLocaleString(),
  };

  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  // Update user's posts array
  const allUsersLatest = JSON.parse(localStorage.getItem("allUsers")) || [];
  const userIndex = allUsersLatest.findIndex((u) => u.id === currentUserObj.id);
  if (userIndex !== -1) {
    if (!allUsersLatest[userIndex].posts) allUsersLatest[userIndex].posts = [];
    allUsersLatest[userIndex].posts.unshift(newPost.id);
    localStorage.setItem("allUsers", JSON.stringify(allUsersLatest));
  }

  showToast("Post shared! ✓");

  setTimeout(() => {
    window.location.href = "feed.html";
  }, 1000);
}

// ===================================
//    Toast Notification
// ===================================
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}