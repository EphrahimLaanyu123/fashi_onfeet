import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path if needed
import './Shop.css';
import Navbar from '../Navbar';
import Product from './components/Product';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Shop = () => {
  const [price, setPrice] = useState(10000);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          product_images(image_path)
        `);

      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        setProducts(data);
      }
    };

    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };

    fetchProducts();
    fetchUser();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const sortProducts = (productsToSort, sortOption) => {
    switch (sortOption) {
      case 'a-z':
        return [...productsToSort].sort((a, b) => a.name.localeCompare(b.name));
      case 'price-high-low':
        return [...productsToSort].sort((a, b) => b.price - a.price);
      case 'price-low-high':
        return [...productsToSort].sort((a, b) => a.price - b.price);
      default:
        return productsToSort;
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      // Redirect to login if the user is not logged in
      navigate('/login'); // Assuming you have a /login route
      return;
    }

    try {
      // 1. Check if the user has an active cart
      let { data: carts, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id) // Assuming you have a user_id column in your carts table
        .is('is_active', true) // Assuming you have an is_active column to track the current cart
        .limit(1);

      if (cartError) {
        console.error('Error fetching active cart:', cartError);
        return;
      }

      let cartId;
      if (carts && carts.length > 0) {
        // User has an active cart
        cartId = carts[0].id;
      } else {
        // User doesn't have an active cart, create one
        const { data: newCart, error: newCartError } = await supabase
          .from('carts')
          .insert([{ user_id: user.id, is_active: true }]) // Assuming you set user_id and is_active
          .select('id')
          .single();

        if (newCartError) {
          console.error('Error creating new cart:', newCartError);
          return;
        }
        cartId = newCart.id;
      }

      // 2. Add the product to the cart_items table
      const { error: addItemError } = await supabase
        .from('cart_items')
        .insert([
          {
            cart_id: cartId,
            product_id: product.id,
            quantity: 1, // You might want to allow users to select quantity later
            // You might also want to handle 'size' if your products have sizes
          },
        ]);

      if (addItemError) {
        console.error('Error adding item to cart:', addItemError);
      } else {
        alert(`${product.name} added to cart!`);
        // Optionally, update a local cart state for immediate feedback
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const filteredProducts = products.filter((p) => p.price <= price);
  const sortedAndFilteredProducts = sortProducts(filteredProducts, sortBy);

  return (
    <div className="shop_page">
      <Navbar />
      <p className="shop-header">Home &gt; All Products</p>

      <div className="shop-container">
        <aside className="sidebar">
          <section className="Browse_by">
            <h1 className="Browse_by_h1">Browse By</h1>
            <div className="underline"></div>
            <div className="browse">
              <div>All Products</div>
              <div>Men</div>
              <div>Women</div>
              <div>Kids</div>
            </div>
          </section>

          <section className="filter_by">
            <h1 className="filter_by_h1">Filter By</h1>
            <div className="underline-1"></div>
            <div className="filters">
              <div className="filters-price">
                <label htmlFor="priceRange">Max Price: Ksh {price}</label>
                <input
                  type="range"
                  id="priceRange"
                  min="500"
                  max="10000"
                  step="10"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </section>
        </aside>

        <section className="products-page">
          <section className="products-page-top">
            <div className="products-page-top-container">
              <p className="top-container">All Products</p>
            </div>
          </section>
          <div className="sort-by">
            <label htmlFor="sort">Sort By:</label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Default</option>
              <option value="a-z">A-Z</option>
              <option value="price-high-low">Price (Highest to Lowest)</option>
              <option value="price-low-high">Price (Lowest to Highest)</option>
            </select>
          </div>
          <div className="products-list">
            {sortedAndFilteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
              >
                <div
                  className="clickable"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={
                      product.product_images?.[0]
                        ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={product.name}
                    className="product-img"
                  />
                  <h3>{product.name}</h3>
                  <p>Ksh {product.price}</p>
                  <p className="product-desc">{product.description}</p>
                </div>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedProduct && (
        <Product product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Shop;