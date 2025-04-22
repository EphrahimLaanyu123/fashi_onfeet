import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './Cart.css';
import Navbar from '../../Navbar';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [ipnRegistrationData, setIpnRegistrationData] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      setUserId(user.id); // Save for checkout

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

    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = '';
      }
    };
  }, []);

  const handleProceedToCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Register IPN
      const ipnRes = await axios.post('http://127.0.0.1:5000/register_ipn_combined', {
        url: 'https://yourapp.com/ipn',
        ipn_notification_type: 'POST'
      });
      const ipnData = ipnRes.data.ipn_registration;
      setIpnRegistrationData(ipnData);

      // 2. Submit Order
      const orderRes = await axios.post('http://127.0.0.1:5000/submit_order', {
        merchant_id: 'YOUR_MERCHANT_ID', // Replace this
        amount: total,
        description: 'Cart Purchase',
        callback_url: 'https://yourapp.com/checkout/success',
        notification_id: ipnData.ipn_id,
        billing_address: {
          email: 'test@example.com',
          phone: '0700000000',
          country_code: 'KE',
          first_name: 'John',
          last_name: 'Doe',
        },
      });

      setOrderResponse(orderRes.data);

      if (orderRes.data?.redirect_url && iframeRef.current) {
        iframeRef.current.src = orderRes.data.redirect_url;
      }

    } catch (err) {
      console.error('Checkout Error:', err);
      setError(err.response ? err.response.data : { message: err.message });
    }

    setLoading(false);
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
        <button onClick={handleProceedToCheckout} className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>

      {error && (
        <div className="error-msg bg-red-200 text-red-800 p-3 rounded">
          Error: {error.message}
        </div>
      )}

      <div className="payment-iframe w-full max-w-md h-[500px] mt-6 border border-gray-300 rounded-md overflow-hidden">
        <iframe
          ref={iframeRef}
          title="Pesapal Payment"
          className="w-full h-full"
          src=""
        />
      </div>

      {orderResponse && (
        <div className="bg-yellow-100 text-yellow-700 p-3 rounded mt-4">
          Order Submitted:
          <pre>{JSON.stringify(orderResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Cart;
