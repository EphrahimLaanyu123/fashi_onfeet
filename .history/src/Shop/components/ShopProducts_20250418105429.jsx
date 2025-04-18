import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Assuming you have this set up

const ShopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            price,
            stock,
            categories ( name ),
            shoe_types ( name ),
            product_images ( image_path, is_main )
          `);

        if (error) {
          setError(error);
        } else {
          // Process the data to get the main image URL
          const productsWithMainImage = data.map(product => ({
            ...product,
            category_name: product.categories?.name || 'Unknown Category',
            shoe_type_name: product.shoe_types?.name || 'N/A',
            main_image_url: product.product_images?.find(img => img.is_main)?.image_path
              ? supabase.storage.from('product-images').getPublicUrl(product.product_images.find(img => img.is_main).image_path).data.publicUrl
              : null,
          }));
          setProducts(productsWithMainImage);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error loading products: {error.message}</p>;
  }

  return (
    <div>
      <h2>Shop Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            {product.main_image_url && (
              <img
                src={product.main_image_url}
                alt={product.name}
                className="product-image"
              />
            )}
            <p className="product-price">Price: ${product.price}</p>
            <p>Category: {product.category_name}</p>
            <p>Shoe Type: {product.shoe_type_name}</p>
            <p>Stock: {product.stock}</p>
            {/* You can add more details or actions here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopProducts;