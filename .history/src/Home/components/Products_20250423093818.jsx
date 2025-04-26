import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Slider from 'react-slick';
import './Products.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [fadeOpacity, setFadeOpacity] = useState(0); // Start with 0 opacity
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 200; // Adjust when the fade effect starts
      const fadeEnd = 500;   // Adjust when the fade effect fully ends
      const opacity = Math.min(1, Math.max(0, (scrollY - fadeStart) / (fadeEnd - fadeStart)));
      setFadeOpacity(opacity);

      // Determine if the fade content is in full view
      const fadeSection = document.querySelector('.fade-section');
      if (fadeSection) {
        const rect = fadeSection.getBoundingClientRect();
        setIsVisible(rect.top <= window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="products-wrapper">
      <h2 className="products-title">Latest Products</h2>
      <Slider {...settings} className="slider">
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
      </Slider>

      <div
        className="fade-section"
        style={{
          backgroundColor: `rgba(239, 254, 138, ${1 - fadeOpacity})`, // Fade from EFFE8A
          transition: 'background-color 0.3s ease-out',
        }}
      >
        <div className="fade-content" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
          <h2>Explore More Products</h2>
          <p>Discover a wide variety of items tailored just for you.</p>
        </div>
      </div>
    </div>
  );
};

export default Products;