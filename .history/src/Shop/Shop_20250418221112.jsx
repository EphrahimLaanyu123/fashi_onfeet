import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Adjust the path as needed
import Navbar from '../Navbar';
import './Shop.css';

const Shop = () => {
  const [price, setPrice] = useState(100);
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
          <div className="sidebar-section">
            <h3>Price Filter</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <p>Up to Ksh {price}</p>
          </div>
        </aside>

        <section className="products-page">
          <section className="products-page-top">
            <div className="products-page-top-container">
              <p className="top-container">All Products</p>
            </div>
          </section>

          <div className="products-list">
            {products
              .filter((product) => product.price <= price)
              .map((product) => (
                <div key={product.id} className="product-card">
                  <img
                    src={
                      product.product_images?.[0]?.image_path
                        ? `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
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
