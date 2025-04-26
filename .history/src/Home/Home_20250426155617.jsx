import React from "react";
import "./Home.css"; // Import the CSS file
import Navbar from "../Navbar";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar></Navbar>
      <div className="unique-container">
        <div className="image-wrapper-1">
          {/* <h1>Elevate Your Style</h1>
          <h2>FashionFeet is Your Gateway to Exclusive Kicks</h2>
          <button></button> */}
        </div>
        <div className="image-wrapper-2">
        </div>
      </div>
    </div>
  );
};

export default Home;
