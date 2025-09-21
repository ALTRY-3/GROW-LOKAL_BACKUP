"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";
import "./login.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const reset = searchParams?.get('reset');
    const verified = searchParams?.get('verified');
    
    if (reset === 'true') {
      setSuccessMessage('Password reset successful! You can now log in with your new password.');
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } else if (verified === 'true') {
      setSuccessMessage('Email verified successfully! You can now log in.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Save token to localStorage (you might want to use a more secure method)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to marketplace
      window.location.href = '/marketplace';

    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
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
            {successMessage && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

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

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  LOGGING IN...
                </>
              ) : (
                "LOGIN"
              )}
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
