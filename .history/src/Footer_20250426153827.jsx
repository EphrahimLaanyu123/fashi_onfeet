import React from 'react'
import "./Footer.css"

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-container"> {/* New wrapper */}
        <section className="footer-left">
          <ul className="links">
            <li>Privacy Policy</li>
            <li>Accessibility Statement</li>
            <li>Shipping Policy</li>
            <li>Terms & Conditions</li>
            <li>Refund Policy</li>
          </ul>
        </section>

        <section className="footer-right">
          <p>Stay connected with us</p>
          <p>0712345678</p>
          <p>fashionfeet.com</p>
          <p>Nairobi, Kenya</p>
          <ul className="socials">
            {/* Social icons can go here */}
          </ul>
        </section>
      </div>  
      <section className="footer-toom">
        <p>Fashionfeet</p>
      </section>
    </div>
  )
}

export default Footer
