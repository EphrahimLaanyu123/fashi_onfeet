import React from 'react'
import "./Shop.css"
import Navbar from '../Navbar'

const Shop = () => {
  return (
    <div className='shop_page'>
      <Navbar></Navbar>
      <div className="shop-container">
        <aside className='sidebar'>
          <p>Home &gt; All Products</p>
          <section className="Browse_by">
            <h1 className="Browse_by_h1">Browse By</h1>
            <div className="underline"></div>
            <div className="filters">
              <div>All Products</div>
              <div>Men</div>
              <div>Women</div>
              <div>Kids</div>
            </div>
          </section>
          <section className="filter_by">
          <h1 className="Browse_by_h1">Browse By</h1>
          </section>
        </aside>
        <section className='products-page'>
          shop
        </section>
        </div>
    </div>
  )
}

export default Shop

