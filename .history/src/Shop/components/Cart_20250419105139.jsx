// Cart.jsx
import React from 'react';
import './Cart.css';

const Cart = ({ cartItems, onRemoveFromCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={`${item.id}-${index}`}>
              <div>
                <strong>{item.name}</strong> - Ksh {item.price}
              </div>
              <button onClick={() => onRemoveFromCart(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && <p>Total: Ksh {total}</p>}
    </div>
  );
};

export default Cart;
