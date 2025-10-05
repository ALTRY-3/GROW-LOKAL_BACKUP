"use client";

import { useState, useEffect } from "react";
import ImageCarousel from "@/components/ImageCarousel1";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import "./marketplace.css";

// API Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  thumbnailUrl: string;
  artistName: string;
  artistId: string;
  averageRating: number;
  totalReviews: number;
  isAvailable: boolean;
  isFeatured: boolean;
}

// Legacy interface for ProductModal compatibility
interface LegacyProduct {
  img: string;
  hoverImg: string;
  name: string;
  artist: string;
  price: string;
  productId?: string;
  maxStock?: number;
}

export default function Marketplace() {
  const [selectedProduct, setSelectedProduct] = useState<LegacyProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Product state by category
  const [handicrafts, setHandicrafts] = useState<Product[]>([]);
  const [fashion, setFashion] = useState<Product[]>([]);
  const [home, setHome] = useState<Product[]>([]);
  const [food, setFood] = useState<Product[]>([]);
  const [beauty, setBeauty] = useState<Product[]>([]);

  // Fetch products on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products for all categories
      const categories = ['handicrafts', 'fashion', 'home', 'food', 'beauty'];
      const promises = categories.map(category =>
        fetch(`/api/products?category=${category}&limit=8`)
          .then(res => res.json())
      );

      const results = await Promise.all(promises);

      // Check for errors
      results.forEach((result, index) => {
        if (!result.success) {
          throw new Error(`Failed to fetch ${categories[index]} products`);
        }
      });

      // Set products by category
      setHandicrafts(results[0].data || []);
      setFashion(results[1].data || []);
      setHome(results[2].data || []);
      setFood(results[3].data || []);
      setBeauty(results[4].data || []);

    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=50`);
      const data = await response.json();

      if (data.success) {
        // Group results by category
        const grouped = data.data.reduce((acc: any, product: Product) => {
          if (!acc[product.category]) acc[product.category] = [];
          acc[product.category].push(product);
          return acc;
        }, {});

        setHandicrafts(grouped.handicrafts || []);
        setFashion(grouped.fashion || []);
        setHome(grouped.home || []);
        setFood(grouped.food || []);
        setBeauty(grouped.beauty || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert API product to legacy format for ProductModal
  const convertToLegacyProduct = (product: Product): LegacyProduct => ({
    img: product.images[0] || product.thumbnailUrl,
    hoverImg: product.images[1] || product.images[0] || product.thumbnailUrl,
    name: product.name,
    artist: product.artistName,
    price: `₱${product.price.toFixed(2)}`,
    productId: product._id,
    maxStock: product.stock,
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(convertToLegacyProduct(product));
  };

  // Loading skeleton
  if (loading && handicrafts.length === 0) {
    return (
      <div className="marketplace-page">
        <Navbar />
        <div className="search-bar-container">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              className="search-input"
              type="text"
              placeholder="Search for a product or artist"
              disabled
            />
          </div>
        </div>
        <div className="carousel-section">
          <ImageCarousel autoSlide={true} slideInterval={3000} />
          <div className="carousel-text">Discover local treasures.</div>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#AF7928' }}></i>
            <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="marketplace-page">
        <Navbar />
        <div className="search-bar-container">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              className="search-input"
              type="text"
              placeholder="Search for a product or artist"
            />
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ color: '#e74c3c', fontSize: '1.2rem' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p>{error}</p>
            <button 
              onClick={fetchAllProducts}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 2rem',
                backgroundColor: '#AF7928',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="marketplace-page">
      <Navbar />

      <div className="search-bar-container">
        <form onSubmit={handleSearch} className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input
            className="search-input"
            type="text"
            placeholder="Search for a product or artist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchAllProducts();
              }}
              style={{
                position: 'absolute',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#999'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </form>
      </div>

      <div className="carousel-section">
        <ImageCarousel autoSlide={true} slideInterval={3000} />
        <div className="carousel-text">Discover local treasures.</div>
      </div>

      {handicrafts.length > 0 && (
        <Section
          title="HANDICRAFTS"
          products={handicrafts}
          onProductClick={handleProductClick}
          loading={loading}
        />
      )}
      
      {fashion.length > 0 && (
        <Section
          title="FASHION"
          products={fashion}
          onProductClick={handleProductClick}
          loading={loading}
        />
      )}
      
      {home.length > 0 && (
        <Section
          title="HOME"
          products={home}
          onProductClick={handleProductClick}
          loading={loading}
        />
      )}
      
      {food.length > 0 && (
        <Section
          title="FOOD"
          products={food}
          onProductClick={handleProductClick}
          loading={loading}
        />
      )}
      
      {beauty.length > 0 && (
        <Section
          title="BEAUTY & WELLNESS"
          products={beauty}
          onProductClick={handleProductClick}
          loading={loading}
        />
      )}

      {/* No results message */}
      {!loading && handicrafts.length === 0 && fashion.length === 0 && 
       home.length === 0 && food.length === 0 && beauty.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <i className="fas fa-search" style={{ fontSize: '3rem', color: '#999', marginBottom: '1rem' }}></i>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
          </p>
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                fetchAllProducts();
              }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 2rem',
                backgroundColor: '#AF7928',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function Section({
  title,
  products,
  onProductClick,
  loading,
}: {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  loading?: boolean;
}) {
  return (
    <>
      <div className="section-title">{title}</div>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="image-container">
              <img
                src={product.images[0] || product.thumbnailUrl}
                alt={product.name}
                className="product-image default"
              />
              <img
                src={product.images[1] || product.images[0] || product.thumbnailUrl}
                alt={product.name}
                className="product-image hover"
              />
              
              {/* Out of stock overlay */}
              {!product.isAvailable || product.stock === 0 ? (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}>
                  OUT OF STOCK
                </div>
              ) : (
                <button
                  className="view-button"
                  onClick={() => onProductClick(product)}
                >
                  View
                </button>
              )}
              
              {/* Featured badge */}
              {product.isFeatured && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#AF7928',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  FEATURED
                </div>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-artist">{product.artistName}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="product-price">₱{product.price.toFixed(2)}</span>
                {product.averageRating > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: '#f39c12' }}>
                    <i className="fas fa-star"></i>
                    <span style={{ marginLeft: '4px' }}>
                      {product.averageRating.toFixed(1)} ({product.totalReviews})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
