import React, { useEffect, useState, useRef } from 'react';
import { supabase } from "/home/user/projects/fashi/src/Shop/supabaseClient.js"
import './Products.css';

const Products = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

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
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching latest products:', error.message);
      } else {
        setLatestProducts(data);
      }
      setLoading(false);
    };

    fetchLatestProducts();
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) return <p className="loading">Loading latest products...</p>;

  return (
    <div className="products-section">
      <h2 className="products-title">Latest Products</h2>
      <div className="carousel-container">
        <button className="carousel-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="products-carousel" ref={carouselRef}>
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
        <button className="carousel-button right" onClick={scrollRight}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Products;