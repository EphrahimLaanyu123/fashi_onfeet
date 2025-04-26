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
      
      // Calculate visibility based on section position
      const visibility = Math.max(0, Math.min(1, 1 - (sectionTop / windowHeight)));
      setScrollProgress(visibility);
      setIsVisible(visibility > 0.1);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
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
        <h2>Explore More Products</img>
        <p>Discover a wide variety of items tailored just for you.</p>
        <button className="explore-button">View All Products</button>
      </div>
    </div>
  );
};

export default FadeSection;