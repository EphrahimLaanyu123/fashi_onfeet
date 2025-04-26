import React from "react";
import "./Home.css"; // Import the CSS file
import Navbar from "../Navbar";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar></Navbar>
      <div className="unique-container">
        <div className="image-wrapper-1">
          <div className="image-wrapper-text">
          <ul className="p1">Elevate Your Style</ul>
          <ul className="p2">FashionFeet is Your Gateway to Exclusive Kicks</ul>
          <button></button>
          </div>
        </div>
        <div className="image-wrapper-2">
        </div>
      </div>
    </div>
  );
};

export default Home;
