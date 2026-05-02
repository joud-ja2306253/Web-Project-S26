'use client';
import { useState, useEffect, useRef } from 'react';

export default function ImageCarousel({ images, onImagesChange }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const carouselTrackRef = useRef(null);
  const carouselDotsRef = useRef(null);

  useEffect(() => {
    // Reset to first slide when images change
    setCurrentSlide(0);
  }, [images]);

  // Re-render carousel when currentSlide or images change
  useEffect(() => {
    if (carouselTrackRef.current && images.length > 0) {
      carouselTrackRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      if (carouselDotsRef.current) {
        const dots = carouselDotsRef.current.children;
        for (let i = 0; i < dots.length; i++) {
          dots[i].classList.toggle('active', i === currentSlide);
        }
      }
    }
  }, [currentSlide, images]);

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
    
    if (newImages.length === 0) {
      setCurrentSlide(0);
    } else if (currentSlide >= newImages.length) {
      setCurrentSlide(newImages.length - 1);
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

  const showArrows = images.length > 1;
  const showDots = images.length > 1;
  /*this is new*/
  const canRemoveImages = typeof onImagesChange === 'function';

  return (
    <div className="carousel-wrapper" id="carouselWrapper">
      <div 
        className="carousel-track" 
        ref={carouselTrackRef}
        style={{ 
          display: 'flex',
          transition: 'transform 0.35s ease'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <div key={i} className="carousel-slide" style={{ minWidth: '100%', boxSizing: 'border-box' }}>
            <img src={src} alt={`Post image ${i + 1}`} style={{ width: '100%', objectFit: 'cover' }} />
            {canRemoveImages && (
              <button 
                className="remove-img-btn" 
                onClick={() => removeImage(i)}
                title="Remove photo"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      <span className="img-count-badge" style={{ display: showArrows ? '' : 'none' }}>
        {currentSlide + 1} / {images.length}
      </span>

      {showArrows && (
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

      {showDots && (
        <div className="carousel-dots" ref={carouselDotsRef}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
