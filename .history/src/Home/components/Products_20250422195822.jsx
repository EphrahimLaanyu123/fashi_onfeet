import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './Products.css'; // For custom styles

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
        settings: {
          slidesToShow: 2,
        },
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

  return (
    <div className="products-wrapper">
      <h2 className="carousel-title">Our Products</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={
                product.product_images?.[0]
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
    </div>
  );
};

const CustomArrow = ({ direction, onClick }) => (
  <div
    className={`arrow-btn ${direction}`}
    onClick={onClick}
  >
    {direction === 'left' ? '‹' : '›'}
  </div>
);

export default Products;
