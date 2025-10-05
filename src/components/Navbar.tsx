"use client";

import { useState, useEffect, useRef } from "react";
import { FaBell, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import ConfirmDialog from "./ConfirmDialog";
import "./Navbar.css";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { items, subtotal, itemCount, fetchCart, removeItem, clearLocalCart } = useCartStore();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // Fetch cart on mount and when session changes
  useEffect(() => {
    if (session?.user) {
      // User is logged in, fetch their cart
      fetchCart();
    } else {
      // User is logged out, clear local cart only (don't touch database)
      clearLocalCart();
    }
  }, [session?.user, fetchCart, clearLocalCart]);

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

  const handleLogoutClick = () => {
    setShowProfile(false);
    setShowLogoutDialog(true);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Sign out using NextAuth
      await signOut({ 
        redirect: true,
        callbackUrl: '/login'
      });
      
      // Clear any local storage items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

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
          <div className="icon-wrapper" ref={notifRef}>
            <FaBell
              className="nav-icon"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {showNotifications && (
              <div className="dropdown dropdown-notifications">
                <h3 className="dropdown-title">Notifications</h3>
                <hr className="dropdown-divider" />
                <p className="dropdown-text">No new notifications</p>
              </div>
            )}
          </div>

          <div className="icon-wrapper" ref={cartRef}>
            <FaShoppingCart
              className="nav-icon"
              onClick={() => setShowCart(!showCart)}
            />
            {itemCount > 0 && (
              <span className="cart-badge">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
            {showCart && (
              <div className="dropdown dropdown-cart">
                <h3 className="dropdown-title">Shopping Cart</h3>
                <hr className="dropdown-divider" />

                {items.length === 0 ? (
                  <p className="dropdown-text">Your cart is empty</p>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {items.map((item) => (
                        <div key={item.productId} className="cart-item">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-item-image"
                          />
                          <div className="cart-item-info">
                            <p className="cart-item-name">{item.name}</p>
                            <p className="cart-item-price">
                              ₱{item.price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="cart-item-remove"
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <hr className="dropdown-divider" />
                    <div className="cart-subtotal">
                      Subtotal: ₱{subtotal.toFixed(2)}
                    </div>
                  </>
                )}

                <button 
                  className="cart-checkout-btn"
                  onClick={() => {
                    setShowCart(false);
                    router.push('/cart');
                  }}
                  disabled={items.length === 0}
                >
                  GO TO CART
                </button>
              </div>
            )}
          </div>

          <div className="icon-wrapper" ref={profileRef}>
            <FaUserCircle
              className="nav-icon"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="dropdown dropdown-profile">
                <h3 className="dropdown-title">Profile</h3>
                {session?.user?.name && (
                  <p className="dropdown-user-name">{session.user.name}</p>
                )}
                <hr className="dropdown-divider" />
                <ul className="profile-menu">
                  <li onClick={() => {
                    setShowProfile(false);
                    router.push('/profile');
                  }}>My Account</li>
                  <li>My Orders</li>
                  <li onClick={handleLogoutClick}>Logout</li>
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

      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will be redirected to the login page."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
