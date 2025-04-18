import { useEffect, useRef } from 'react';
import './Home.css';

function Home() {
  const zoomRef = useRef(null);
  const scale = Math.max(1, Math.min(1.2, 1.2 - latestScroll / 800));


  useEffect(() => {
    let latestScroll = 0;
    let ticking = false;

    const updateZoom = () => {
      const scale = Math.max(1, 1.2 - latestScroll / 800);
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
        <p>Scroll to zoom out the left image</p>
      </div>
    </div>
  );
}

export default Home;
