"use client";

import {
  FaBell,
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
} from "react-icons/fa";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel1";
import "./marketplace.css";
import { useState, useEffect, useRef } from "react";

interface Product {
  img: string;
  hoverImg: string;
  name: string;
  artist: string;
  price: string;
}

// HANDICRAFTS
const handicrafts: Product[] = [
  { img: "/box1.png", hoverImg: "/box1.1.png", name: "Acacia Wood Deep Round Plate", artist: "THERESA", price: "₱149.00" },
  { img: "/box2.png", hoverImg: "/box2.2.png", name: "Classic Woven Fedora Hat", artist: "TROPIKO  ", price: "₱249.75" },
  { img: "/box3.png", hoverImg: "/box3.3.png", name: "Acacia Wood Salad Tosser", artist: "MANG JUAN", price: "₱349.75" },
  { img: "/box4.png", hoverImg: "/box4.4.png", name: "Acacia Wood Ladle", artist: "MARIA", price: "₱199.00" },
  { img: "/box5.png", hoverImg: "/box5.5.png", name: "Acacia Wood Plate", artist: "JOSE", price: "₱499.00" },
  { img: "/box6.png", hoverImg: "/box6.6.png", name: "Hardin Beaded Earrings", artist: "BOHO", price: "₱499.00" },
  { img: "/box7.png", hoverImg: "/box7.7.png", name: "Handwoven Buri Bag", artist: "LENG", price: "₱79.00" },
  { img: "/box8.png", hoverImg: "/box8.8.png", name: "Round Nito Placemat", artist: "TAHANAN", price: "₱399.00" },
];

// FASHION
const fashion: Product[] = [
  { img: "/fashion1.png", hoverImg: "/fashion1.1.png", name: "Blue Leaf Print Dress", artist: "PIÑA CLOTH", price: "₱199.75" },
  { img: "/fashion2.png", hoverImg: "/fashion2.2.png", name: "Tie-Dye Tube Dress", artist: "NATURAL", price: "₱699.00" },
  { img: "/fashion3.png", hoverImg: "/fashion3.3.png", name: "Crochet Dress with Beaded Straps", artist: "COTTON", price: "₱799.00" },
  { img: "/fashion4.png", hoverImg: "/fashion4.4.png", name: "Banig Belt", artist: "PATTERNED", price: "₱399.00" },
  { img: "/fashion5.png", hoverImg: "/fashion5.5.png", name: "Embroidered Shawls", artist: "NUEVO", price: "₱699.00" },
  { img: "/fashion6.png", hoverImg: "/fashion6.6.png", name: "Collared Embroidered Shirt", artist: "HANDMADE", price: "₱899.00" },
  { img: "/fashion7.png", hoverImg: "/fashion7.7.png", name: "Native Abaca Headband", artist: "MULTICOLOR", price: "₱199.00" },
  { img: "/fashion8.png", hoverImg: "/fashion8.8.png", name: "PH Embroidered Cap", artist: "NATIVE", price: "₱249.00" },
];

// HOME
const home: Product[] = [
  { img: "/home1.png", hoverImg: "/home1.1.png", name: "Floral Hand-Painted Fan", artist: "LANDSCAPE", price: "₱249.00" },
  { img: "/home2.png", hoverImg: "/home2.2.png", name: "Miniature Jeepney", artist: "WOOD", price: "₱499.00" },
  { img: "/home3.png", hoverImg: "/home3.3.png", name: "Retaso Patchwork", artist: "CUSTOM", price: "₱2,799.00" },
  { img: "/home4.png", hoverImg: "/home4.4.png", name: "Mother Pearl Pen Holder", artist: "TAHANAN", price: "₱799.00" },
  { img: "/home5.png", hoverImg: "/home5.5.png", name: "Handcrafted Christmas Parol", artist: "FILIPINO QUOTE", price: "₱1,099.00" },
  { img: "/home6.png", hoverImg: "/home6.6.png", name: "Rice Grooved Kuksa Mug", artist: "KAHOY", price: "₱449.00" },
  { img: "/home7.png", hoverImg: "/home7.7.png", name: "Pandan Picture Frame", artist: "TRIBAL", price: "₱849.00" },
  { img: "/home8.png", hoverImg: "/home8.8.png", name: "Hand-Painted Cushion Cover", artist: "GAPO", price: "₱1,499.00" },
];

// FOOD
const food: Product[] = [
  { img: "/food1.png", hoverImg: "/food1.1.png", name: "Green Banana Chips 85g", artist: "KYLA", price: "₱120.00" },
  { img: "/food2.png", hoverImg: "/food2.2.png", name: "Sabanana Sweet Original 100g", artist: "KYLA", price: "₱89.00" },
  { img: "/food3.png", hoverImg: "/food3.3.png", name: "Sweet & Spicy Dilis 60g", artist: "KYLA", price: "₱99.00" },
  { img: "/food4.png", hoverImg: "/food4.4.png", name: "Camote Chips Kimchi Flavor 60g", artist: "KYLA", price: "₱99.00" },
  { img: "/food5.png", hoverImg: "/food5.5.png", name: "KangKong Chips Cheese 60gs", artist: "ALJHUN", price: "₱149.00" },
  { img: "/food6.png", hoverImg: "/food6.6.png", name: "Pure Benguet Honey", artist: "ALJHUN", price: "₱369.00" },
  { img: "/food7.png", hoverImg: "/food7.7.png", name: "Cebu Dried Mangoes 200g", artist: "ALJHUN", price: "₱319.00" },
  { img: "/food8.png", hoverImg: "/food8.8.png", name: "Native Chocolate with Cacao", artist: "ALJHUN", price: "₱99.00" },
];

// BEAUTY
const beauty: Product[] = [
  { img: "/beauty1.png", hoverImg: "/beauty1.1.png", name: "Eucalyptus Massage Oil 230ml", artist: "ATIN", price: "699.00" },
  { img: "/beauty2.png", hoverImg: "/beauty2.2.png", name: "Nourishing Hari Oil 60ml", artist: "SIBOL", price: "379.75" },
  { img: "/beauty3.png", hoverImg: "/beauty3.3.png", name: "Organic Deodorant", artist: "JABON", price: "₱229.00" },
  { img: "/beauty4.png", hoverImg: "/beauty4.4.png", name: "Sanitizer", artist: "SHEPARD", price: "₱249.00" },
  { img: "/beauty5.png", hoverImg: "/beauty5.5.png", name: "Skin Care Soap", artist: "AYO", price: "₱259.00" },
  { img: "/beauty6.png", hoverImg: "/beauty6.6.png", name: "Liquid Conditioner", artist: "LEYLA", price: "₱429.00" },
  { img: "/beauty7.png", hoverImg: "/beauty7.7.png", name: "Botanical Sanitizer", artist: "NATURALE", price: "₱899.00" },
  { img: "/beauty8.png", hoverImg: "/beauty8.8.png", name: "Anti-Dandruff Shampoo Bar 75g", artist: "SIBOL", price: "₱229.00" },
];

export default function Marketplace() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="marketplace-page">
      {/* NAVBARS */}
      <header className="navbar">
        <div className="left-content">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo.svg" alt="GrowLokal Logo" className="logo-image" />
            </div>
            <span className="logo-text">GROWLOKAL</span>
          </div>
        </div>

        <div className="right-content">
          {/* Notification dropdown */}
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

          <FaShoppingCart className="nav-icon" />

          {/* Profile dropdown */}
          <div className="icon-wrapper" ref={profileRef}>
            <FaUserCircle
              className="nav-icon"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="dropdown dropdown-profile">
                <h3 className="dropdown-title">Profile</h3>
                <hr className="dropdown-divider" />
                <ul className="profile-menu">
                  <li>My Account</li>
                  <li>My Orders</li>
                  <li>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Keep your sub-navbar, strip, search, carousel, sections, and footer here */}
      <nav className="sub-navbar">
        <ul className="sub-nav-links">
          <li><Link href="/marketplace">Marketplace</Link></li>
          <li><Link href="/stories">Stories</Link></li>
          <li><Link href="/events">Events</Link></li>
          <li><Link href="/map">Map</Link></li>
        </ul>
      </nav>

      <div className="nav-strip">
        <img src="/left-panel.svg" alt="Decorative strip" className="nav-strip-image" />
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input className="search-input" type="text" placeholder="Search for a product or artist" />
        </div>
      </div>

      <div className="carousel-section">
        <ImageCarousel autoSlide={true} slideInterval={3000} />
        <div className="carousel-text">Discover local treasures.</div>
      </div>

      <Section title="HANDICRAFTS" products={handicrafts} />
      <Section title="FASHION" products={fashion} />
      <Section title="HOME" products={home} />
      <Section title="FOOD" products={food} />
      <Section title="BEAUTY & WELLNESS" products={beauty} />

      <footer className="footer">
        <div className="footer-section about">
          <h3>About GrowLokal</h3>
          <p>
            GrowLokal is a community marketplace connecting Olongapo’s artisans,
            indigenous communities, and entrepreneurs with the world. We celebrate
            culture, support sustainable tourism, and empower local economies
            through digital innovation.
          </p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/marketplace">Marketplace</Link></li>
            <li><Link href="/stories">Stories</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/map">Map</Link></li>
          </ul>
        </div>
        <div className="footer-section connect">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
          </div>
          <div className="contact-info">
            <p><FaEnvelope /> team.growlokal@gmail.com</p>
            <p><FaPhone /> +63 912 911 7890</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, products }: { title: string; products: Product[] }) {
  return (
    <>
      <div className="section-title">{title}</div>
      <div className="product-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <div className="image-container">
              <img src={product.img} alt={product.name} className="product-image default" />
              <img src={product.hoverImg} alt={product.name} className="product-image hover" />
              <button className="view-button">View</button>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-artist">{product.artist}</p>
              <span className="product-price">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}