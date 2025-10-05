"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: number;
  img: string;
  hoverImg: string;
  name: string;
  artist: string;
  price: string;
  storyId?: string;
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

  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: product.id.toString(),
      price: parseFloat(product.price.replace(/[₱,]/g, "")),
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleRating = (rate: number) => {
    setRating(rate);
    setReviews(reviews + 1);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="modal-box" ref={modalRef}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close product details"
          ref={closeBtnRef}
        >
          <FaTimes aria-hidden="true" />
        </button>

        <div className="modal-content">
          <div className="modal-left">
            <div className="modal-thumbs" role="list">
              <img
                src={product.img}
                alt={`Thumbnail of ${product.name}`}
                className={mainImage === product.img ? "active" : ""}
                onClick={() => setMainImage(product.img)}
                role="listitem"
                tabIndex={0}
              />
              <img
                src={product.hoverImg}
                alt={`Alternate view of ${product.name}`}
                className={mainImage === product.hoverImg ? "active" : ""}
                onClick={() => setMainImage(product.hoverImg)}
                role="listitem"
                tabIndex={0}
              />
            </div>
            <div className="modal-main">
              <img
                src={mainImage}
                alt={`Main view of ${product.name} by ${product.artist}`}
              />
            </div>
          </div>

          <div className="modal-right">
            <h2 id="modal-title" className="modal-artist">
              {product.artist}
            </h2>
            {product.storyId && (
              <Link
                href={`/artiststory/${product.storyId}`}
                className="artist-story-btn"
                aria-label={`Read story about artist ${product.artist}`}
              >
                <i>View Artist Story</i>
              </Link>
            )}

            <h3 className="modal-product-name">{product.name}</h3>
            <p className="modal-price">{product.price}</p>
            <div className="modal-divider"></div>

            <label htmlFor="quantity-control" className="modal-quantity-label">
              Quantity
            </label>
            <div
              className="modal-quantity"
              id="quantity-control"
              role="group"
              aria-label="Select quantity"
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p className="modal-review-title">Customer Reviews</p>
            <div className="reviews-section">
              <div
                className="stars"
                role="radiogroup"
                aria-label="Rate this product"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn"
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(rating)}
                    aria-label={`${star} star rating`}
                    aria-pressed={rating === star}
                  >
                    <FaStar
                      size={24}
                      color={star <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
              <p aria-live="polite">
                {reviews > 0 ? `${reviews} review(s)` : "No reviews yet"}
              </p>
            </div>

            <button
              className={`add-to-cart-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? "✔ Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="modal-about" id="modal-desc">
          <h3 className="about-title">About the Product</h3>
          <div className="modal-divider-about"></div>

          <div className="about-box">
            <p>
              Numbered from the edition of 295, with the accompanying
              certificate of authenticity, on Hahnemühle 350gsm Museum Etching
              wove paper, with full margins, sheet 700 x 560mm (27 1/2 x 22in)
              (unframed).
              <br />
              Images are not representative of the actual work or condition; for
              full information, request a condition report at{" "}
              <b>specialist@artsy.net</b>.
            </p>
          </div>

          <div className="about-box">
            <p>
              <b>Materials:</b> Hahnemühle 350gsm Museum Etching paper
            </p>
            <p>
              <b>Size:</b> 27 3/5 × 22 in | 70 × 56 cm
            </p>
            <p>
              <b>Medium:</b> Digital pigment print in colours
            </p>
            <p>
              <b>Type:</b> Print
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
