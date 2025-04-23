import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './Products.css'; // Optional: create for custom styles

const Products = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          created_at,
          product_images(image_path)
        `)
        .order('created_at', { ascending: false }) // Get latest first
        .limit(8); // Fetch latest 8 products

      if (error) {
        console.error('Error fetching latest products:', error.message);
      } else {
        setLatestProducts(data);
      }
      setLoading(false);
    };

    fetchLatestProducts();
  }, []);

  if (loading) return <p className="loading">Loading latest products...</p>;

  return (
    <div className="products-section">
      <h2 className="products-title">Latest Products</h2>
      <div className="products-grid">
        {latestProducts.map(product => (
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
            <p className="product-price">Ksh {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
