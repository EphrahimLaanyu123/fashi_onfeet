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
    };

    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const orderData = {
      merchant_id: user.id,
      currency: "KES",
      amount: total,
      description: "E-commerce Order Payment",
      callback_url: "https://yourdomain.com/payment-callback", // Replace with your actual callback
      redirect_mode: "TOP_WINDOW",
      notification_id: "your_ipn_id_here", // Replace with actual IPN ID from /register_ipn_combined
      branch: "Online Store",
      email: user.email,
      phone: "0712345678", // Replace with user phone if you collect it
      country_code: "KE",
      first_name: "John",   // You can fetch from user metadata if stored
      middle_name: "",
      last_name: "Doe",
      line_1: "123 Main St",
      line_2: "",
      city: "Nairobi",
      state: "",
      postal_code: "",
      zip_code: ""
    };

    try {
      const response = await axios.post('http://localhost:5000/submit_order', orderData);
      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url; // Pesapal's payment page
      } else {
        console.error("Missing redirect_url in response");
      }
    } catch (err) {
      console.error("Checkout failed:", err.response?.data || err.message);
      alert("Checkout failed");
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
