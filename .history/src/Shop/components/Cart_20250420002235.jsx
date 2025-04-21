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
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("Please log in to view your cart.");
        setLoading(false);
        return;
      }
      setUser(user);

      // Fetch cart items (as before)
      const { data: items, error: cartError } = await supabase
        .from('cart_items')
        .select(...)
        .eq('cart_id', user.id);

      if (cartError) {
        console.error('Error fetching cart items:', cartError.message);
      } else {
        setCartItems(items);
        setTotal(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
      }

      // **Illustrative: Fetch notification ID from your backend**
      try {
        const ipnResponse = await axios.get('http://localhost:5000/get_pesapal_ipn_id'); // Replace with your actual endpoint
        if (ipnResponse.data && ipnResponse.data.ipn_id) {
          setNotificationId(ipnResponse.data.ipn_id);
        } else {
          console.error("Failed to fetch IPN ID:", ipnResponse.data);
          alert("Error: Could not retrieve IPN configuration.");
        }
      } catch (error) {
        console.error("Error fetching IPN ID:", error);
        alert("Error: Could not retrieve IPN configuration.");
      }

      setLoading(false);
    };

    fetchCartData();
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
      callback_url: `${window.location.origin}/payment-callback`,
      redirect_mode: "TOP_WINDOW",
      notification_id: notificationId, // Use the fetched notificationId
      branch: "Online Store",
      email: user.email,
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
      console.log("Submit Order Response:", response.data);
      if (response.data && response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        console.error("Missing redirect_url in response:", response.data);
        alert("Checkout failed: Missing payment redirect URL.");
      }
    } catch (err) {
      console.error("Checkout failed:", err.response?.data || err.message);
      alert("Checkout failed: Could not initiate payment.");
    }
  };

  // ... (rest of your Cart component)
};

export default Cart;