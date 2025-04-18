import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path if needed
import './Shop.css';
import Navbar from '../Navbar';

const Shop = () => {
  const [price, setPrice] = useState(10000);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          product_images(image_path)
        `);

      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="shop_page">
      <Navbar />
      <p className="shop-header">Home &gt; All Products</p>

      <div className="shop-container">
        <aside className="sidebar">
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
                  min="500"
                  max="10000"
                  step="10"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </section>
        </aside>

        <section className="products-page">
          <section className="products-page-top">
            <div className="products-page-top-container">
              <p className="top-container">All Products</p>
            </div>
          </section>

          <div className="products-list">
            {products
              .filter((p) => p.price <= price)
              .map((product) => (
                <div key={product.id} className="product-card">
                  <img
                    src={
                      product.product_images?.[0]
                        ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                        : 'https://via.placeholder.com/150'
                    }

                    alt={product.name}
                    className="product-img"
                  />
                  <h3>{product.name}</h3>
                  <p>Ksh {product.price}</p>
                  <p className="product-desc">{product.description}</p>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shop;
