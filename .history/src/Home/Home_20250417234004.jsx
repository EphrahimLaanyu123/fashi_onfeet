import React from 'react';
import './Home.css';
import { Parallax } from 'react-parallax';

const Home = () => {
  return (
    <div className="home-container">
        <section className="section">
            <section className="section1">
                <Parallax 
                    bgImage="https://static.wixstatic.com/media/bc439c_81f0e108fef742289cca2a608af8d3c1~mv2.jpg"
                    strength={500}
                    className="parallax-container"
                >
                    <div style={{ height: '1200px' }} />
                </Parallax>
            </section>
            <section className="section2">
                <Parallax 
                    bgImage="https://static.wixstatic.com/media/bc439c_01f9dcb9288c449084b2625be71b7a54~mv2.jpg"
                    strength={300}
                    className="parallax-container"
                >
                    <div style={{ height: '1200px' }} />
                </Parallax>
            </section>
        </section>
    </div>
  );
};

export default Home;