"use client";

import { useState, useEffect, useRef } from "react";
import { FaBell, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const { cartCount, cartItems } = useCart();
  const [popCart, setPopCart] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="marketplace-page">
      <header className="navbar">
        <div className="left-content">
          <div className="logo-section">
            <div className="logo-icon">
              <img
                src="/logo.svg"
                alt="GrowLokal Logo"
                className="logo-image"
              />
            </div>
            <span className="logo-text">GROWLOKAL</span>
          </div>
        </div>

        <div className="right-content">
          {/* Notifications */}
          <div className="icon-wrapper" ref={notifRef}>
            <FaBell
              className="nav-icon"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {showNotifications && (
              <div className="navbar-dropdown navbar-dropdown-notifications">
                <h3 className="navbar-dropdown-title">Notifications</h3>
                <hr className="navbar-dropdown-divider" />

                <div className="notification-card">
                  <p className="notif-text">🎉 Your order has been shipped!</p>
                  <span className="notif-time">2h ago</span>
                </div>

                <div className="notification-card">
                  <p className="notif-text">
                    🛒 Item added to your cart successfully.
                  </p>
                  <span className="notif-time">1d ago</span>
                </div>

                <div className="notification-card empty">
                  <p>No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="icon-wrapper" ref={cartRef}>
            <FaShoppingCart
              className="nav-icon"
              aria-label="Shopping Cart"
              onClick={() => setShowCart(!showCart)}
            />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}

            {showCart && (
              <div className="navbar-dropdown navbar-dropdown-cart">
                <h3 className="navbar-dropdown-title">Shopping Cart</h3>
                <hr className="navbar-dropdown-divider" />

                {cartItems && cartItems.length > 0 ? (
                  <>
                    {cartItems.slice(0, 5).map((item, index) => (
                      <div className="cart-item" key={index}>
                        <img
                          src={item.img}
                          alt={item.name}
                          className="cart-item-image"
                        />
                        <div className="cart-item-info">
                          <p className="cart-item-name">{item.name}</p>
                          <div className="cart-item-meta">
                            <p className="cart-item-price">₱{item.price}</p>
                            <p className="cart-item-quantity">
                              x {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {cartItems.length > 5 && (
                      <p className="cart-more">
                        {cartItems
                          .slice(5)
                          .reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}{" "}
                        more product
                        {cartItems
                          .slice(5)
                          .reduce((total, item) => total + item.quantity, 0) > 1
                          ? "s"
                          : ""}{" "}
                        in cart
                      </p>
                    )}
                  </>
                ) : (
                  <p className="empty-cart">Your cart is empty</p>
                )}

                <Link href="/cart">
                  <button className="cart-checkout-btn">GO TO CART</button>
                </Link>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="icon-wrapper" ref={profileRef}>
            <FaUserCircle
              className="nav-icon"
              aria-label="Profile"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="navbar-dropdown navbar-dropdown-profile">
                <h3 className="navbar-dropdown-title">Profile</h3>
                <hr className="navbar-dropdown-divider" />
                <ul className="profile-menu">
                  <li>
                    <Link href="/profile?section=profile">My Account</Link>
                  </li>
                  <li>
                    <Link href="/profile?section=orders">My Orders</Link>
                  </li>
                  <li>
                    <Link href="/login">Logout</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="sub-navbar">
        <ul className="sub-nav-links">
          <li>
            <Link href="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link href="/stories">Stories</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/map">Map</Link>
          </li>
        </ul>
      </nav>

      <div className="nav-strip">
        <img
          src="/left-panel.svg"
          alt="Decorative strip"
          className="nav-strip-image"
        />
      </div>
    </div>
  );
}
