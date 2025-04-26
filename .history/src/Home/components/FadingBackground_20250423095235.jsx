import { useEffect, useState, useRef } from 'react';

import Content from './Content';
import './FadingBackground.css';

const FadingBackground = () => {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollPosition = window.scrollY;
      const contentTop = contentRef.current.offsetTop;
      const fadeStartPoint = contentTop - 300; // Start fading 300px before the content
      const fadeEndPoint = contentTop + 300; // End fading 300px after content starts
      
      // Calculate opacity based on scroll position
      if (scrollPosition < fadeStartPoint) {
        setScrollOpacity(1);
      } else if (scrollPosition > fadeEndPoint) {
        setScrollOpacity(0);
      } else {
        const fadeDistance = fadeEndPoint - fadeStartPoint;
        const fadeProgress = (scrollPosition - fadeStartPoint) / fadeDistance;
        setScrollOpacity(1 - fadeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fading-background-container">
      <Slider />
      <Content contentRef={contentRef} backgroundOpacity={scrollOpacity} />
    </div>
  );
};

export default FadingBackground;