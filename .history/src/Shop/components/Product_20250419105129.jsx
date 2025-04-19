// Product.jsx
import React from 'react';
import './Product.css';

const Product = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose(); // optional: close modal after adding to cart
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <img
            src={
              product.product_images?.[0]
                ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                : 'https://via.placeholder.com/300'
            }
            alt={product.name}
            className="modal-image"
          />
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p className="modal-price">Ksh {product.price}</p>
            <p className="modal-description">{product.description}</p>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
