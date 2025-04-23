import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock supabase client
const mockSupabase = {
  from: () => ({
    select: () => ({
      order: () => ({
        limit: () => ({
          data: [
            {
              id: 1,
              name: 'Stylish Jacket',
              price: 2999,
              product_images: [{ image_path: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg' }]
            },
            {
              id: 2,
              name: 'Classic Watch',
              price: 1599,
              product_images: [{ image_path: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg' }]
            },
            {
              id: 3,
              name: 'Leather Bag',
              price: 3499,
              product_images: [{ image_path: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg' }]
            },
            {
              id: 4,
              name: 'Summer Dress',
              price: 1899,
              product_images: [{ image_path: 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg' }]
            },
            {
              id: 5,
              name: 'Casual Shoes',
              price: 2599,
              product_images: [{ image_path: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg' }]
            },
            {
              id: 6,
              name: 'Designer Sunglasses',
              price: 1299,
              product_images: [{ image_path: 'https://images.pexels.com/photos/343720/pexels-photo-343720.jpeg' }]
            },
            {
              id: 7,
              name: 'Denim Jeans',
              price: 1999,
              product_images: [{ image_path: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg' }]
            },
            {
              id: 8,
              name: 'Elegant Necklace',
              price: 4999,
              product_images: [{ image_path: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg' }]
            }
          ],
          error: null
        })
      })
    })
  })
};

const supabase = mockSupabase;

const ProductCarousel = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            price,
            created_at,
            product_images(image_path)
          `)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Error fetching latest products:', error.message);
        } else {
          setLatestProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, [latestProducts]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 500, color: '#4B5563' }}>
          Loading latest products...
        </div>
      </div>
    );
  }

  return (
    <div className="products-carousel-container">
      <h2 className="section-title">Latest Products</h2>
      
      <div className="relative">
        {showLeftArrow && (
          <button 
            className="carousel-control left-control"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
        )}
        
        <div className="products-carousel" ref={carouselRef}>
          {latestProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.product_images?.[0]?.image_path || 'https://via.placeholder.com/300x400'}
                  alt={product.name}
                  className="product-img"
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">Ksh {product.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            className="carousel-control right-control"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Products;