import React from "react";
import "./Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome Home</h1>
      <div className="image-container">
        <div className="image-wrapper-1">
          <img
            src="https://static.wixstatic.com/media/bc439c_81f0e108fef742289cca2a608af8d3c1~mv2.jpg"
            alt="Home 1"
            className="home-image-1"
          />
        </div>
        <div className="image-wrapper-2">
          <img
            src="https://static.wixstatic.com/media/bc439c_01f9dcb9288c449084b2625be71b7a54~mv2.jpg"
            alt="Home 2"
            className="home-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
