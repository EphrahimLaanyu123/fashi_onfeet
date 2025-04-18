import React, { useState, useContext } from 'react';
import './Product.css';
import { CartContext } from '../contexts/CartContext'; // Adjust path if needed

const Product = ({ product, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose(); // Close the modal after adding to cart
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
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

            <div className="quantity-controls">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
              />
            </div>

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