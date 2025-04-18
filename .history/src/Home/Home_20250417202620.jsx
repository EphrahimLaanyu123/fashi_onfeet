import { useEffect, useRef } from 'react';
import './Home.css';

function Home() {
  const zoomRef = useRef(null);


  useEffect(() => {
    let latestScroll = 0;
    let ticking = false;

    const updateZoom = () => {
      // Adjust these values to control the zoom effect
      const initialZoom = 1.5; // Start more zoomed in
      const zoomOutFactor = 1200; // Increase this for a slower zoom out
      const minZoom = 1;       // Ensure it doesn't zoom out too much

      const scale = Math.max(minZoom, initialZoom - latestScroll / zoomOutFactor);
      if (zoomRef.current) {
        zoomRef.current.style.transform = `scale(${scale})`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      latestScroll = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateZoom);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="main">
      <div className="parallax-container">
        <div className="parallax-half">
          <div className="zoom-wrapper" ref={zoomRef}></div>
        </div>
        <div className="parallax-half parallax2"></div>
      </div>
      <div className="content">
        <p>Scroll to see a very good zoom out effect on the left image</p>
      </div>
    </div>
  );
}

export default Home;