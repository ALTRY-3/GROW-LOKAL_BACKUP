"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./reset-password.css";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');
  const email = searchParams?.get('email');

  useEffect(() => {
    if (!token || !email) {
      setIsValidToken(false);
      setMessage('Invalid reset link. Please request a new password reset.');
    }
  }, [token, email]);

  // Password strength calculation
  useEffect(() => {
    const calculateStrength = (pwd: string) => {
      let strength = 0;
      const errors: string[] = [];

      if (pwd.length >= 8) strength += 25;
      else errors.push("At least 8 characters");

      if (/[a-z]/.test(pwd)) strength += 25;
      else errors.push("One lowercase letter");

      if (/[A-Z]/.test(pwd)) strength += 25;
      else errors.push("One uppercase letter");

      if (/[0-9]/.test(pwd)) strength += 25;
      else errors.push("One number");

      setPasswordStrength(strength);
      setValidationErrors(errors);
    };

    calculateStrength(password);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "#ff4757";
    if (passwordStrength <= 50) return "#ffa502";
    if (passwordStrength <= 75) return "#ff6b35";
    return "#2ed573";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidToken) {
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsSuccess(false);
      return;
    }

    if (passwordStrength < 75) {
      setMessage("Please choose a stronger password!");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          email, 
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setIsSuccess(true);
        // Redirect to login after 4 seconds
        setTimeout(() => {
          router.push('/login?reset=true');
        }, 4000);
      } else {
        setMessage(data.message || 'An error occurred. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-app-container">
      <div className="main-content">
        <div className="back-button">
          <Link href="/login">
            <i className="fas fa-arrow-left"></i>
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="reset-container">
          <div className="brand-header">
            <div className="logo-section">
              <div className="logo-icon">
                <Image
                  src="/logo.svg"
                  alt="GrowLokal Logo"
                  className="logo-image"
                  fill
                />
              </div>
              <span className="logo-text">GrowLokal</span>
            </div>
          </div>

          <div className="reset-header">
            <div className="lock-icon">
              <i className="fas fa-key"></i>
            </div>
            <h2>Reset Password</h2>
            <p>
              Create a strong password with at least 8 characters including uppercase, lowercase, and numbers.
            </p>
          </div>

          {message && (
            <div className={`message ${isSuccess ? 'success-message' : 'error-message'}`}>
              <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
              {message}
              {isSuccess && (
                <div className="redirect-timer">
                  Redirecting to login in a few seconds...
                </div>
              )}
            </div>
          )}

          {!isValidToken ? (
            <div className="invalid-token">
              <div className="invalid-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <p>This reset link is invalid or has expired.</p>
              <Link href="/forgot-password" className="retry-link">
                <i className="fas fa-redo"></i>
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <form className="reset-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} input-icon password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>

              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${passwordStrength}%`, 
                        backgroundColor: getStrengthColor() 
                      }}
                    ></div>
                  </div>
                  <div className="strength-info">
                    <span className="strength-text" style={{ color: getStrengthColor() }}>
                      {getStrengthText()}
                    </span>
                    {validationErrors.length > 0 && (
                      <div className="requirements">
                        <span>Missing:</span>
                        <ul>
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-input ${confirmPassword && password !== confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <i
                  className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} input-icon password-toggle`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></i>
                {confirmPassword && password !== confirmPassword && (
                  <div className="field-error">
                    <i className="fas fa-exclamation-circle"></i>
                    Passwords don't match
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className={`reset-button ${isSuccess ? 'success' : ''}`}
                disabled={isLoading || isSuccess || passwordStrength < 75 || password !== confirmPassword}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Updating Password...
                  </>
                ) : isSuccess ? (
                  <>
                    <i className="fas fa-check"></i>
                    Password Updated Successfully!
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Update Password
                  </>
                )}
              </button>
            </form>
          )}

          <div className="login-redirect">
            <p>
              Remember your password?{' '}
              <Link href="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="security-footer">
            <div className="security-features">
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <span>Bank-level Security</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-lock"></i>
                <span>Encrypted Storage</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-user-shield"></i>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
