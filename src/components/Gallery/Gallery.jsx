import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Base URL for assets
const BASE_URL = import.meta.env.BASE_URL || '/';
const getAssetUrl = (path) => `${BASE_URL}${path}`.replace('//', '/');

// Style constants
const colors = {
  midnight: '#0a1628',
  frost: '#e8f4fc',
  frostDark: '#b8d4e8',
  auroraBlue: '#4facfe',
  auroraCyan: '#00f2fe',
  auroraGreen: '#43e97b',
};

// Image list from public/carousel folder
const images = [
  { src: 'carousel/permira-img-for-website (1).jpeg', alt: 'PERMIRA Event 1' },
  { src: 'carousel/permira-img-for-website (2).jpeg', alt: 'PERMIRA Event 2' },
  { src: 'carousel/permira-img-for-website (3).jpeg', alt: 'PERMIRA Event 3' },
  { src: 'carousel/permira-img-for-website (4).jpeg', alt: 'PERMIRA Event 4' },
  { src: 'carousel/permira-img-for-website (5).jpeg', alt: 'PERMIRA Event 5' },
  { src: 'carousel/permira-img-for-website (6).jpeg', alt: 'PERMIRA Event 6' },
  { src: 'carousel/permira-img-for-website (7).jpeg', alt: 'PERMIRA Event 7' },
  { src: 'carousel/permira-img-for-website (8).jpeg', alt: 'PERMIRA Event 8' },
  { src: 'carousel/permira-img-for-website (9).jpeg', alt: 'PERMIRA Event 9' },
  { src: 'carousel/permira-img-for-website (10).jpeg', alt: 'PERMIRA Event 10' },
  { src: 'carousel/permira-img-for-website (11).jpeg', alt: 'PERMIRA Event 11' },
  { src: 'carousel/permira-img-for-website (12).jpeg', alt: 'PERMIRA Event 12' },
];

function Gallery() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const galleryRef = useRef(null);
  const slideRef = useRef(null);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // GSAP animation on slide change
  useEffect(() => {
    if (slideRef.current) {
      gsap.fromTo(slideRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentIndex]);

  // GSAP scroll animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(galleryRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
    setIsAutoPlaying(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
    setIsAutoPlaying(true);
  };

  return (
    <>
      <section ref={galleryRef} className="py-12">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 
            className="font-adventure text-3xl md:text-4xl tracking-wider mb-2"
            style={{ color: colors.frost }}
          >
            <span className="mr-3">📸</span>
            {t('galleryTitle', 'Our Memories')}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraBlue}, ${colors.auroraCyan})` }}></div>
            <span className="text-xl">🏰</span>
            <div className="h-1 w-12 rounded" style={{ background: `linear-gradient(90deg, ${colors.auroraCyan}, ${colors.auroraGreen})` }}></div>
          </div>
        </div>

        {/* Main Carousel */}
        <div className="relative glass rounded-2xl overflow-hidden">
          {/* Main Image - Fixed aspect ratio container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */, backgroundColor: '#0a1628' }}>
          <div 
            ref={slideRef}
            className="absolute inset-0 cursor-pointer flex items-center justify-center"
            onClick={() => openModal(images[currentIndex])}
            style={{ backgroundColor: '#0a1628' }}
          >
            <img
              src={getAssetUrl(images[currentIndex].src)}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(10, 22, 40, 0.6) 0%, transparent 30%)'
              }}
            />
            {/* Click to expand hint */}
            <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-full text-sm text-frost-dark flex items-center gap-2">
              <span>🔍</span>
              {t('clickToExpand', 'Click to expand')}
            </div>
          </div>
        </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            style={{ color: colors.frost }}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            style={{ color: colors.frost }}
            aria-label="Next image"
          >
            →
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full text-sm" style={{ color: colors.frost }}>
            {currentIndex + 1} / {images.length}
          </div>

          {/* Auto-play indicator */}
          <div 
            className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-sm flex items-center gap-2 cursor-pointer"
            style={{ color: colors.frost }}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
            {isAutoPlaying ? 'Auto' : 'Paused'}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-4 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max px-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? 'ring-2 ring-offset-2 scale-105' 
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  ringColor: colors.auroraBlue,
                  ringOffsetColor: colors.midnight
                }}
              >
                <img
                  src={getAssetUrl(image.src)}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      boxShadow: `inset 0 0 0 2px ${colors.auroraBlue}`
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8' : ''
              }`}
              style={{
                backgroundColor: index === currentIndex ? colors.auroraBlue : 'rgba(255,255,255,0.3)'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Fullscreen Modal - Fixed version with better closing */}
      {isModalOpen && modalImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(10, 22, 40, 0.98)' }}
        >
          {/* Clickable backdrop for closing - covers entire screen */}
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={closeModal}
            aria-label="Close modal"
          />
          
          {/* Close button - more prominent */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-[110] w-14 h-14 rounded-full flex items-center justify-center text-3xl hover:scale-110 transition-all duration-200"
            style={{ 
              color: colors.frost,
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Click anywhere hint */}
          <div 
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 rounded-full text-sm"
            style={{ 
              color: colors.frostDark,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            Click anywhere to close
          </div>

          {/* Modal Navigation - higher z-index */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newIndex = (currentIndex - 1 + images.length) % images.length;
              setCurrentIndex(newIndex);
              setModalImage(images[newIndex]);
            }}
            className="absolute left-4 z-[110] w-14 h-14 rounded-full glass flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            style={{ color: colors.frost }}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newIndex = (currentIndex + 1) % images.length;
              setCurrentIndex(newIndex);
              setModalImage(images[newIndex]);
            }}
            className="absolute right-4 z-[110] w-14 h-14 rounded-full glass flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            style={{ color: colors.frost }}
            aria-label="Next image"
          >
            →
          </button>

          {/* Modal Image Container - Fixed size with consistent aspect ratio */}
          <div 
            className="relative z-[105] w-[90vw] h-[75vh] max-w-5xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getAssetUrl(modalImage.src)}
              alt={modalImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ 
                maxHeight: '75vh',
                maxWidth: '90vw'
              }}
            />
          </div>

          {/* Image counter in modal */}
          <div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] glass px-6 py-3 rounded-full text-lg"
            style={{ color: colors.frost }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;
