import React from 'react'
import "./Home.css"
import Navbar from '../Navbar'

const Home = () => {
  return (
    <div className="home-container">
      <Navbar/>
      <div className="images-container">
        <div className="image1"></div>
        <div className="image2"></div>
      </div>
    </div>
  )
}

export default Home;
