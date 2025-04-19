import React from 'react';
import './Cart.css'; // Create a Cart.css file for styling

const Cart = ({ cartItems, onClose, setCartItems }) => {
  // Ensure cartItems is always treated as an array.  This is CRUCIAL.
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, parseInt(newQuantity, 10) || 1) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return safeCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-overlay">
      <div className="cart">
        <button className="close-cart-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Your Cart</h2>
        {safeCartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {safeCartItems.map((item) => (
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
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Ksh {item.price}</p>
                  </div>
                </div>
                <div className="item-quantity">
                  <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  />
                </div>
                <button className="remove-item-btn" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="cart-total">
          <strong>Total: Ksh {calculateTotal()}</strong>
        </div>
        {safeCartItems.length > 0 && (
          <button className="checkout-btn">Proceed to Checkout</button>
        )}
      </div>
    </div>
  );
};

export default Cart;
