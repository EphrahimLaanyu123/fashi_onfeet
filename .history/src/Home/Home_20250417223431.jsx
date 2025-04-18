import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
        <section>
            <section className="section1">
            <img
            src="https://static.wixstatic.com/media/bc439c_81f0e108fef742289cca2a608af8d3c1~mv2.jpg"
            alt="Image 1"
            className="home-image"
        />
            </section>

        <img
            src="https://static.wixstatic.com/media/bc439c_01f9dcb9288c449084b2625be71b7a54~mv2.jpg"
            alt="Image 2"
            className="home-image"
        />
        </section>

    </div>
  );
};

export default Home;
