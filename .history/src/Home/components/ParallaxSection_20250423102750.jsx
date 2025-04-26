import { useEffect, useRef } from 'react';
import './ParallaxSection.css';

function ParallaxSection() {
  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Apply different parallax speeds to create an interesting effect
      if (leftImageRef.current && rightImageRef.current) {
        leftImageRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        rightImageRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
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
          <div 
            className="parallax-image" 
            ref={leftImageRef}
            style={{ backgroundImage: 'url("https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")' }}
          />
        </div>
        <div className="image-container right">
          <div 
            className="parallax-image" 
            ref={rightImageRef}
            style={{ backgroundImage: 'url("https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")' }}
          />
        </div>
      </div>
      
      <div className="content-section">
        <h1>Parallax Scroll</h1>
        <p>Scroll down to see the effect</p>
      </div>
      
      <div className="scroll-indicator">
        <span></span>
      </div>
      
      <div className="additional-content">
        <div className="section">
          <h2>Beautiful Design</h2>
          <p>Experience the power of parallax scrolling with this Apple-inspired design. The subtle movement creates depth and visual interest as you navigate the page.</p>
        </div>
        
        <div className="section">
          <h2>Smooth Animations</h2>
          <p>All animations and transitions are carefully crafted to provide a seamless and enjoyable user experience across all devices.</p>
        </div>
        
        <div className="section">
          <h2>Responsive Layout</h2>
          <p>The design adapts fluidly to different screen sizes while maintaining the integrity of the parallax effect.</p>
        </div>
      </div>
    </div>
  );
}

export default ParallaxSection;