const Product = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;
  
    return (
      <div className="product-modal">
        <div className="modal-content">
          <button onClick={onClose} className="close-button">×</button>
          <img
            src={
              product.product_images?.[0]
                ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                : 'https://via.placeholder.com/150'
            }
            alt={product.name}
          />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Ksh {product.price}</p>
          <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    );
  };
  
  export default Product;
  