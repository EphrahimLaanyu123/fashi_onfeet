// src/Home.jsx
import React, { useRef, useEffect } from 'react';
import './Home.css';
import image2 from './image2.jpg'; // Replace with your image path

function Home() {
  const side1Ref = useRef(null);
  const side2Ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Parallax effect for Side 1
      if (side1Ref.current) {
        side1Ref.current.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 - scrollY * 0.001})`;
      }

      // Parallax effect for Side 2
      if (side2Ref.current) {
        side2Ref.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container">
      <div className="side side-1" ref={side1Ref}>
        <img src={image1} alt="Image 1" className="image" />
      </div>
      <div className="side side-2" ref={side2Ref}>
        <img src={image2} alt="Image 2" className="image" />
      </div>
    </div>
  );
}

export default Home;