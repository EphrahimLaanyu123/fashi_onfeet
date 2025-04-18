// src/Home.jsx
import React, { useRef, useEffect } from 'react';
import './Home.css';

function Home() {
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Parallax effect for Image 1
      if (image1Ref.current) {
        image1Ref.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }

      // Parallax effect for Image 2
      if (image2Ref.current) {
        image2Ref.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container">
      <div className="side side-1">
        <img src="https://static.wixstatic.com/media/bc439c_81f0e108fef742289cca2a608af8d3c1~mv2.jpg" alt="Image 1" className="image" ref={image1Ref} />
      </div>
      <div className="side side-2">
        <img src="https://static.wixstatic.com/media/bc439c_01f9dcb9288c449084b2625be71b7a54~mv2.jpg" alt="Image 2" className="image" ref={image2Ref} />
      </div>
    </div>
  );
}

export default Home;