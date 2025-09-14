"use client";
import React, { useState } from "react";
import { FaTimes, FaStar } from "react-icons/fa";

interface Product {
  img: string;
  hoverImg: string;
  name: string;
  artist: string;
  price: string;
}

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [mainImage, setMainImage] = useState(product.img);
  const [quantity, setQuantity] = useState(1);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviews, setReviews] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    setReviews(reviews + 1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* TOP: LEFT & RIGHT */}
        <div className="modal-content">
          {/* LEFT SIDE */}
          <div className="modal-left">
            <div className="modal-thumbs">
              <img
                src={product.img}
                alt={product.name}
                className={mainImage === product.img ? "active" : ""}
                onClick={() => setMainImage(product.img)}
              />
              <img
                src={product.hoverImg}
                alt={product.name}
                className={mainImage === product.hoverImg ? "active" : ""}
                onClick={() => setMainImage(product.hoverImg)}
              />
            </div>
            <div className="modal-main">
              <img src={mainImage} alt={product.name} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="modal-right">
            <h2 className="modal-artist">{product.artist}</h2>
            <button className="artist-story-btn">
              <i>Artist Story Available</i>
            </button>
            <h3 className="modal-product-name">{product.name}</h3>
            <p className="modal-price">{product.price}</p>
            <div className="modal-divider"></div>

            <p className="modal-quantity-label">QUANTITY</p>
            <div className="modal-quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <p className="modal-review-title">CUSTOMER REVIEWS</p>
            <div className="reviews-section">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    style={{ cursor: "pointer" }}
                    color={star <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(rating)}
                  />
                ))}
              </div>
              <p>{reviews > 0 ? `${reviews} review(s)` : "No reviews yet"}</p>
            </div>

            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>

        {/* BOTTOM: ABOUT SECTION */}
        <div className="modal-about">
          <h3 className="about-title">About the Product</h3>
          <div className="modal-divider-about"></div>

          <div className="about-box">
            <p>
              Numbered from the edition of 295, with the accompanying certificate
              of authenticity, on Hahnemühle 350gsm Museum Etching wove paper,
              with full margins, sheet 700 x 560mm (27 1/2 x 22in) (unframed).
              <br />
              Images are not representative of the actual work or condition; for
              full information on the condition of this work, request a condition
              report by emailing <b>specialist@artsy.net</b>.
            </p>
          </div>

          <div className="about-box">
            <p><b>Materials:</b> Hahnemühle 350gsm Museum Etching paper</p>
            <p><b>Size:</b> 27 3/5 × 22 in | 70 × 56 cm</p>
            <p><b>Medium:</b> Digital pigment print in colours</p>
            <p><b>Type:</b> Print</p>
          </div>
        </div>
      </div>
    </div>
  );
}
