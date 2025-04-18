import { useState } from 'react'
import './Products.css'

const products = [
  {
    id: 1,
    name: 'Elegant Stiletto Heels',
    price: 250.00,
    image: 'https://static.wixstatic.com/media/bc439c_8e3cedabe6e84428947bf70f7f42adb3~mv2.png/v1/fill/w_474,h_355,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bc439c_8e3cedabe6e84428947bf70f7f42adb3~mv2.png' // Replace with actual image URL
  },
  {
    id: 2,
    name: 'Stylish Ankle Boots',
    price: 220.00,
    image: 'https://static.wixstatic.com/media/bc439c_c42773c0e89a4aaf9fcd6770235a5ab8~mv2.png/v1/fill/w_474,h_355,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bc439c_c42773c0e89a4aaf9fcd6770235a5ab8~mv2.png' // Replace with actual image URL
  },
  {
    id: 3,
    name: 'Classic Leather Loafers',
    price: 180.00,
    image: 'https://static.wixstatic.com/media/bc439c_b145f8592f534de9bdab556432c0a7ee~mv2.png/v1/fill/w_474,h_355,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bc439c_b145f8592f534de9bdab556432c0a7ee~mv2.png' // Replace with actual image URL
  },
  {
    id: 4,
    name: 'Stylish Sunglasses',
    price: 120.00,
    image: 'https://static.wixstatic.com/media/bc439c_bd08b4c9b1004907a384587ef032a017~mv2.png/v1/fill/w_474,h_355,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bc439c_bd08b4c9b1004907a384587ef032a017~mv2.png' // Replace with actual image URL
  },
  {
    id: 5,
    name: 'Stylish Sunglasses',
    price: 120.00,
    image: 'https://static.wixstatic.com/media/bc439c_bd08b4c9b1004907a384587ef032a017~mv2.png/v1/fill/w_474,h_355,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bc439c_bd08b4c9b1004907a384587ef032a017~mv2.png' // Replace with actual image URL
  }
]

function Products() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <div className="app-container">
      <h1 className="title">Top Picks</h1>
      
      <div className="products-container">
        <button className="nav-button prev" onClick={prevSlide}>&lt;</button>
        
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">Ksh{product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <button className="nav-button next" onClick={nextSlide}>&gt;</button>
      </div>
      
      <div className="slide-dots">
        {products.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Products