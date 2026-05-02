// app/create-post/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../AuthenticateUser";
import { useAlert } from "../hooks/useAlert";
import ImageCarousel from "../components/ImageCarousel";

export default function AddPostPage() {
  const router = useRouter();
  const { user } = useUser();
  const { showAlert } = useAlert();
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    const remaining = 10 - images.length;
    const toProcess = imageFiles.slice(0, remaining);

    if (imageFiles.length > remaining) {
      showAlert("Max 10 photos per post.", "warning");
    }

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-added
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!caption.trim() && images.length === 0) {
      showAlert("Please add a photo or write a caption.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: caption, imageUrls: images }),
      });

      if (res.ok) {
        // redirect to home page after posting
        window.location.href = "/";
      } else {
        const error = await res.json();
        showAlert(error.error || "Failed to create post", "error");
      }
    } catch (error) {
      console.error("Failed to create post", error);
      showAlert("Failed to create post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateCharCount = (text) => {
    const len = text.length;
    return `${len} / 2200`;
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
    setShowPreview(newImages.length > 0);
  };

  return (
    <main>
      <div className="add-post-container">
        <div className="add-post-header">
          <button
            className="back-btn"
            onClick={() => router.back()}
            title="Go back"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <h2>New Post</h2>
        </div>

        {/* Upload Zone */}
        {!showPreview && (
          <div
            className="upload-zone"
            id="uploadZone"
            onClick={() => document.getElementById("imageInput").click()}
          >
            <p>
              <strong>Tap to add photos</strong>
            </p>
          </div>
        )}

        <input
          type="file"
          id="imageInput"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        {/* Preview Section with Carousel */}
        {showPreview && images.length > 0 && (
          <div className="preview-section has-images">
            <ImageCarousel
              images={images}
              onImagesChange={handleImagesChange}
            />
            <button
              className="add-more-btn"
              onClick={() => document.getElementById("imageInput").click()}
            >
              <i className="fa-solid fa-plus"></i> Add more photos
            </button>
          </div>
        )}

        {/* Caption & Submit */}
        <div className="post-form-card">
          <textarea
            id="captionInput"
            placeholder="Write a caption..."
            maxLength="2200"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="char-counter" id="charCounter">
            {updateCharCount(caption)}
          </div>
          <button
            className="submit-post-btn"
            id="submitBtn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Sharing..." : "Share Post"}
          </button>
        </div>
      </div>
    </main>
  );
}
