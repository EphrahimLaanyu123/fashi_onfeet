import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Cart.css';
import Navbar from '../../Navbar';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    const fetchCartItemsAndUser = async () => {
      setLoading(true);

      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      setUser(currentUser);

      if (userError || !currentUser) {
        alert("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      // Fetch cart with items
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
        .eq('cart_id', currentUser.id); // Cart ID is same as user ID

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

    fetchCartItemsAndUser();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to proceed to checkout.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Nothing to checkout.');
      return;
    }

    setCheckoutError('');

    const userDetails = {
      id: user.id,
      email: user.email,
      // You might want to fetch more user details if needed (e.g., from a user profile table)
    };

    const checkoutData = {
      cartItems: cartItems.map(item => ({
        quantity: item.quantity,
        size: item.size,
        product: {
          price: item.product.price,
          name: item.product.name, // Include name for description
        },
      })),
      userDetails: userDetails,
      callbackUrl: `${window.location.origin}/payment-status`, // Replace with your actual callback URL
      ipnUrl: 'https://yourdomain.com/ipn', // Replace with your registered IPN URL
    };

    try {
      const response = await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout failed:', errorData);
        setCheckoutError(errorData.error || 'Failed to initiate checkout.');
        return;
      }

      const data = await response.json();
      console.log('Pesapal Response:', data);

      // Redirect the user to the Pesapal payment URL
      if (data && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setCheckoutError('Failed to get payment URL from the server.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setCheckoutError('An unexpected error occurred during checkout.');
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
        {checkoutError && <p className="error-message">{checkoutError}</p>}
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;