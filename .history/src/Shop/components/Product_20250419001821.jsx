import React from 'react';
import './Product.css'; // Create Product.css for styling

const Product = ({ product, onClose }) => {
  if (!product) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <img
            src={
              product.product_images?.[0]
                ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                : 'https://via.placeholder.com/300'
            }
            alt={product.name}
            className="modal-image"
          />
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p className="modal-price">Ksh {product.price}</p>
            <p className="modal-description">{product.description}</p>
            {/* You can add more details here, like size options, etc. */}
            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;