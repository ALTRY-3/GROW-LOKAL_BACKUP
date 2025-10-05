"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./profile.css";
import {
  FaEdit,
  FaUser,
  FaShoppingCart,
  FaTags,
  FaSearch,
  FaImage,
} from "react-icons/fa";

// Define regions, provinces, and cities together
const regionProvinceCityData: Record<string, Record<string, string[]>> = {
  "NCR (Metro Manila)": {
    "Metro Manila": [
      "Manila",
      "Quezon City",
      "Makati",
      "Taguig",
      "Pasig",
      "Mandaluyong",
      "Parañaque",
      "Pasay",
      "Caloocan",
      "Las Piñas",
      "Malabon",
      "Marikina",
      "Muntinlupa",
      "Navotas",
      "San Juan",
      "Valenzuela",
      "Pateros",
    ],
  },
  "Central Luzon (Region III)": {
    Pampanga: [
      "Angeles",
      "San Fernando",
      "Mabalacat",
      "Apalit",
      "Arayat",
      "Bacolor",
      "Candaba",
      "Floridablanca",
      "Guagua",
      "Lubao",
      "Macabebe",
      "Magalang",
      "Masantol",
      "Mexico",
      "Minalin",
      "Porac",
      "San Luis",
      "San Simon",
      "Santa Ana",
      "Santa Rita",
      "Santo Tomas",
      "Sasmuan",
    ],
    Zambales: [
      "Olongapo",
      "Iba",
      "Subic",
      "San Antonio",
      "San Felipe",
      "San Marcelino",
      "San Narciso",
      "Castillejos",
      "Botolan",
      "Candelaria",
      "Masinloc",
      "Palauig",
      "Cabangan",
      "Sta. Cruz",
    ],
    Bataan: [
      "Balanga",
      "Abucay",
      "Bagac",
      "Dinalupihan",
      "Hermosa",
      "Limay",
      "Mariveles",
      "Morong",
      "Orani",
      "Orion",
      "Pilar",
      "Samal",
    ],
    Bulacan: [
      "Malolos",
      "Meycauayan",
      "San Jose del Monte",
      "Angat",
      "Balagtas",
      "Baliuag",
      "Bocaue",
      "Bulacan",
      "Bustos",
      "Calumpit",
      "Doña Remedios Trinidad",
      "Guiguinto",
      "Hagonoy",
      "Marilao",
      "Norzagaray",
      "Obando",
      "Pandi",
      "Plaridel",
      "Pulilan",
      "San Ildefonso",
      "San Miguel",
      "San Rafael",
      "Santa Maria",
    ],
  },
};

const regionList = [
  "Ilocos Region (Region I)",
  "Cagayan Valley (Region II)",
  "Central Luzon (Region III)",
  "CALABARZON (Region IV-A)",
  "MIMAROPA (Region IV-B)",
  "Bicol Region (Region V)",
  "Western Visayas (Region VI)",
  "Central Visayas (Region VII)",
  "Eastern Visayas (Region VIII)",
  "Zamboanga Peninsula (Region IX)",
  "Northern Mindanao (Region X)",
  "Davao Region (Region XI)",
  "SOCCSKSARGEN (Region XII)",
  "Caraga (Region XIII)",
  "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
  "Cordillera Administrative Region (CAR)",
  "National Capital Region (NCR)",
];

// Example: Replace this with your actual user data source
const mockUser = {
  name: "Venti Batumbakal",
  email: "venti@gmail.com",
  phone: "09171234567",
  street: "14 Harris St",
  barangay: "East Bajac-Bajac",
  province: "Zambales",
  city: "Olongapo",
  postal: "2200",
  // removed country - we're using region instead
};

// add city -> barangay map
const cityBarangayData: Record<string, string[]> = {
  Olongapo: [
    "Asinan",
    "Banicain",
    "Barretto",
    "East Bajac-Bajac",
    "East Tapinac",
    "Gordon Heights",
    "Kalaklan",
    "Mabayuan",
    "New Cabalan",
    "New Ilalim",
    "New Kababae",
    "New Kalalake",
    "Old Cabalan",
    "Pag-asa",
    "Santa Rita",
    "West Bajac-Bajac",
    "West Tapinac",
  ],
  Iba: [
    "Balaybay",
    "Binocboc",
    "Boton",
    "Buhangin",
    "Canaan",
    "Calabasa",
    "Casupanan",
    "Gulod",
    "Masinloc",
    "Pantalan",
    "Poblacion",
    "San Vicente",
    "Sapang Uwak",
    "Tondo",
  ],
  Subic: [
    "Binictican",
    "Barangay 1",
    "Barangay 2",
    "Barangay 3",
    "Barangay 4",
    "Barangay 5",
    "Barangay 6",
    "Barangay 7",
    "Barangay 8",
    "Barangay 9",
    "Barangay 10",
    "Barangay 11",
    "Barangay 12",
    "Barangay 13",
    "Barangay 14",
    "Barangay 15",
    "Barangay 16",
    "Barangay 17",
    "Barangay 18",
  ],
  "San Antonio": [
    "Aplaya",
    "Bagbaguin",
    "Banban",
    "Camangyanan",
    "Labney",
    "Nagbacalan",
    "Poblacion I",
    "Poblacion II",
    "Poblacion III",
    "San Francisco",
    "San Gabriel",
    "San Jose",
    "San Rafael",
    "Santa Cruz",
  ],
  "San Felipe": [
    "Bagacay",
    "Balogo",
    "Bulo",
    "Camachin",
    "Canaynayan",
    "Dangcol",
    "La Paz",
    "Liwanag",
    "Mabanggot",
    "Poblacion I",
    "Poblacion II",
    "San Juan",
    "San Jose",
    "San Vicente",
  ],
  "San Marcelino": [
    "Alat",
    "Bagong Silang",
    "Banaybanay",
    "Banog",
    "Binabalian",
    "Buenavista",
    "Canomay",
    "Capayawan",
    "Concepcion",
    "Don Pedro",
    "Liwanag",
    "Loma de Gato",
    "Maloma",
    "Mambog",
    "Poblacion I",
    "Poblacion II",
    "San Miguel",
    "San Roque",
    "Santa Maria",
  ],
  "San Narciso": [
    "Aplaya",
    "Bagacayan",
    "Bagumbayan",
    "Balaybay",
    "Banaag",
    "Banot",
    "Bayabas",
    "Camachin",
    "Dila-dila",
    "Gugo",
    "Linao",
    "Poblacion",
    "San Juan",
    "San Pablo",
    "San Pedro",
    "Santa Rita",
  ],
  Castillejos: [
    "Alasasin",
    "Bagong Silang",
    "Bahay Bato",
    "Bamban",
    "Binabalian",
    "Cabatuhan",
    "Lamao",
    "Mabayo",
    "Maniboc",
    "Poblacion I",
    "Poblacion II",
    "San Juan",
    "San Jose",
    "San Pablo",
    "Santa Isabel",
  ],
  Botolan: [
    "Bamban",
    "Bani",
    "Binaliw",
    "Cabugao",
    "Casilagan",
    "Dacanlao",
    "Looc",
    "Maguisguis",
    "Malabon",
    "Poblacion",
    "San Isidro",
    "San Jose",
    "San Rafael",
    "Santa Fe",
    "Santa Maria",
  ],
  Candelaria: [
    "Bagumbayan",
    "Banban",
    "Baytan",
    "Calapacuan",
    "Camachin",
    "Caparangan",
    "Gugo",
    "Maniboc",
    "Poblacion",
    "San Antonio",
    "San Roque",
    "Santa Cruz",
  ],
  Masinloc: [
    "Apoongan",
    "Balog",
    "Banaban",
    "Baragay",
    "Binabalian",
    "Camangyanan",
    "Casanayan",
    "Daniw",
    "Doliman",
    "Hulo",
    "Iba",
    "Libato",
    "Lusong",
    "Mabini",
    "Mabilog",
    "Magahis",
    "Poblacion",
    "San Antonio",
    "San Juan",
    "San Roque",
  ],
  Palauig: [
    "Alili",
    "Anilao",
    "Bagong Silang",
    "Balogo",
    "Bani",
    "Binabalian",
    "Cabangahan",
    "Concepcion",
    "Malabon",
    "Poblacion",
    "San Roque",
    "Santa Cruz",
  ],
  Cabangan: [
    "Bagong Silang",
    "Bamban",
    "Banaybanay",
    "Calangcang",
    "Candelaria",
    "Concepcion",
    "Dila-dila",
    "Liwanag",
    "Malabon",
    "Poblacion",
    "San Agustin",
    "San Jose",
    "San Juan",
    "San Roque",
    "Santa Maria",
  ],
  "Sta. Cruz": [
    "Bagumbayan",
    "Baluti",
    "Bayto",
    "Binabalian",
    "Bulo",
    "Candelaria",
    "Carmen",
    "Concepcion",
    "Poblacion",
    "San Isidro",
    "San Juan",
    "San Miguel",
    "Santa Rita",
  ],
};

export default function ProfilePage() {
  const [confirmedOrders, setConfirmedOrders] = useState<Set<string>>(
    new Set()
  );
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

  const [activeOrdersTab, setActiveOrdersTab] = useState("All");

  const findRegionByProvince = (prov?: string) => {
    if (!prov) return "";
    for (const regionKey of Object.keys(regionProvinceCityData)) {
      const provinces = Object.keys(regionProvinceCityData[regionKey] || {});
      if (provinces.includes(prov)) return regionKey;
    }
    return "";
  };

  const [fullName, setFullName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);
  const [street, setStreet] = useState(mockUser.street);
  const [province, setProvince] = useState<string>(mockUser.province);
  const [city, setCity] = useState<string>(mockUser.city);
  const [postal, setPostal] = useState(mockUser.postal);
  const initialRegion = findRegionByProvince(mockUser.province) || "";
  const [region, setRegion] = useState<string>(initialRegion);
  const [barangay, setBarangay] = useState<string>("");

  const [highlightRegion, setHighlightRegion] = useState(false);
  const regionRef = useRef<HTMLSelectElement | null>(null);
  const [regionTooltip, setRegionTooltip] = useState("");
  const [highlightProvince, setHighlightProvince] = useState(false);
  const [provinceTooltip, setProvinceTooltip] = useState("");
  const provinceRef = useRef<HTMLSelectElement | null>(null);
  const [highlightCity, setHighlightCity] = useState(false);
  const [cityTooltip, setCityTooltip] = useState("");
  const cityRef = useRef<HTMLSelectElement | null>(null);
  const [highlightBarangay, setHighlightBarangay] = useState(false);
  const [barangayTooltip, setBarangayTooltip] = useState("");
  const barangayRef = useRef<HTMLSelectElement | null>(null);

  function emphasizeField(
    setHighlight: (v: boolean) => void,
    setTooltip: (v: string) => void,
    ref: React.RefObject<any>,
    tooltipMsg: string,
    duration = 2000
  ) {
    setHighlight(true);
    setTooltip(tooltipMsg);
    setTimeout(
      () =>
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      50
    );
    ref.current?.focus?.();
    setTimeout(() => {
      setHighlight(false);
      setTooltip("");
    }, duration);
  }

  const provincesForRegion = region
    ? Object.keys(regionProvinceCityData[region] || {})
    : [];
  const citiesForProvince =
    region && province ? regionProvinceCityData[region]?.[province] ?? [] : [];

  const emphasizeRegion = (duration = 2000) => {
    setHighlightRegion(true);
    setTimeout(
      () =>
        regionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      50
    );
    regionRef.current?.focus?.();
    window.setTimeout(() => setHighlightRegion(false), duration);
  };

  const [orderRatings, setOrderRatings] = useState<Record<string, number>>({});
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [orderRating, setOrderRating] = useState<number | null>(5);

  const handleConfirmReceipt = (orderId: string) => {
    setPendingOrderId(orderId);
    setShowConfirmModal(true);
  };

  const confirmReceipt = () => {
    setShowConfirmModal(false);
    setLoadingConfirm(true);

    setTimeout(() => {
      setLoadingConfirm(false);

      // Add order to confirmedOrders
      setConfirmedOrders((prev) =>
        pendingOrderId ? new Set(prev).add(pendingOrderId) : prev
      );

      // Automatically switch to "Completed" tab
      setActiveOrdersTab("Completed");

      setSuccessMessage("Order has been marked as received!");
      setShowSuccessModal(true);
      setPendingOrderId(null);
    }, 1000);
  };

  const cancelConfirmReceipt = () => {
    setShowConfirmModal(false);
    setPendingOrderId(null);
  };

  const handleRateOrder = (orderId: string, rating: number) => {
    setOrderRatings((prev) => ({ ...prev, [orderId]: rating }));
    setSuccessMessage("Thank you for rating!");
    setShowSuccessModal(true);

    setTimeout(() => setShowSuccessModal(false), 1500);
  };

  const [activeStep, setActiveStep] = useState(0);
  const [shopName, setShopName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupOther, setPickupOther] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const [sellerStory, setSellerStory] = useState("");

  const [pickupBarangay, setPickupBarangay] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalBoxStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "30px 40px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.2s ease-in-out",
  };

  const modalTitleStyle: React.CSSProperties = {
    color: "#AF7928",
    marginBottom: "12px",
    fontSize: "1.2rem",
    fontWeight: 600,
  };

  const modalTextStyle: React.CSSProperties = {
    color: "#555",
    fontSize: "14px",
    marginBottom: "20px",
  };

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
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

          {/* My Profile */}
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
                  className={`profile-section-label ${
                    activeSection === "profile" ? "active" : ""
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
              className={`profile-section-row ${
                activeSection === "orders" ? "active" : ""
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
              className={`profile-section-row ${
                activeSection === "selling" ? "active" : ""
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
          {/* Profile Section */}
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
                {/* Upload + Form */}
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

                <form className="profile-form">
                  {/* Full Name */}
                  <div className="form-row">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-row">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-row">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {/**DOUBLE ROWS START */}
                  {/* Date of Birth (left)  —  Gender (right) */}
                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-input" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <div
                        className="gender-options"
                        style={{ alignItems: "center" }}
                      >
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

                  {/* Street (left)  —  Barangay (right) */}
                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">Street</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter street address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Barangay</label>
                      <select
                        ref={barangayRef}
                        className={`form-input${
                          highlightBarangay ? " highlight" : ""
                        }`}
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                        disabled={!city}
                        onMouseDown={(e) => {
                          if (!city) {
                            e.preventDefault();
                            emphasizeField(
                              setHighlightCity,
                              setCityTooltip,
                              cityRef,
                              "Please select a city first."
                            );
                          }
                        }}
                        onFocus={() => {
                          if (!city)
                            emphasizeField(
                              setHighlightCity,
                              setCityTooltip,
                              cityRef,
                              "Please select a city first."
                            );
                        }}
                      >
                        <option value="">Select barangay</option>
                        {city &&
                          cityBarangayData[city]?.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* City (left)  —  Province (right) */}
                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <select
                        ref={cityRef}
                        className={`form-input${
                          highlightCity ? " highlight" : ""
                        }`}
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          setBarangay("");
                        }}
                        required
                        onMouseDown={(e) => {
                          if (!province) {
                            e.preventDefault();
                            emphasizeField(
                              setHighlightProvince,
                              setProvinceTooltip,
                              provinceRef,
                              "Please select a province first."
                            );
                          }
                        }}
                        onFocus={() => {
                          if (!province)
                            emphasizeField(
                              setHighlightProvince,
                              setProvinceTooltip,
                              provinceRef,
                              "Please select a province first."
                            );
                        }}
                        disabled={!province}
                      >
                        <option value="">Select city</option>
                        {citiesForProvince.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Province</label>
                      <select
                        ref={provinceRef}
                        className={`form-input${
                          highlightProvince ? " highlight" : ""
                        }`}
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setCity("");
                          setBarangay("");
                          if (!region) {
                            const inferred = findRegionByProvince(
                              e.target.value
                            );
                            if (inferred) setRegion(inferred);
                          }
                        }}
                        required
                        onMouseDown={(e) => {
                          if (!region) {
                            e.preventDefault();
                            emphasizeField(
                              setHighlightRegion,
                              setRegionTooltip,
                              regionRef,
                              "Please select a region first."
                            );
                          }
                        }}
                        onFocus={() => {
                          if (!region)
                            emphasizeField(
                              setHighlightRegion,
                              setRegionTooltip,
                              regionRef,
                              "Please select a region first."
                            );
                        }}
                        disabled={!region && provincesForRegion.length > 0}
                      >
                        <option value="">Select province</option>
                        {provincesForRegion.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Region (left)  —  Postal Code (right) */}
                  <div className={`form-row double-row`}>
                    <div
                      className={`form-group ${
                        highlightRegion ? "highlight" : ""
                      }`}
                    >
                      <label className="form-label">Region</label>
                      <select
                        ref={regionRef}
                        className={`form-input short-input${
                          highlightRegion ? " highlight" : ""
                        }`}
                        value={region}
                        onChange={(e) => {
                          setRegion(e.target.value);
                          setProvince("");
                          setCity("");
                          setBarangay("");
                          setHighlightRegion(false);
                          setRegionTooltip("");
                        }}
                        required
                      >
                        <option value="">Select region</option>
                        {regionList.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className="form-input short-input"
                        placeholder="Enter postal code"
                        value={postal}
                        onChange={(e) => setPostal(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Save */}
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

          {/* Orders Section */}
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
                <div className="orders-nav">
                  {[
                    "All",
                    "To Pay",
                    "To Ship",
                    "To Receive",
                    "Completed",
                    "Cancelled",
                  ].map((tab) => (
                    <div
                      key={tab}
                      className={`orders-tab ${
                        activeOrdersTab === tab ? "active" : ""
                      }`}
                      onClick={() => setActiveOrdersTab(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
                <div className="orders-search">
                  <FaSearch className="orders-search-icon" />
                  <input
                    type="text"
                    placeholder="Search Seller Name or Product"
                    className="orders-search-input"
                  />
                </div>

                <div className="orders-content">
                  <div className="order-card">
                    <div className="order-header">
                      <div className="order-shop">
                        <button
                          type="button"
                          className="view-store-btn"
                          onClick={() => {
                            // TODO: Replace with actual store navigation logic
                            alert("Go to store!");
                          }}
                        >
                          <i className="fas fa-store"></i>
                          View Store
                        </button>
                      </div>

                      <div className="order-status-wrapper">
                        {activeOrdersTab === "To Ship" && (
                          <span className="order-status-msg left">
                            📦 Seller is preparing your order...
                          </span>
                        )}
                        {activeOrdersTab === "To Receive" && (
                          <span className="order-status-msg left">
                            🚚 Your order is on the way...
                          </span>
                        )}
                        {activeOrdersTab === "Completed" && (
                          <span className="order-status-msg left delivered">
                            <i className="fas fa-truck"></i> Parcel has been
                            delivered
                          </span>
                        )}

                        <span className="order-status">{activeOrdersTab}</span>
                      </div>
                    </div>

                    <div className="order-body">
                      <img
                        src="/box1.png"
                        alt="Acacia Wood Deep Round Plate"
                        className="order-product-img"
                      />
                      <div className="order-details">
                        <p className="order-artist">RICHEL MARIBE</p>
                        <p className="order-product-name">
                          Acacia Wood Deep Round Plate
                        </p>
                        <p className="order-product-qty">Qty: 1</p>

                        {activeOrdersTab === "Completed" && (
                          <div className="order-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`star${
                                  star <= (orderRatings["order-123"] || 0)
                                    ? " filled"
                                    : ""
                                }`}
                                onClick={() =>
                                  setOrderRatings((prev) => ({
                                    ...prev,
                                    ["order-123"]: star,
                                  }))
                                }
                                style={{
                                  cursor: "pointer",
                                  fontSize: "18px",
                                  color:
                                    star <= (orderRatings["order-123"] || 0)
                                      ? "#FFC46B"
                                      : "#ccc",
                                  transition: "color 0.2s",
                                }}
                                title={`Rate ${star} star${
                                  star > 1 ? "s" : ""
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="order-price">
                        {activeOrdersTab === "To Pay"
                          ? "Amount Payable: ₱1211"
                          : activeOrdersTab === "Completed"
                          ? "Order Total: ₱149.00"
                          : "₱149.00"}
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="order-footer">
                      {activeOrdersTab === "To Pay" && (
                        <>
                          <button className="order-btn-pending">Pending</button>
                          <button className="order-btn primary">
                            Cancel Order
                          </button>
                        </>
                      )}

                      {activeOrdersTab === "To Ship" && (
                        <button className="order-btn">View Details</button>
                      )}

                      {activeOrdersTab === "To Receive" && (
                        <button
                          className="order-btn primary"
                          onClick={() => handleConfirmReceipt("order-123")}
                          disabled={loadingConfirm}
                        >
                          {loadingConfirm ? "Confirming..." : "Confirm Receipt"}
                        </button>
                      )}

                      {activeOrdersTab === "Completed" && (
                        <>
                          <button className="order-btn">Buy Again</button>

                          {!orderRatings["order-123"] &&
                            confirmedOrders.has("order-123") && (
                              <button
                                className="order-btn primary"
                                onClick={() =>
                                  setOrderRatings((prev) => ({
                                    ...prev,
                                    ["order-123"]: 0,
                                  }))
                                }
                              >
                                Rate Order
                              </button>
                            )}
                        </>
                      )}

                      {activeOrdersTab === "Cancelled" && (
                        <button className="order-btn primary">Buy Again</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Selling Section */}
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
                {/* Progress Steps */}
                <div className="selling-progress">
                  {["Shop Information", "Seller Story", "Submit"].map(
                    (label, i) => {
                      const isActive = i === activeStep;
                      return (
                        <React.Fragment key={label}>
                          <div className="progress-step">
                            <div
                              className="circle"
                              style={{
                                backgroundColor: isActive
                                  ? "#AF7928"
                                  : "rgba(0,0,0,0.25)",
                              }}
                            ></div>
                            <span
                              className="label"
                              style={{
                                color: isActive
                                  ? "#AF7928"
                                  : "rgba(0,0,0,0.25)",
                              }}
                            >
                              {label}
                            </span>
                          </div>
                          {i < 2 && (
                            <div
                              className="progress-line"
                              style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                            ></div>
                          )}
                        </React.Fragment>
                      );
                    }
                  )}
                </div>

                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    margin: "24px 0",
                  }}
                />

                {/* Step Contents */}
                {activeStep === 0 && (
                  <div className="selling-step-content">
                    <div className="form-row">
                      <label className="form-label">Shop Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your Shop Name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Pickup Address</label>
                      <div className="form-input-group">
                        <select
                          className="form-input"
                          value={pickupBarangay}
                          onChange={(e) => setPickupBarangay(e.target.value)}
                        >
                          <option value="">Select Barangay</option>
                          <option value="Asinan">Asinan</option>
                          <option value="Banicain">Banicain</option>
                          <option value="Barretto">Barretto</option>
                          <option value="East Bajac-Bajac">
                            East Bajac-Bajac
                          </option>
                          <option value="Gordon Heights">Gordon Heights</option>
                          <option value="Kalaklan">Kalaklan</option>
                          <option value="Mabayuan">Mabayuan</option>
                          <option value="New Cabalan">New Cabalan</option>
                          <option value="Old Cabalan">Old Cabalan</option>
                          <option value="Pag-asa">Pag-asa</option>
                          <option value="Sta. Rita">Sta. Rita</option>
                          <option value="West Bajac-Bajac">
                            West Bajac-Bajac
                          </option>
                        </select>

                        <input
                          type="text"
                          className="form-input"
                          placeholder="Other Details"
                          value={pickupAddress}
                          onChange={(e) => setPickupAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Enter Shop Email"
                        value={shopEmail}
                        onChange={(e) => setShopEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div
                    className="selling-step-content"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "28px",
                    }}
                  >
                    {/* Upload Photo Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "32px",
                      }}
                    >
                      <div style={{ flex: "0 0 200px" }}>
                        <label className="form-label">Upload Photo</label>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          Upload a photo of <strong>you</strong> or your{" "}
                          <strong>artwork</strong>.
                        </p>
                      </div>

                      <div
                        style={{
                          width: "520px",
                          height: "123px",
                          border: "1px dashed rgba(175, 121, 40, 0.5)",
                          borderRadius: "6px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          backgroundColor: "#fffdf8",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          id="sellerPhoto"
                          style={{
                            position: "absolute",
                            opacity: 0,
                            width: "100%",
                            height: "100%",
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const preview = document.getElementById(
                                  "sellerPhotoPreview"
                                ) as HTMLImageElement;
                                const icon =
                                  document.getElementById("uploadIcon");
                                const message =
                                  document.getElementById("uploadMessage");

                                if (preview && event.target?.result) {
                                  preview.src = event.target.result as string;
                                  preview.style.display = "block";
                                }
                                if (icon) icon.style.display = "none";
                                if (message) message.style.display = "none";
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />

                        <img
                          id="sellerPhotoPreview"
                          alt="Preview"
                          style={{
                            display: "none",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                            zIndex: 1,
                          }}
                        />

                        <FaImage
                          id="uploadIcon"
                          style={{
                            fontSize: "32px",
                            color: "rgba(175, 121, 40, 0.6)",
                            zIndex: 0,
                          }}
                        />
                        <p
                          id="uploadMessage"
                          style={{
                            fontSize: "12px",
                            color: "rgba(0,0,0,0.5)",
                            marginTop: "8px",
                            zIndex: 0,
                          }}
                        >
                          Click to upload • Max size 2MB (JPG/PNG)
                        </p>
                      </div>
                    </div>

                    {/* Artist Story Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "32px",
                      }}
                    >
                      <div style={{ flex: "0 0 200px" }}>
                        <label className="form-label">Artist Story</label>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          Share your journey, inspiration, and your craft
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <textarea
                          className="form-input"
                          style={{
                            width: "32.5rem",
                            minHeight: "10rem",
                            maxHeight: "25rem",
                            border: "1px solid rgba(175, 121, 40, 0.5)",
                            borderRadius: "8px",
                            resize: "none",
                            padding: "12px",
                            fontSize: "14px",
                            color: "#333",
                            lineHeight: "1.5",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                          }}
                          placeholder="Write your artist story here..."
                          maxLength={500}
                          value={sellerStory}
                          onChange={(e) => {
                            setSellerStory(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height =
                              e.target.scrollHeight + "px";
                          }}
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            color: sellerStory.length >= 500 ? "red" : "#888",
                            alignSelf: "flex-end",
                            marginTop: "6px",
                          }}
                        >
                          {sellerStory.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="selling-step-content">
                    <p>
                      Review your details before submitting your shop for
                      approval.
                    </p>

                    <div
                      style={{
                        marginTop: "16px",
                        backgroundColor: "#faf8f5",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        border: "1px solid rgba(175,121,40,0.2)",
                      }}
                    >
                      <div style={{ marginBottom: "10px" }}>
                        <strong>Shop Name:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {shopName || "—"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Barangay:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {pickupBarangay || "—"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Other Details:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {pickupOther || "—"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Email:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {shopEmail || "—"}
                        </p>
                      </div>

                      <div>
                        <strong>Seller Story:</strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            color: "#333",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {sellerStory || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    margin: "24px 0",
                  }}
                />

                {/* Navigation Buttons + Save Validation + Modal */}

                {/* Selling Buttons */}
                <div className="selling-buttons" style={{ marginTop: "24px" }}>
                  <button
                    className="order-btn"
                    onClick={() => {
                      setIsSaved(true);
                      setShowSaveError(false);
                      setShowSaveModal(true); // show modal instead of alert
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="order-btn primary"
                    onClick={() => {
                      if (!isSaved) {
                        setShowSaveError(true);
                        return;
                      }
                      setShowSaveError(false);

                      if (activeStep < 2) {
                        setActiveStep(activeStep + 1);
                        setIsSaved(false); // reset for next step
                        setShowProgressModal(true); // show modal when moving to next step
                      } else {
                        setShowSubmitModal(true); // final submit modal
                      }
                    }}
                  >
                    {activeStep < 2 ? "Next" : "Submit"}
                  </button>

                  {activeStep > 0 && (
                    <button
                      className="order-btn secondary"
                      style={{ marginLeft: "8px" }}
                      onClick={() => setActiveStep(activeStep - 1)}
                    >
                      Back
                    </button>
                  )}
                </div>

                {/* Error message if user tries Next without saving */}
                {showSaveError && (
                  <p
                    style={{ color: "red", fontSize: "13px", marginTop: "8px" }}
                  >
                    ⚠️ Please click “Save” first before proceeding.
                  </p>
                )}

                {/* Save Progress Modal */}
                {showSaveModal && (
                  <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                      <h3 style={modalTitleStyle}>✅ Progress Saved</h3>
                      <p style={modalTextStyle}>
                        Your progress for this step has been successfully saved.
                      </p>
                      <button
                        className="order-btn primary"
                        onClick={() => setShowSaveModal(false)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}

                {/* Step Progress Modal (for Next button) */}
                {showProgressModal && (
                  <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                      <h3 style={modalTitleStyle}>✨ Step Completed</h3>
                      <p style={modalTextStyle}>
                        You have successfully saved your details. Proceed to the
                        next step.
                      </p>
                      <button
                        className="order-btn primary"
                        onClick={() => setShowProgressModal(false)}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Final Submit Confirmation Modal */}
                {showSubmitModal && (
                  <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                      <h3 style={modalTitleStyle}>🎉 Shop Submitted!</h3>
                      <p style={modalTextStyle}>
                        Your shop has been successfully submitted for review.
                        You will receive an update once it’s approved.
                      </p>
                      <button
                        className="order-btn primary"
                        onClick={() => setShowSubmitModal(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>Success</h3>
                      <p>{successMessage}</p>
                      <div className="modal-actions">
                        <button
                          className="order-btn primary"
                          onClick={() => setShowSuccessModal(false)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
