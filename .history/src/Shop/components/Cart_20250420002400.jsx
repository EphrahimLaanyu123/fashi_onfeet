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
  const [ipnRegistrationStatus, setIpnRegistrationStatus] = useState(null);

  const registerIpnUrl = async () => {
    const ipnUrlToRegister = `${window.location.origin}/ipn-listener`; // Replace with your actual IPN listener URL
    const notificationType = 'CHANGE'; // Or 'BOTH' depending on your needs

    try {
      const response = await axios.post('http://localhost:5000/register_ipn', {
        url: ipnUrlToRegister,
        ipn_notification_type: notificationType,
      });
      setIpnRegistrationStatus({ success: true, message: response.data.message, ipnId: response.data.ipn_id });
      setNotificationId(response.data.ipn_id);
      console.log("IPN Registration Successful:", response.data);
    } catch (error) {
      setIpnRegistrationStatus({ success: false, message: error.response?.data?.error || 'Failed to register IPN' });
      console.error("IPN Registration Failed:", error.response?.data || error);
    }
  };

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

      const { data: items, error: cartError } = await supabase
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

      if (cartError) {
        console.error('Error fetching cart items:', cartError.message);
      } else {
        setCartItems(items);
        setTotal(items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
      }

      // Fetch the registered IPN ID
      try {
        const ipnIdResponse = await axios.get('http://localhost:5000/get_registered_ipn_id');
        if (ipnIdResponse.data && ipnIdResponse.data.ipn_id) {
          setNotificationId(ipnIdResponse.data.ipn_id);
        } else {
          console.warn("IPN ID not yet registered or retrieved.");
          // You might want to trigger the registration here or on a setup page
          // For automatic registration on load (not ideal for production):
          // await registerIpnUrl();
        }
      } catch (error) {
        console.error("Error fetching registered IPN ID:", error);
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
      alert("Notification ID (IPN ID) is not available. Ensure it has been registered.");
      return;
    }

    const orderData = {
      merchant_id: user.id,
      currency: "KES",
      amount: total,
      description: "E-commerce Order Payment",
      callback_url: `${window.location.origin}/payment-callback`,
      redirect_mode: "TOP_WINDOW",
      notification_id: notificationId,
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

  if (loading) return <p>Loading cart...</p>;

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <Navbar />
        <h2>Your Cart is Empty</h2>
        {ipnRegistrationStatus && (
          <p>IPN Registration: {ipnRegistrationStatus.success ? 'Success' : 'Failed'} - {ipnRegistrationStatus.message} {ipnRegistrationStatus.ipnId && `(ID: ${ipnRegistrationStatus.ipnId})`}</p>
        )}
        {!notificationId && <button onClick={registerIpnUrl}>Register IPN URL</button>}
      </div>
    );
  }

  return (
    <div className="cart-container">
      <Navbar />
      <h2>Your Cart</h2>
      {ipnRegistrationStatus && (
        <p>IPN Registration: {ipnRegistrationStatus.success ? 'Success' : 'Failed'} - {ipnRegistrationStatus.message} {ipnRegistrationStatus.ipnId && `(ID: ${ipnRegistrationStatus.ipnId})`}</p>
      )}
      {!notificationId && <button onClick={registerIpnUrl}>Register IPN URL</button>}
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
        <button className="checkout-btn" onClick={handleCheckout} disabled={!notificationId}>
          Proceed to Checkout {notificationId ? '' : '(IPN Not Ready)'}
        </button>
      </div>
    </div>
  );
};

export default Cart;