# Cart Page Redesign Implementation Prompt

## 🎯 Objective
Redesign the main cart page (`src/app/cart/page.tsx`) using the modern design from `page2.tsx` and create complete styling in `cart2.css`. The new design should integrate with the existing cart functionality (Zustand store + API) while providing a superior user experience with checkbox selection, sticky footer, and smooth animations.

---

## 📋 Current State Analysis

### Existing Files
- **`src/app/cart/page.tsx`** - Current functional cart (connected to API/Zustand)
- **`src/app/cart/page2.tsx`** - Modern design reference (hardcoded data)
- **`src/app/cart/cart.css`** - Current styling
- **`src/app/cart/cart2.css`** - Currently empty (needs implementation)
- **`src/store/cartStore.ts`** - Zustand store with full cart API integration

### Current Functionality (Keep All)
✅ Connected to `/api/cart` endpoints  
✅ Zustand store for state management  
✅ Fetch, add, update, remove cart items  
✅ Quantity controls with stock limits  
✅ Loading states and error handling  
✅ Empty cart state  
✅ Navigation to checkout  
✅ Clear entire cart function  

### New Design Features (From page2.tsx)
🆕 Individual item checkbox selection  
🆕 "Select All" checkbox functionality  
🆕 Sticky footer with total and checkout (hides when page footer visible)  
🆕 Bulk delete selected items  
🆕 Modern card-based layout with vertical divider  
🆕 Clean artist/product info layout  
🆕 Responsive cart title bar with icon  
🆕 Improved visual hierarchy  

---

## 🛠️ Implementation Tasks

### **TASK 1: Create Complete cart2.css Styling**

Create a comprehensive CSS file at `src/app/cart/cart2.css` with the following components:

#### 1.1 Page Layout
```css
/* Main wrapper with proper spacing */
.cart-page-wrapper {
  min-height: calc(100vh - 200px);
  padding: 20px;
  padding-bottom: 120px; /* Space for sticky footer */
  background-color: #f5f5f5;
}

/* Cart title bar with icon */
.cart-title-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  background-color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cart-title-icon {
  font-size: 24px;
  color: #AF7928; /* Grow Lokal brand color */
}

.cart-title-text {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}
```

#### 1.2 Cart Items Container
```css
.cart-items-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.cart-item-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.cart-item-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Checkbox styling */
.cart-item-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #AF7928;
  flex-shrink: 0;
}

/* Product image */
.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

/* Vertical divider */
.cart-item-divider {
  width: 2px;
  height: 80px;
  background-color: #e0e0e0;
  flex-shrink: 0;
}
```

#### 1.3 Item Information Section
```css
.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; /* Allow text truncation */
}

.cart-item-artist {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.cart-item-product {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-price {
  font-size: 18px;
  font-weight: 700;
  color: #AF7928;
  margin: 4px 0;
}

/* Quantity controls */
.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.cart-item-quantity button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.cart-item-quantity button:hover:not(:disabled) {
  background-color: #AF7928;
  color: white;
  border-color: #AF7928;
}

.cart-item-quantity button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cart-item-quantity span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}
```

#### 1.4 Delete Button & Actions
```css
.cart-item-trash {
  background-color: transparent;
  border: none;
  color: #dc3545;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.cart-item-trash:hover {
  background-color: #dc35451a;
  transform: scale(1.1);
}

.cart-item-trash:active {
  transform: scale(0.95);
}
```

#### 1.5 Sticky Footer
```css
.cart-page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 2px solid #e0e0e0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
  transition: transform 0.3s ease;
}

.cart-page-footer.hide {
  transform: translateY(100%);
}

/* Footer left section */
.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #AF7928;
}

.footer-select-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.footer-divider {
  width: 2px;
  height: 24px;
  background-color: #e0e0e0;
}

.footer-delete-btn {
  background-color: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.footer-delete-btn:hover {
  background-color: #dc3545;
  color: white;
}

.footer-delete-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Footer right section */
.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-total-label {
  font-size: 14px;
  color: #666;
}

.footer-total-price {
  font-size: 24px;
  font-weight: 700;
  color: #AF7928;
}

.footer-checkout-btn {
  background-color: #AF7928;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-checkout-btn:hover:not(:disabled) {
  background-color: #8f6320;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(175, 121, 40, 0.3);
}

.footer-checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### 1.6 Loading & Empty States
```css
/* Loading spinner */
.cart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.cart-loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #AF7928;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cart-loading-text {
  font-size: 16px;
  color: #666;
}

/* Empty cart state */
.cart-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: white;
  border-radius: 12px;
  padding: 60px 20px;
}

.cart-empty-icon {
  font-size: 80px;
  color: #ccc;
  margin-bottom: 20px;
}

.cart-empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.cart-empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.cart-empty-btn {
  background-color: #AF7928;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cart-empty-btn:hover {
  background-color: #8f6320;
}
```

#### 1.7 Error Messages
```css
.cart-error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-error-icon {
  font-size: 20px;
}
```

#### 1.8 Responsive Design
```css
/* Tablet */
@media (max-width: 768px) {
  .cart-page-wrapper {
    padding: 12px;
    padding-bottom: 140px;
  }

  .cart-item-card {
    flex-wrap: wrap;
    gap: 12px;
  }

  .cart-item-divider {
    display: none;
  }

  .cart-item-image {
    width: 80px;
    height: 80px;
  }

  .cart-item-trash {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .cart-page-footer {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }

  .footer-right {
    width: 100%;
    justify-content: space-between;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .cart-title-text {
    font-size: 20px;
  }

  .cart-item-card {
    padding: 12px;
  }

  .cart-item-image {
    width: 70px;
    height: 70px;
  }

  .cart-item-product {
    font-size: 14px;
  }

  .cart-item-price {
    font-size: 16px;
  }

  .cart-item-quantity button {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .footer-total-price {
    font-size: 20px;
  }

  .footer-checkout-btn {
    padding: 10px 24px;
    font-size: 14px;
  }
}
```

---

### **TASK 2: Redesign page.tsx with New Design + Full Functionality**

Replace `src/app/cart/page.tsx` with this implementation:

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaShoppingCart, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { useCartStore } from "@/store/cartStore";
import "./cart2.css";

export default function CartPage() {
  const router = useRouter();
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Zustand store
  const {
    items,
    subtotal,
    itemCount,
    isLoading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  // Local state for selection
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hideCartFooter, setHideCartFooter] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Intersection observer for footer
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideCartFooter(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Selection handlers
  const toggleSelectItem = (productId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectAllItems = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(items.map((item) => item.productId)));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Quantity handlers
  const handleIncrement = async (productId: string, currentQty: number, maxStock: number) => {
    if (currentQty < maxStock) {
      await updateQuantity(productId, currentQty + 1);
    }
  };

  const handleDecrement = async (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      await updateQuantity(productId, currentQty - 1);
    }
  };

  // Delete handlers
  const handleDeleteItem = async (productId: string) => {
    if (confirm("Remove this item from cart?")) {
      await removeItem(productId);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`Delete ${selectedItems.size} selected item(s)?`)) {
      const deletePromises = Array.from(selectedItems).map((id) =>
        removeItem(id)
      );
      await Promise.all(deletePromises);
      setSelectedItems(new Set());
    }
  };

  // Checkout handler
  const handleCheckout = () => {
    const selectedItemsArray = items.filter((item) =>
      selectedItems.has(item.productId)
    );

    if (selectedItemsArray.length === 0) {
      alert("Please select items to checkout");
      return;
    }

    // Navigate to checkout with selected items
    router.push("/checkout");
  };

  // Calculate selected totals
  const selectedTotal = items
    .filter((item) => selectedItems.has(item.productId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedCount = selectedItems.size;
  const allSelected = items.length > 0 && selectedCount === items.length;

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-page-wrapper">
          <div className="cart-loading">
            <div className="cart-loading-spinner"></div>
            <p className="cart-loading-text">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-page-wrapper">
          <div className="cart-title-bar">
            <FaShoppingCart className="cart-title-icon" />
            <span className="cart-title-text">Shopping Cart</span>
          </div>

          <div className="cart-empty-state">
            <FaShoppingCart className="cart-empty-icon" />
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-text">
              Discover amazing local products and add them to your cart!
            </p>
            <button
              className="cart-empty-btn"
              onClick={() => router.push("/marketplace")}
            >
              Browse Marketplace
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Main cart view
  return (
    <>
      <Navbar />
      <div className="cart-page-wrapper">
        {/* Title Bar */}
        <div className="cart-title-bar">
          <FaShoppingCart className="cart-title-icon" />
          <span className="cart-title-text">Shopping Cart</span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="cart-error-message">
            <FaExclamationCircle className="cart-error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Cart Items */}
        <div className="cart-items-container">
          {items.map((item) => (
            <div key={item.productId} className="cart-item-card">
              {/* Checkbox */}
              <input
                type="checkbox"
                className="cart-item-checkbox"
                checked={selectedItems.has(item.productId)}
                onChange={() => toggleSelectItem(item.productId)}
                disabled={isLoading}
              />

              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />

              {/* Divider */}
              <div className="cart-item-divider" />

              {/* Item Info */}
              <div className="cart-item-info">
                <span className="cart-item-artist">{item.artistName}</span>
                <span className="cart-item-product">{item.name}</span>
                <span className="cart-item-price">₱{item.price.toFixed(2)}</span>

                {/* Quantity Controls */}
                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleDecrement(item.productId, item.quantity)}
                    disabled={isLoading || item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleIncrement(item.productId, item.quantity, item.maxStock)
                    }
                    disabled={isLoading || item.quantity >= item.maxStock}
                    aria-label="Increase quantity"
                    title={
                      item.quantity >= item.maxStock
                        ? "Maximum stock reached"
                        : ""
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <button
                className="cart-item-trash"
                onClick={() => handleDeleteItem(item.productId)}
                disabled={isLoading}
                aria-label="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className={`cart-page-footer ${hideCartFooter ? "hide" : ""}`}>
        {/* Left Section */}
        <div className="footer-left">
          <input
            type="checkbox"
            className="footer-checkbox"
            checked={allSelected}
            onChange={(e) => selectAllItems(e.target.checked)}
            disabled={isLoading}
          />
          <span className="footer-select-text">
            Select All ({selectedCount})
          </span>
          <div className="footer-divider" />
          <button
            className="footer-delete-btn"
            onClick={handleDeleteSelected}
            disabled={isLoading || selectedCount === 0}
          >
            Delete
          </button>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <span className="footer-total-label">
            Total ({selectedCount} {selectedCount === 1 ? "item" : "items"}):
          </span>
          <span className="footer-total-price">
            ₱{selectedTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </span>
          <button
            className="footer-checkout-btn"
            onClick={handleCheckout}
            disabled={isLoading || selectedCount === 0}
          >
            Check Out
          </button>
        </div>
      </div>

      {/* Page Footer with ref */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
}
```

---

### **TASK 3: Update Imports in package.json (if needed)**

Ensure `react-icons` is installed:

```bash
npm install react-icons
```

---

## ✅ Features Checklist

### Core Functionality (Maintained)
- [ ] Cart fetches from `/api/cart` on mount
- [ ] Quantity increment/decrement with API sync
- [ ] Stock limit validation (disable increment at maxStock)
- [ ] Individual item removal with confirmation
- [ ] Loading states during API calls
- [ ] Error handling and display
- [ ] Empty cart state with CTA
- [ ] Navigation to checkout page

### New Features (Added)
- [ ] Individual item checkbox selection
- [ ] "Select All" functionality in footer
- [ ] Bulk delete selected items
- [ ] Sticky footer that hides when page footer is visible
- [ ] Only selected items included in checkout
- [ ] Selected items total calculation
- [ ] Modern card-based UI with vertical dividers
- [ ] Smooth hover animations
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Proper loading spinner
- [ ] Clean typography and spacing
- [ ] Brand color integration (#AF7928)

---

## 🎨 Design Specifications

### Colors
- **Primary Brand**: `#AF7928` (Grow Lokal gold)
- **Text Primary**: `#333`
- **Text Secondary**: `#666`, `#888`
- **Background**: `#f5f5f5`
- **Card Background**: `white`
- **Border**: `#e0e0e0`
- **Error**: `#dc3545`
- **Success**: `#28a745`

### Typography
- **Title**: 24px, weight 600
- **Product Name**: 16px, weight 600
- **Price**: 18px, weight 700
- **Artist**: 12px, uppercase, letter-spacing 0.5px
- **Body**: 14-16px

### Spacing
- **Card Padding**: 16px
- **Gap Between Cards**: 16px
- **Border Radius**: 8-12px
- **Footer Padding**: 16px 24px

### Animations
- **Hover Transform**: `translateY(-2px)`
- **Transition**: `all 0.2s ease` or `all 0.3s ease`
- **Loading Spinner**: 1s linear infinite rotation

---

## 🧪 Testing Requirements

### Manual Testing
1. **Load cart**: Verify items fetch from API
2. **Select items**: Check individual and "select all" checkboxes
3. **Quantity changes**: Test increment/decrement with API sync
4. **Stock limits**: Verify buttons disable at limits
5. **Delete item**: Confirm individual deletion works
6. **Bulk delete**: Select multiple items and delete
7. **Checkout**: Only selected items should proceed
8. **Empty cart**: Test empty state UI
9. **Loading states**: Verify spinners during API calls
10. **Error handling**: Test with API failures
11. **Responsive**: Test on mobile, tablet, desktop
12. **Footer behavior**: Scroll to bottom and verify footer hides
13. **Accessibility**: Test keyboard navigation and screen readers

### Edge Cases
- Cart with 0 items
- Cart with 1 item (singular "item" text)
- All items selected vs partial selection
- API errors during operations
- Maximum stock reached
- Minimum quantity (1) reached
- Slow network conditions

---

## 🚀 Implementation Steps

1. **Create cart2.css**: Copy all CSS from Section 1 above
2. **Backup page.tsx**: Save current version as `page.backup.tsx`
3. **Replace page.tsx**: Implement new code from Task 2
4. **Update import**: Change `import "./cart.css"` to `import "./cart2.css"`
5. **Install dependencies**: Run `npm install react-icons` if needed
6. **Test thoroughly**: Go through testing checklist
7. **Fix bugs**: Address any issues found during testing
8. **Deploy**: Push changes to production after validation

---

## 📚 Additional Enhancements (Optional)

### Nice-to-Have Features
- [ ] Toast notifications for success/error messages
- [ ] Smooth scroll animations
- [ ] Item count badge animation
- [ ] Undo delete functionality
- [ ] Save for later feature
- [ ] Product recommendations in empty cart
- [ ] Shipping cost estimator
- [ ] Promo code input in footer
- [ ] Item image zoom on hover
- [ ] Skeleton loading placeholders

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: Footer doesn't hide when scrolling  
**Solution**: Check if `footerRef` is properly attached and IntersectionObserver is working

**Issue**: Selected items not persisting  
**Solution**: Selection state is local only (by design) - resets on page refresh

**Issue**: Quantity update fails  
**Solution**: Verify API endpoint `/api/cart` PUT method is working

**Issue**: Checkboxes not working  
**Solution**: Ensure `selectedItems` Set is properly updating

**Issue**: Styles not applying  
**Solution**: Confirm `cart2.css` import path is correct

---

## 📝 Notes

- The design prioritizes **user experience** with modern UI patterns
- **Performance** is optimized with proper React patterns (no unnecessary re-renders)
- **Accessibility** is considered with proper ARIA labels and keyboard support
- **Mobile-first** approach ensures great experience on all devices
- Integration with existing **Zustand store** maintains state management consistency
- All **API calls** use existing endpoints - no backend changes needed

---

## 🎯 Success Criteria

The implementation is successful when:
1. ✅ All existing cart functionality works
2. ✅ New selection features work smoothly
3. ✅ Sticky footer behaves correctly
4. ✅ Design matches page2.tsx reference
5. ✅ Responsive on all screen sizes
6. ✅ No console errors or warnings
7. ✅ Loading states are clear
8. ✅ Error handling is robust
9. ✅ Code is clean and maintainable
10. ✅ Testing checklist is complete

---

**Ready to implement? Follow the tasks in order and test thoroughly at each step!** 🚀
