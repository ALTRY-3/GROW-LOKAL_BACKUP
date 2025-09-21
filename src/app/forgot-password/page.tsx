"use client";

import { useState } from "react";
import Link from "next/link";
import "./forgot-password.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("If this email exists, a reset link will be sent.");
  };

  return (
    <div className="forgot-app-container">
      <div className="back-button-fixed">
        <Link href="/login">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>

      <div className="right-panel">
        <div className="forgot-container">
          <div className="forgot-header">
            <i className="fas fa-lock lock-icon"></i>
            <h2>Forgot Password</h2>
            <p>
              Enter your email and we’ll send you a code to reset your password.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-icon-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="forgot-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>

            <button type="submit" className="forgot-button">
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
