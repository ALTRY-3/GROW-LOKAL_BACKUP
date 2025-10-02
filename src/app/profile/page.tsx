"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./profile.css";
import { FaEdit, FaUser, FaShoppingCart, FaTags } from "react-icons/fa";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const querySection = searchParams?.get("section") ?? "profile";

  const [activeSection, setActiveSection] = useState<string>("profile");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "profile"
  );

  useEffect(() => {
    if (querySection) {
      setActiveSection(querySection);
      if (querySection === "profile") setExpandedSection("profile");
      else setExpandedSection(null);
    }
  }, [querySection]);

  const handleSelectSection = (section: string) => {
    setActiveSection(section);
    if (section !== "profile") setExpandedSection(null);
    else setExpandedSection("profile");
  };

  const toggleExpanded = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        {/* Sidebar */}
        <div className="profile-container">
          <div className="profile-picture">
            <img
              src="/default-profile.jpg"
              alt="Profile"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </div>
          <div className="profile-name">Venti Batumbakal</div>
          <div className="edit-profile-row">
            <FaEdit className="edit-icon" />
            Edit profile
          </div>
          <hr className="profile-divider" />

          <div className="profile-section">
            <div
              className="profile-section-row"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0,
                cursor: "pointer",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
                onClick={() => toggleExpanded("profile")}
              >
                <FaUser className="profile-section-icon" />
                <span className="profile-section-title">My Profile</span>
              </div>

              {expandedSection === "profile" && (
                <span
                  className={`profile-section-label${
                    activeSection === "profile" ? " active" : ""
                  }`}
                  onClick={() => handleSelectSection("profile")}
                  tabIndex={0}
                  style={{
                    marginLeft: "37px",
                    marginTop: "16px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  Profile
                </span>
              )}
            </div>
          </div>

          {/* My Orders */}
          <div className="profile-section">
            <div
              className={`profile-section-row${
                activeSection === "orders" ? " active" : ""
              }`}
              onClick={() => handleSelectSection("orders")}
              tabIndex={0}
            >
              <FaShoppingCart className="profile-section-icon" />
              <span className="profile-section-title">My Orders</span>
            </div>
          </div>

          {/* Start Selling */}
          <div className="profile-section">
            <div
              className={`profile-section-row${
                activeSection === "selling" ? " active" : ""
              }`}
              onClick={() => handleSelectSection("selling")}
              tabIndex={0}
            >
              <FaTags className="profile-section-icon" />
              <span className="profile-section-title">Start Selling</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="profile-details-box">
          {activeSection === "profile" && (
            <>
              <div className="profile-details-title">
                <FaUser
                  className="profile-section-icon"
                  style={{
                    color: "#FFC46B",
                    fontSize: "2rem",
                    marginRight: "16px",
                    verticalAlign: "middle",
                  }}
                />
                My Profile
                <hr className="profile-details-divider" />
              </div>

              <div className="profile-details-inner-box">
                {/* Profile Upload Section */}
                <div className="profile-upload-section">
                  <img
                    src="/default-profile.jpg"
                    alt="User"
                    className="profile-upload-image"
                    id="profilePreview"
                  />
                  <input
                    type="file"
                    id="profileUpload"
                    accept="image/*"
                    className="profile-upload-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const img = document.getElementById(
                            "profilePreview"
                          ) as HTMLImageElement;
                          if (img && event.target?.result) {
                            img.src = event.target.result as string;
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="profileUpload" className="profile-upload-btn">
                    Select Image
                  </label>
                  <p className="profile-upload-hint">
                    File size: maximum 1 MB <br />
                    File extension: .JPEG, .PNG
                  </p>
                </div>

                <hr className="profile-inner-divider" />

                {/* Profile Form */}
                <form className="profile-form">
                  {/* Full Name */}
                  <div className="form-row">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-row">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter email"
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-row">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Date & Gender */}
                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <div className="gender-options">
                        <label className="gender-option">
                          <input type="radio" name="gender" value="male" />
                          <span className="custom-radio" />
                          Male
                        </label>
                        <label className="gender-option">
                          <input type="radio" name="gender" value="female" />
                          <span className="custom-radio" />
                          Female
                        </label>
                        <label className="gender-option">
                          <input type="radio" name="gender" value="other" />
                          <span className="custom-radio" />
                          Other
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="form-row">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Province</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter province"
                      />
                    </div>
                  </div>

                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>

                  <div
                    className="form-row"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <div className="form-button-wrapper">
                      <button className="save-btn">Save</button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}

          {activeSection === "orders" && (
            <>
              <div className="profile-details-title">
                <FaShoppingCart
                  className="profile-section-icon"
                  style={{
                    color: "#FFC46B",
                    fontSize: "2rem",
                    marginRight: "16px",
                    verticalAlign: "middle",
                  }}
                />
                My Orders
                <hr className="profile-details-divider" />
              </div>
              <div className="profile-details-inner-box">
                <p>Here are your orders.</p>
              </div>
            </>
          )}

          {activeSection === "selling" && (
            <>
              <div className="profile-details-title">
                <FaTags
                  className="profile-section-icon"
                  style={{
                    color: "#FFC46B",
                    fontSize: "2rem",
                    marginRight: "16px",
                    verticalAlign: "middle",
                  }}
                />
                Start Selling
                <hr className="profile-details-divider" />
              </div>
              <div className="profile-details-inner-box">
                <p>Start selling your products here.</p>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
