// app/components/ImageCarousel.jsx
'use client';
import { useState, useEffect, useRef } from 'react';

export default function ImageCarousel({ images, onImagesChange }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const carouselTrackRef = useRef(null);
  const dotsRef = useRef(null);

  // Update carousel when images change
  useEffect(() => {
    setCurrentSlide(0);
  }, [images]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const changeSlide = (direction) => {
    const newIndex = currentSlide + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentSlide(newIndex);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    if (currentSlide >= newImages.length) {
      setCurrentSlide(Math.max(0, newImages.length - 1));
    }
  };

  // Touch swipe support
  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentSlide < images.length - 1) {
        changeSlide(1);
      } else if (diff < 0 && currentSlide > 0) {
        changeSlide(-1);
      }
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="carousel-wrapper" id="carouselWrapper">
      <div 
        className="carousel-track" 
        ref={carouselTrackRef}
        style={{ 
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: 'transform 0.35s ease'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <div key={i} className="carousel-slide">
            <img src={src} alt={`Post image ${i + 1}`} />
            <button 
              className="remove-img-btn" 
              onClick={() => removeImage(i)}
              title="Remove photo"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>

      <span className="img-count-badge">
        {currentSlide + 1} / {images.length}
      </span>

      {images.length > 1 && (
        <>
          <button 
            className={`carousel-arrow prev ${currentSlide === 0 ? 'hidden' : ''}`}
            onClick={() => changeSlide(-1)}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button 
            className={`carousel-arrow next ${currentSlide === images.length - 1 ? 'hidden' : ''}`}
            onClick={() => changeSlide(1)}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </>
      )}

      <div className="carousel-dots" ref={dotsRef}>
        {images.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}