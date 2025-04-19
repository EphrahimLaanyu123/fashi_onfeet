import React, { useState, useEffect } from 'react';
import './Cart.css'; // Create Cart.css for styling

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from local storage on component mount
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever the cart updates
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      const updatedCart = cartItems.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      const updatedCart = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: parseInt(newQuantity, 10) } : item
      );
      setCartItems(updatedCart);
    } else {
      removeFromCart(productId);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <p>Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id} className="cart-item">
            <div className="item-info">
              <img
                src={
                  item.product_images?.[0]
                    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${item.product_images[0].image_path}`
                    : 'https://via.placeholder.com/50'
                }
                alt={item.name}
                className="cart-item-image"
              />
              <p className="item-name">{item.name}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => updateQuantity(item.id, e.target.value)}
                className="quantity-input"
              />
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p className="item-price">Ksh {item.price * item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)} className="remove-button">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <strong>Total: Ksh {getTotalPrice()}</strong>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;