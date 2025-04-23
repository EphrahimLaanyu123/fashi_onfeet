import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './Products.css'; // your custom styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);

      // Log to check structure
      console.log('Fetched products:', response.data);

      // Safely extract product list
      const fetchedProducts = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];

      setProducts(fetchedProducts);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    speed: 500,
    arrows: true,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: '30px',
        },
      },
    ],
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="products-wrapper">
      <h2 className="carousel-title">Our Products</h2>
      {products.length > 0 ? (
        <Slider {...settings}>
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={
                  product.product_images?.[0]?.image_path
                    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                    : 'https://via.placeholder.com/150'
                }
                alt={product.name}
                className="product-img"
              />
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="desc">{product.description}</p>
                <p className="price">Ksh {product.price}</p>
                <button className="buy-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

const CustomArrow = ({ direction, onClick }) => (
  <div className={`arrow-btn ${direction}`} onClick={onClick}>
    {direction === 'left' ? '‹' : '›'}
  </div>
);

export default Products;