"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./checkout.css";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, itemCount, fetchCart } = useCartStore();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "gcash">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [orderPlaced, setOrderPlaced] = useState(false); // Track if order was placed

  // Shipping fee calculation (simple example)
  const shippingFee = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shippingFee;

  useEffect(() => {
    fetchCart();
    
    // Redirect if cart is empty (but not if we just placed an order)
    if (!orderPlaced && (!items || items.length === 0)) {
      router.push("/cart");
    }

    // Pre-fill email if logged in
    if (session?.user?.email) {
      setShippingAddress(prev => ({
        ...prev,
        email: session.user.email || "",
        fullName: session.user.name || "",
      }));
    }
  }, [fetchCart, items, router, session]);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!shippingAddress.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]{10,}$/.test(shippingAddress.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!shippingAddress.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!shippingAddress.province.trim()) {
      newErrors.province = "Province is required";
    }

    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          artistName: item.artistName,
        })),
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        total,
      };

      // Call order API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const result = await response.json();
      
      // Set flag to prevent redirect to cart when cart gets cleared
      setOrderPlaced(true);
      
      // If payment method is card, redirect to payment page
      if (paymentMethod === "card") {
        router.push(`/payment/${result.data.orderId}`);
      } else {
        // For COD/GCash, show success and redirect to orders
        alert("Order placed successfully!");
        router.push(`/orders/${result.data.orderId}`);
      }
    } catch (error: any) {
      console.error("Order error:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <div className="checkout-container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading...</p>
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
      <main className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          
          <div className="checkout-content">
            {/* Left Column: Forms */}
            <div className="checkout-forms">
              {/* Shipping Address */}
              <section className="checkout-section">
                <h2>Shipping Address</h2>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className={errors.fullName ? "error" : ""}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="juan@example.com"
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+63 912 345 6789"
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Main Street, Barangay Name"
                      className={errors.address ? "error" : ""}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Manila"
                      className={errors.city ? "error" : ""}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>Province *</label>
                    <input
                      type="text"
                      value={shippingAddress.province}
                      onChange={(e) => handleInputChange("province", e.target.value)}
                      placeholder="Metro Manila"
                      className={errors.province ? "error" : ""}
                    />
                    {errors.province && <span className="error-text">{errors.province}</span>}
                  </div>

                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      placeholder="1000"
                      className={errors.postalCode ? "error" : ""}
                    />
                    {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      disabled
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="checkout-section">
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <label className={`payment-option ${paymentMethod === "card" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                    />
                    <div className="payment-content">
                      <i className="fas fa-credit-card"></i>
                      <div>
                        <strong>Credit/Debit Card</strong>
                        <p>Pay securely with your card via PayMongo</p>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === "gcash" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="gcash"
                      checked={paymentMethod === "gcash"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                    />
                    <div className="payment-content">
                      <i className="fas fa-mobile-alt"></i>
                      <div>
                        <strong>GCash</strong>
                        <p>Pay using GCash e-wallet</p>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                    />
                    <div className="payment-content">
                      <i className="fas fa-money-bill-wave"></i>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="order-summary-sidebar">
              <section className="checkout-section">
                <h2>Order Summary</h2>
                
                <div className="order-items">
                  {items.map((item) => (
                    <div key={item.productId} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="order-item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <p className="item-price">₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping Fee</span>
                    <span>{shippingFee === 0 ? "FREE" : `₱${shippingFee.toFixed(2)}`}</span>
                  </div>
                  {subtotal < 1000 && (
                    <p className="shipping-note">
                      <i className="fas fa-info-circle"></i>
                      Free shipping on orders over ₱1,000
                    </p>
                  )}
                  <div className="total-divider"></div>
                  <div className="total-row grand-total">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i>
                      Place Order
                    </>
                  )}
                </button>

                <p className="secure-checkout">
                  <i className="fas fa-shield-alt"></i>
                  Secure checkout powered by PayMongo
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
