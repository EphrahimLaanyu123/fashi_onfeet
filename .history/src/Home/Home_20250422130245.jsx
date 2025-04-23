import React from "react";
import "./Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome Home</h1>
      <div className="image-container">
        <div className="image-wrapper-1">
        </div>
        <div className="image-wrapper-2">
          {/* No need for <img> tags since we'll use background-image */}
        </div>
      </div>
    </div>
  );
};

export default Home;
