import React from 'react'
import ShopProducts from './components/ShopProducts'
import './Shop.css'

const Shop = () => {
  return (
    <div className="shop-container">
      {/* Sidebar for filters */}
      <aside className="shop-sidebar">
        <h2>Filters</h2>

        <div className="filter-section">
          <h4>Category</h4>
          <label><input type="checkbox" value="Men" /> Men</label>
          <label><input type="checkbox" value="Women" /> Women</label>
          <label><input type="checkbox" value="Children" /> Children</label>
        </div>

        <div className="filter-section">
          <h4>Shoe Type</h4>
          <label><input type="checkbox" value="Sneakers" /> Sneakers</label>
          <label><input type="checkbox" value="Boots" /> Boots</label>
        </div>

      </aside>

      {/* Products section */}
      <main className="shop-products">
        <ShopProducts />
      </main>
    </div>
  )
}

export default Shop
