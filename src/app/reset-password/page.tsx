"use client";

import { useState } from "react";
import "./reset-password.css";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password has been reset!");
    // Example redirect after success:
    window.location.href = "/marketplace";
  };

  return (
    <div className="forgot-app-container">
      <div className="right-panel">
        <div className="forgot-container">
          <div className="forgot-header">
            <h2>Create New Password</h2>
            <p>Your new password must be different from your previously used password.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="reset-form-input"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} input-icon password-toggle`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="reset-form-input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} input-icon password-toggle`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>

            <button type="submit" className="forgot-button">
              SAVE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
