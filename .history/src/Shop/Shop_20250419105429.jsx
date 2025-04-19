import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './Shop.css';
import Navbar from '../Navbar';
import Product from './components/Product';
import Cart from './components/Cart';

const Shop = () => {
  const [price, setPrice] = useState(10000);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);

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

    fetchProducts();
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

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
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
                className="product-card clickable"
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
            ))}
          </div>
        </section>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <Product
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart */}
      <Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} />
    </div>
  );
};

export default Shop;
