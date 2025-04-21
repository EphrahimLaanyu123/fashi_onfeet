import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Cart.css';
import Navbar from '../../Navbar';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [notificationId, setNotificationId] = useState(null); // To store the IPN ID

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: items, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          size,
          product:product_id (
            id,
            name,
            price,
            description,
            product_images(image_path)
          )
        `)
        .eq('cart_id', user.id);

      if (error) {
        console.error('Error fetching cart items:', error.message);
      } else {
        setCartItems(items);
        const newTotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        setTotal(newTotal);
      }

      setLoading(false);
      // Optionally fetch the notification ID here or from a configuration
      // For this example, I'll assume you have it stored or fetched elsewhere.
      // Replace 'YOUR_STORED_NOTIFICATION_ID' with your actual logic.
      setNotificationId('YOUR_STORED_NOTIFICATION_ID');
    };

    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    if (!notificationId) {
      alert("Notification ID (IPN ID) is missing. Ensure it's configured.");
      return;
    }

    const orderData = {
      merchant_id: user.id,
      currency: "KES",
      amount: total,
      description: "E-commerce Order Payment",
      callback_url: `${window.location.origin}/payment-callback`, // Use the current origin for callback
      redirect_mode: "TOP_WINDOW",
      notification_id: notificationId,
      branch: "Online Store",
      email: user.email,
      // Assuming you might have these in user.user_metadata or elsewhere
      phone: user.user_metadata?.phone || '',
      country_code: user.user_metadata?.country_code || 'KE',
      first_name: user.user_metadata?.first_name || '',
      middle_name: user.user_metadata?.middle_name || '',
      last_name: user.user_metadata?.last_name || '',
      line_1: user.user_metadata?.address_line_1 || '',
      line_2: user.user_metadata?.address_line_2 || '',
      city: user.user_metadata?.city || 'Nairobi',
      state: user.user_metadata?.state || '',
      postal_code: user.user_metadata?.postal_code || '',
      zip_code: user.user_metadata?.zip_code || ''
    };

    try {
      const response = await axios.post('http://localhost:5000/submit_order', orderData);
      console.log("Submit Order Response:", response.data); // Log the response
      if (response.data && response.data.redirect_url) {
        window.location.href = response.data.redirect_url; // Pesapal's payment page
      } else {
        console.error("Missing redirect_url in response:", response.data);
        alert("Checkout failed: Missing payment redirect URL.");
      }
    } catch (err) {
      console.error("Checkout failed:", err.response?.data || err.message);
      alert("Checkout failed: Could not initiate payment.");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <Navbar />
        <h2>Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <Navbar />
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img
              src={
                item.product?.product_images?.[0]
                  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${item.product.product_images[0].image_path}`
                  : 'https://via.placeholder.com/100'
              }
              alt={item.product?.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{item.product.name}</h3>
              <p>Size: {item.size}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: Ksh {item.product.price}</p>
              <p>Subtotal: Ksh {item.product.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: Ksh {total}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;