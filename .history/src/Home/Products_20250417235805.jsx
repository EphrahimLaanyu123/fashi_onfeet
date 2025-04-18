import { useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Elegant Stiletto Heels',
    price: 250.00,
    image: 'https://example.com/stiletto-heels.jpg' // Replace with actual image URL
  },
  {
    id: 2,
    name: 'Stylish Ankle Boots',
    price: 220.00,
    image: 'https://example.com/ankle-boots.jpg' // Replace with actual image URL
  },
  {
    id: 3,
    name: 'Classic Leather Loafers',
    price: 180.00,
    image: 'https://example.com/leather-loafers.jpg' // Replace with actual image URL
  },
  {
    id: 4,
    name: 'Stylish Sunglasses',
    price: 120.00,
    image: 'https://example.com/sunglasses.jpg' // Replace with actual image URL
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