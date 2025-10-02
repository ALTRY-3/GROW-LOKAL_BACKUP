"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import "./cart.css";

interface CartItem {
  id: number;
  artist: string;
  product: string;
  price: string;
  image: string;
  quantity: number;
  selected: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      artist: "AYO",
      product: "Skin care Soap",
      price: "259",
      image: "/beauty5.png",
      quantity: 1,
      selected: false,
    },
    {
      id: 2,
      artist: "LEYLA",
      product: "Liquid Conditioner",
      price: "429",
      image: "/beauty6.png",
      quantity: 2,
      selected: false,
    },
    {
      id: 3,
      artist: "ALJHUN",
      product: "HPure Benquet Honey",
      price: "369",
      image: "/food6.png",
      quantity: 1,
      selected: false,
    },
  ]);

  const footerRef = useRef<HTMLDivElement>(null);
  const [hideCartFooter, setHideCartFooter] = useState(false);

  const incrementQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const toggleSelectItem = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAllItems = (checked: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: checked }))
    );
  };

  const deleteSelected = () => {
    setCartItems((prev) => prev.filter((item) => !item.selected));
  };

  const totalPrice = cartItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.quantity * parseInt(item.price), 0);

  const selectedCount = cartItems.filter((item) => item.selected).length;

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideCartFooter(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <div className="cart-page-wrapper">
        <div className="cart-title-bar">
          <FaShoppingCart className="cart-title-icon" />
          <span className="cart-title-text">Shopping Cart</span>
        </div>

        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-card">
              <input
                type="checkbox"
                className="cart-item-checkbox"
                checked={item.selected}
                onChange={() => toggleSelectItem(item.id)}
              />
              <img
                src={item.image}
                alt={item.product}
                className="cart-item-image"
              />
              <div className="cart-item-divider" />
              <div className="cart-item-info">
                <span className="cart-item-artist">{item.artist}</span>
                <span className="cart-item-product">{item.product}</span>
                <span className="cart-item-price">₱{item.price}</span>
                <div className="cart-item-quantity">
                  <button onClick={() => decrementQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementQty(item.id)}>+</button>
                </div>
              </div>
              <button
                className="cart-item-trash"
                onClick={() =>
                  setCartItems((prev) => prev.filter((i) => i.id !== item.id))
                }
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`cart-page-footer ${hideCartFooter ? "hide" : ""}`}>
        <div className="footer-left">
          <input
            type="checkbox"
            className="footer-checkbox"
            checked={selectedCount === cartItems.length && cartItems.length > 0}
            onChange={(e) => selectAllItems(e.target.checked)}
          />
          <span className="footer-select-text">
            Select All ({selectedCount})
          </span>
          <div className="footer-divider" />
          <button className="footer-delete-btn" onClick={deleteSelected}>
            Delete
          </button>
        </div>

        <div className="footer-right">
          <span className="footer-total-label">
            Total ({selectedCount} items):
          </span>
          <span className="footer-total-price">
            ₱{totalPrice.toLocaleString()}
          </span>
          <button className="footer-checkout-btn">Check Out</button>
        </div>
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
}
