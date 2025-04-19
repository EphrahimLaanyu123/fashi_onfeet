import React from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../supabaseClient';
import './Cart.css';

const Cart = ({ cart = [], setCart = () => {} }) => {
  // Ensure cart is always an array and items have required properties
  const safeCart = Array.isArray(cart) 
    ? cart.map(item => ({
        id: item.id || '',
        name: item.name || 'Unknown Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
        product_images: item.product_images || []
      }))
    : [];

  const removeFromCart = (productId) => {
    setCart(prevCart => 
      Array.isArray(prevCart) 
        ? prevCart.filter(item => item.id !== productId) 
        : []
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      Array.isArray(prevCart)
        ? prevCart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        : []
    );
  };

  const calculateTotal = () => {
    return safeCart.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      {safeCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {safeCart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={
                    item.product_images?.[0]?.image_path
                      ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${item.product_images[0].image_path}`
                      : 'https://via.placeholder.com/150'
                  }
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Ksh {item.price.toLocaleString()}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      disabled={(item.quantity || 1) <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Ksh {calculateTotal().toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Ksh {calculateTotal().toLocaleString()}</span>
            </div>
            <button 
              className="checkout-btn"
              disabled={safeCart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number,
      product_images: PropTypes.array
    })
  ),
  setCart: PropTypes.func
};

Cart.defaultProps = {
  cart: [],
  setCart: () => {}
};

export default Cart;