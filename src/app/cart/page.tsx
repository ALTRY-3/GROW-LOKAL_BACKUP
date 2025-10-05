"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./cart.css";

export default function CartPage() {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    itemCount, 
    isLoading, 
    error, 
    fetchCart, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    if (confirm('Remove this item from cart?')) {
      await removeItem(productId);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Clear entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="cart-page">
          <div className="cart-container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading cart...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            {items.length > 0 && (
              <button 
                className="clear-cart-btn" 
                onClick={handleClearCart}
                disabled={isLoading}
              >
                Clear Cart
              </button>
            )}
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h2>Your cart is empty</h2>
              <p>Add some products to get started!</p>
              <button 
                className="continue-shopping-btn"
                onClick={() => router.push('/marketplace')}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.productId} className="cart-item-card">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="cart-item-image"
                    />
                    
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-artist">by {item.artistName}</p>
                      <p className="cart-item-price">₱{item.price.toFixed(2)}</p>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={isLoading || item.quantity <= 1}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.maxStock}
                          className="qty-btn"
                          title={item.quantity >= item.maxStock ? 'Max stock reached' : ''}
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="item-total">
                        Total: ₱{(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={isLoading}
                        className="remove-btn"
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Order Summary</h2>
                
                <div className="summary-row">
                  <span>Items ({itemCount})</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>

                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  Proceed to Checkout
                </button>

                <button 
                  className="continue-shopping-btn"
                  onClick={() => router.push('/marketplace')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
