import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Cart.css';
import Navbar from '../../Navbar';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [ipnRegistrationData, setIpnRegistrationData] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [orderTrackingId, setOrderTrackingId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [checkoutInitiated, setCheckoutInitiated] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      setUserId(user.id);

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

    return () => {};
  }, []);

  const handleProceedToCheckout = async () => {
    setLoading(true);
    setError(null);
    setCheckoutInitiated(true); // Indicate checkout has been initiated

    try {
      const ipnRes = await axios.post('http://127.0.0.1:5000/register_ipn_combined', {
        url: 'https://yourapp.com/ipn', // Replace with your actual IPN URL
        ipn_notification_type: 'POST'
      });
      const ipnData = ipnRes.data.ipn_registration;
      setIpnRegistrationData(ipnData);

      const orderRes = await axios.post('http://127.0.0.1:5000/submit_order', {
        merchant_id: 'YOUR_MERCHANT_ID', // Replace this
        amount: total,
        description: 'Cart Purchase',
        callback_url: `${window.location.origin}/checkout/success`, // Use the current origin
        notification_id: ipnData.ipn_id,
        billing_address: {
          email: 'test@example.com',
          phone: '0700000000',
          country_code: 'KE',
          first_name: 'John',
          last_name: 'Doe',
        },
      });

      if (orderRes.data?.redirect_url) {
        // Ideally, you would redirect the user and handle the OrderTrackingId from the callback
        // For this example, we'll try to extract it from the response if available
        if (orderRes.data?.order_tracking_id) {
          setOrderTrackingId(orderRes.data.order_tracking_id);
        } else if (orderRes.data?.payment_request_id) {
          setOrderTrackingId(orderRes.data.payment_request_id);
        } else {
          alert('Checkout initiated. You will be redirected to Pesapal.');
        }
        window.open(orderRes.data.redirect_url, '_blank');
      }

    } catch (err) {
      console.error('Checkout Error:', err);
      setError(err.response ? err.response.data : { message: err.message });
      setCheckoutInitiated(false);
    }

    setLoading(false);
  };

  const handleCheckPaymentStatus = async () => {
    setCheckingStatus(true);
    setPaymentStatus(null);
    setError(null);

    if (!orderTrackingId) {
      setError({ message: 'Order Tracking ID is not available.' });
      setCheckingStatus(false);
      return;
    }

    try {
      const statusRes = await axios.get(`http://127.0.0.1:5000/check_status?orderTrackingId=${orderTrackingId}`);
      setPaymentStatus(statusRes.data);
    } catch (err) {
      console.error('Error checking payment status:', err);
      setError(err.response ? err.response.data : { message: err.message });
    }

    setCheckingStatus(false);
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
        <button onClick={handleProceedToCheckout} className="checkout-btn" disabled={loading || checkoutInitiated}>
          {loading ? 'Processing...' : checkoutInitiated ? 'Checkout Initiated' : 'Proceed to Checkout'}
        </button>
      </div>

      {checkoutInitiated && !orderTrackingId && (
        <p className="mt-2 text-yellow-500">You will be redirected to Pesapal to complete your payment.</p>
      )}

      {checkoutInitiated && orderTrackingId && (
        <div className="mt-4">
          <h3>Check Payment Status</h3>
          <button onClick={handleCheckPaymentStatus} disabled={checkingStatus}>
            {checkingStatus ? 'Checking Status...' : 'Check Payment Status'}
          </button>
          {paymentStatus && (
            <div className="payment-status-info mt-4 p-3 bg-green-100 text-green-800 rounded">
              <p><strong>Payment Method:</strong> {paymentStatus.payment_method}</p>
              <p><strong>Amount Paid:</strong> Ksh {paymentStatus.amount}</p>
              <p><strong>Status:</strong> {paymentStatus.payment_status_description}</p>
              <p><strong>Confirmation Code:</strong> {paymentStatus.confirmation_code}</p>
              {paymentStatus.message && <p><strong>Message:</strong> {paymentStatus.message}</p>}
              {paymentStatus.error?.message && <p className="text-red-600"><strong>Error:</strong> {paymentStatus.error.message}</p>}
            </div>
          )}
          {error && checkingStatus && (
            <div className="error-msg bg-red-200 text-red-800 p-3 rounded mt-2">
              Error checking status: {error.message}
            </div>
          )}
        </div>
      )}

      {error && !checkoutInitiated && (
        <div className="error-msg bg-red-200 text-red-800 p-3 rounded">
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default Cart;