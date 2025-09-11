"use client";

import { useState } from "react";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";
import "./login.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);
  };

  return (
    <div className="app-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="pattern-overlay">
          <img
            src="/left-panel.svg"
            alt="Traditional Pattern"
            className="left-pattern"
          />
        </div>
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

          <div className="hero-section">
            <h1 className="hero-title">
              Discover Olongapo's heart in every craft.
            </h1>
            <p className="hero-subtitle">
              Experience the stories behind every handmade creation.
            </p>
          </div>

          <ImageCarousel autoSlide={true} slideInterval={2000} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="login-container">
          <div className="login-header">
            <h2>Login</h2>
            <p>
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="signup-link">
                Signup
              </Link>
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } input-icon password-toggle`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link href="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-button">
              LOGIN
            </button>
          </form>

          <div className="divider">
            <span>OR LOGIN WITH</span>
          </div>

          <div className="social-login">
            <button className="social-button facebook">
              <img
                src="/facebook.svg"
                className="social-icon"
                alt="Facebook"
              />
            </button>
            <button className="social-button google">
              <img src="/google.svg" className="social-icon" alt="Google" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
