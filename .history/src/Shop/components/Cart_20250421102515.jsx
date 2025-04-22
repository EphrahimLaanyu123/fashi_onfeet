import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Cart.css';
import Navbar from '../../Navbar';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('Please log in to view your cart.');
        setLoading(false);
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email);
      setUserPhone(user.user_metadata?.phone || '');

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

  const handleProceedToCheckout = async () => {
    try {
      // 1. Register IPN
      const ipnRes = await axios.post('http://127.0.0.1:5000/register_ipn', {
        email: userEmail,
        phone: userPhone,
      });

      const ipnData = ipnRes.data;

      // 2. Submit Order
      const orderRes = await axios.post('http://127.0.0.1:5000/submit_order', {
        merchant_id: 'YOUR_MERCHANT_ID', // replace with your real merchant ID
        amount: total,
        description: 'Cart Purchase',
        callback_url: 'https://yourapp.com/checkout/success',
        notification_id: ipnData.ipn_id,
        billing_address: {
          email: userEmail,
          phone: userPhone || '0700000000',
          country_code: 'KE',
          first_name: 'John',
          last_name: 'Doe',
        },
      });

      const paymentUrl = orderRes.data.payment_url;

      // 3. Redirect to payment page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Checkout Error:', error.message);
      alert('Something went wrong during checkout. Please try again.');
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
        <button className="checkout-btn" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
