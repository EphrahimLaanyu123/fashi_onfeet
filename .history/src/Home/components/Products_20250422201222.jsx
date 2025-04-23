// Products.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './Products.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, product_images(image_path)')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        setProducts(data);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="products-wrapper">
      <h2 className="products-title">Latest Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card-home">
            <img
              src={
                product.product_images?.[0]
                  ? `${supabaseUrl}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                  : 'https://via.placeholder.com/300'
              }
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Ksh {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
