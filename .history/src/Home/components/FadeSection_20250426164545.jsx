import { useEffect, useState, useRef } from 'react';
import './FadeSection.css';

const FadeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      const visibility = Math.max(0, Math.min(1, 1 - sectionTop / windowHeight));
      setScrollProgress(visibility);
      setIsVisible(visibility > 0.1);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="fade-section"
      style={{
        backgroundColor: `rgba(239, 254, 138, ${scrollProgress})`,
      }}
    >
      <div
        className={`fade-content ${isVisible ? 'visible' : ''}`}
        style={{
          opacity: scrollProgress,
          transform: `translateY(${(1 - scrollProgress) * 50}px)`,
        }}
      >
        <div className="image-background-wrapper">
          <img
            src="https://static.wixstatic.com/media/bc439c_cb372cc97203439cba9f64c8f15cf5c3~mv2.jpg"
            alt="Background"
            className="background-img"
          />
          <div className="overlay" />
          <div className="overlay-content">
            <h1></h1>
            <p>Discover a wide variety of items tailored just for you.</p>
            <button className="explore-button">View All Products</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FadeSection;
