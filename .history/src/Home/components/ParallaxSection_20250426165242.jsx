import { useEffect, useRef } from 'react';
import './ParallaxSection.css';

function ParallaxSection() {
  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sectionOffset = leftImageRef.current?.getBoundingClientRect().top + window.scrollY || 0;
      
      // Only apply parallax effect when the section is in view
      if (leftImageRef.current && rightImageRef.current) {
        const relativeScroll = Math.max(0, scrollPosition - sectionOffset);
        leftImageRef.current.style.transform = `translateY(${relativeScroll * 0.2}px)`;
        rightImageRef.current.style.transform = `translateY(${relativeScroll * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="parallax-container">
      <div className="parallax-section">
      <div className="image-container left">
  <div className="parallax-wrapper">
    <div 
      className="parallax-image" 
      ref={leftImageRef}
      style={{ backgroundImage: 'url("https://static.wixstatic.com/media/bc439c_cb372cc97203439cba9f64c8f15cf5c3~mv2.jpg")' }}
    />
    <p className="parallax-text top">In-Store Shopping</p>
  </div>
</div>

<div className="image-container right">
  <div className="parallax-wrapper">
    <div 
      className="parallax-image" 
      ref={rightImageRef}
      style={{ backgroundImage: 'url("https://static.wixstatic.com/media/bc439c_f673244f98014114a7e469d7769acfa2~mv2.jpg")' }}
    />
    <div className="parallax-text bottom">Crafted With Passion</div>
  </div>
</div>

      </div>
      

      
      <div className="scroll-indicator">
        <span></span>
      </div>
      

    </div>
  );
}

export default ParallaxSection;