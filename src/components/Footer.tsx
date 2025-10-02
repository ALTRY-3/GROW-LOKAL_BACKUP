"use client";

import { FaEnvelope, FaFacebook, FaInstagram, FaPhone } from "react-icons/fa";
import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
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

      <div className="footer-section payment">
        <h3>Payment</h3>
        <div className="payment-methods">
          <img src="/paymongo.png" alt="PayMongo" className="payment-icon" />
        </div>
      </div>

      <div className="footer-section connect">
        <h3>Connect With Us</h3>
        <div className="social-icons">
          <FaFacebook />
          <FaInstagram />
        </div>
        <div className="contact-info">
          <p>
            <FaEnvelope /> team.growlokal@gmail.com
          </p>
          <p>
            <FaPhone /> +63 912 911 7890
          </p>
        </div>
      </div>
    </footer>
  );
}
