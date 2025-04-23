// Products.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
        .limit(6);

      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        setProducts(data);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="products-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img
            src={
              product.product_images?.[0]
                ? `${supabaseUrl}/storage/v1/object/public/product-images/${product.product_images[0].image_path}`
                : 'https://via.placeholder.com/150'
            }
            alt={product.name}
          />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Ksh {product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
