import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">fashi_<span>onfeet</span></div>

      <div className="navbar-center">
        <a href="/" className="nav-link">Home</a>
        <a href="/shop" className="nav-link">Shop</a>
      </div>

      <div className="navbar-right">
        <a href="/cart" className="cart-icon">🛒</a>
      </div>
    </nav>
  )
}

export default Navbar
