import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [latestScroll, setLatestScroll] = useState(0);
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setLatestScroll(window.scrollY);
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateZoom();
          setTicking(false);
        });
        setTicking(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ticking]);

  const updateZoom = () => {
    const scale = Math.max(1, 1.2 - latestScroll / 800);
    const zoomImage = document.getElementById('zoomImage');
    if (zoomImage) {
      zoomImage.style.transform = `scale(${scale})`;
    }
  };

  return (
    <div className="main">
      <div className="parallax-container">
        {/* Left zooming image */}
        <div className="parallax-half">
          <div className="zoom-wrapper" id="zoomImage"></div>
        </div>
        {/* Right static image */}
        <div className="parallax-half parallax2"></div>
      </div>


    </div>
  );
};

export default Home;