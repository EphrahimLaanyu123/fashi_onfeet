import React, { useState } from 'react'
import "./Shop.css"
import Navbar from '../Navbar'

const Shop = () => {
  const [price, setPrice] = useState(100)

  return (
    <div className='shop_page'>
      <Navbar />
      <div className="shop-container">
        <aside className='sidebar'>
          <p>Home &gt; All Products</p>

          <section className="Browse_by">
            <h1 className="Browse_by_h1">Browse By</h1>
            <div className="underline"></div>
            <div className="browse">
              <div>All Products</div>
              <div>Men</div>
              <div>Women</div>
              <div>Kids</div>
            </div>
          </section>

          <section className="filter_by">
            <h1 className="filter_by_h1">Filter By</h1>
            <div className="underline-1"></div>
            <div className="filters">
              <div className="filters-price">
                <label htmlFor="priceRange">Max Price: Ksh {price}</label>
                <input
                  type="range"
                  id="priceRange"
                  min="0"
                  max="10000"
                  step="10"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </section>
        </aside>

        <section className='products-page'>
          <section className="products-page-top">
            div
          </section>
        </section>
      </div>
    </div>
  )
}

export default Shop
