# 🛒 CHECKOUT PAGE - NEW DESIGN IMPLEMENTATION PROMPT

## 📋 Project Overview
Create a complete, modern checkout page for Grow-Lokal marketplace with full backend integration, comprehensive functionality, and professional UX design.

---

## 🎨 Design Requirements

### Color Scheme
- **Primary Brown**: `#AF7928` (buttons, accents, highlights)
- **Dark Green**: `#2e3f36` (headers, titles, borders)
- **Background**: `#f8f8f8` (page background)
- **White**: `#ffffff` (cards, sections)
- **Success Green**: `#00a699` (confirmations)
- **Error Red**: `#e74c3c` (errors, warnings)

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│                 NAVBAR                          │
├─────────────────────────────────────────────────┤
│  🛒 Checkout                                    │
├─────────────────────────────────────────────────┤
│  📍 Delivery Address              [Change]      │
│  Name | Phone                                   │
│  Full Address                                   │
├─────────────────────────────────────────────────┤
│  Products Ordered | Price | Qty | Subtotal     │
│  [Product 1 with image]                         │
│  [Product 2 with image]                         │
│  ─────────────────────────────────              │
│  🚚 Shipping Option          [Change] ₱XX.XX   │
│     Standard Shipping                           │
│     Receive by: Jan 15                          │
│     Guaranteed: 3-5 business days               │
│  ─────────────────────────────────              │
│  🎟️ Grow-Lokal Voucher    [Select Voucher]    │
│     Or: [VOUCHER2024] -₱50 [×]                 │
│  ─────────────────────────────────              │
│  💬 Message to Seller (Optional)               │
│     [Text input - 200 char limit]               │
│  ─────────────────────────────────              │
│  Order Total (X items): ₱XXX.XX                │
├─────────────────────────────────────────────────┤
│  💳 Payment Method                              │
│  [Cash on Delivery] [Credit/Debit] [E-Wallet]  │
│                                                 │
│  Payment Info Box / Instructions                │
│                                                 │
│  ┌──────────────────────────┐                  │
│  │ Merchandise: ₱XXX.XX     │                  │
│  │ Shipping:    ₱XX.XX      │                  │
│  │ Discount:   -₱XX.XX      │                  │
│  │ ─────────────────────    │                  │
│  │ Total:       ₱XXX.XX     │                  │
│  └──────────────────────────┘                  │
│                                                 │
│            [Place Order]                        │
├─────────────────────────────────────────────────┤
│                 FOOTER                          │
└─────────────────────────────────────────────────┘
```

---

## ⚙️ Core Functionality Requirements

### 1. **User Authentication & Session**
- ✅ Use NextAuth `useSession()` for authentication
- ✅ Redirect to login if not authenticated
- ✅ Display user name and email
- ✅ Load user profile data from API

### 2. **Cart Integration**
- ✅ Load checkout items from Zustand cart store OR sessionStorage
- ✅ Display cart items with:
  - Product image
  - Product name
  - Artist/Seller name
  - Unit price
  - Quantity
  - Item subtotal
- ✅ Calculate totals dynamically
- ✅ Handle empty cart state (redirect to cart)

### 3. **Delivery Address Management**
```typescript
interface UserAddress {
  street: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}
```
- ✅ Fetch user addresses from `/api/user/profile`
- ✅ Display primary/default address
- ✅ "Change" button opens address selection modal
- ✅ Modal shows all saved addresses
- ✅ Click to select different address
- ✅ Highlight selected address
- ✅ Add new address option (optional)
- ✅ **TEST DATA**: Auto-fill with test address for development:
  ```typescript
  {
    street: "123 Test Street",
    barangay: "Barangay Sample",
    city: "Manila",
    province: "Metro Manila",
    postalCode: "1000",
    phone: "+63 912 345 6789"
  }
  ```

### 4. **Shipping Options**
```typescript
interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description?: string;
}
```
**Options to Implement:**
1. **Standard Shipping**: ₱58 (3-5 business days)
2. **Express Shipping**: ₱75 (2-3 business days)
3. **Priority Shipping**: ₱120 (1-2 business days)

**Features:**
- ✅ Display selected shipping option
- ✅ Show estimated delivery date
- ✅ "Change" button opens shipping modal
- ✅ Modal with radio buttons for selection
- ✅ Update total when shipping changes
- ✅ Display shipping fee separately

### 5. **Voucher System**
```typescript
interface Voucher {
  code: string;
  discount: number;
  type: 'fixed' | 'percentage';
  minPurchase?: number;
  maxDiscount?: number;
}
```
**Features:**
- ✅ "Select Voucher" button
- ✅ Input field or modal for voucher code
- ✅ Apply voucher via API: `POST /api/vouchers/validate`
- ✅ Display applied voucher as green pill: `[CODE] -₱XX [×]`
- ✅ Remove button to clear voucher
- ✅ Show discount in payment summary
- ✅ Validate voucher conditions (min purchase, expiry)
- ✅ **TEST VOUCHER**: `GROWLOKAL10` = ₱50 discount

**API Endpoint:**
```typescript
// POST /api/vouchers/validate
{
  code: string,
  subtotal: number
}
// Response
{
  valid: boolean,
  discount: number,
  message?: string
}
```

### 6. **Message to Seller**
- ✅ Optional text input field
- ✅ 200 character limit
- ✅ Character counter display
- ✅ Placeholder: "Leave a message for the seller..."
- ✅ Include in order metadata

### 7. **Payment Methods**

#### A. Cash on Delivery (COD)
- ✅ Radio button selection
- ✅ Info box: "Pay with cash when delivered"
- ✅ No additional fees
- ✅ Redirect to: `/profile?section=orders`

#### B. Credit/Debit Card (PayMongo)
- ✅ Radio button selection
- ✅ Info box: "Secure payment via PayMongo"
- ✅ Supported cards: Visa, Mastercard, JCB
- ✅ Flow:
  1. Create order first
  2. Get order ID from response
  3. Redirect to: `/payment/[orderId]`
  4. Existing payment page handles card input

#### C. E-Wallet (PayMongo)
- ✅ Radio button selection
- ✅ Display PayMongo logo
- ✅ Info: "GCash, PayMaya, GrabPay support"
- ✅ 2% processing fee notification
- ✅ Redirect to: `/verification-payment`

### 8. **Order Creation**
```typescript
interface OrderData {
  userId: string;
  items: OrderItem[];
  shippingAddress: UserAddress;
  shippingOption: ShippingOption;
  paymentMethod: 'cod' | 'card' | 'ewallet';
  voucher?: {
    code: string;
    discount: number;
  };
  messageToSeller?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}
```

**API Endpoint:**
```typescript
// POST /api/orders
{
  items: [
    {
      productId: string,
      quantity: number,
      price: number,
      name: string,
      artistName: string,
      image: string
    }
  ],
  shippingAddress: UserAddress,
  shippingOption: ShippingOption,
  paymentMethod: string,
  voucher?: { code: string, discount: number },
  messageToSeller?: string,
  subtotal: number,
  shippingFee: number,
  discount: number,
  total: number
}

// Response
{
  success: boolean,
  data: {
    orderId: string,    // e.g., "ORD-20250105-XXXXX"
    _id: string,        // MongoDB ID
    total: number,
    status: string
  }
}
```

### 9. **Order Placement Flow**
1. **Validate Inputs:**
   - Payment method selected
   - Delivery address exists
   - Cart has items
   
2. **Create Order:**
   - Call `POST /api/orders`
   - Get order ID from response
   
3. **Clear Cart:**
   - Call cart store's `clearCart()`
   - Remove sessionStorage checkout data
   
4. **Show Success Modal:**
   - Display for 1.5 seconds
   - Conditional message based on payment type
   
5. **Redirect:**
   - COD → `/profile?section=orders`
   - Card → `/payment/[orderId]`
   - E-wallet → `/verification-payment`

---

## 🔧 Backend Requirements

### API Endpoints Needed

#### 1. User Profile API
```typescript
// GET /api/user/profile
// Returns: { name, email, address, phone, savedAddresses[] }
```

#### 2. Orders API
```typescript
// POST /api/orders
// Create new order with all metadata
// Returns: { orderId, _id, total, status }
```

#### 3. Voucher Validation API
```typescript
// POST /api/vouchers/validate
// Body: { code, subtotal }
// Returns: { valid, discount, message }
```

#### 4. Cart API (Already exists)
```typescript
// GET /api/cart - Get user's cart
// DELETE /api/cart - Clear cart after order
```

### Database Schema

#### Order Model
```javascript
const orderSchema = new Schema({
  orderId: { type: String, unique: true }, // ORD-20250105-XXXXX
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
    name: String,
    artistName: String,
    image: String
  }],
  shippingAddress: {
    street: String,
    barangay: String,
    city: String,
    province: String,
    postalCode: String,
    phone: String
  },
  shippingOption: {
    id: String,
    name: String,
    price: Number,
    estimatedDays: String
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'ewallet']
  },
  voucher: {
    code: String,
    discount: Number
  },
  messageToSeller: String,
  subtotal: Number,
  shippingFee: Number,
  discount: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  trackingNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});
```

#### Voucher Model
```javascript
const voucherSchema = new Schema({
  code: { type: String, unique: true },
  type: { type: String, enum: ['fixed', 'percentage'] },
  discount: Number,
  minPurchase: Number,
  maxDiscount: Number,
  validFrom: Date,
  validUntil: Date,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});
```

---

## 🎯 State Management

### React State Variables
```typescript
// Checkout data
const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
const [userAddress, setUserAddress] = useState<UserAddress | null>(null);
const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);

// UI states
const [isLoading, setIsLoading] = useState(true);
const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState("");

// Modals
const [showAddressModal, setShowAddressModal] = useState(false);
const [showShippingModal, setShowShippingModal] = useState(false);
const [showVoucherModal, setShowVoucherModal] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);

// Selections
const [selectedPayment, setSelectedPayment] = useState("");
const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);

// Voucher
const [voucherCode, setVoucherCode] = useState("");
const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
const [voucherError, setVoucherError] = useState("");

// Message
const [messageToSeller, setMessageToSeller] = useState("");
```

### Zustand Cart Store Integration
```typescript
import { useCartStore } from "@/store/cartStore";

const { items, clearCart, fetchCart } = useCartStore();
```

---

## 🧩 Component Structure

### Main Component
```tsx
export default function CheckoutPage() {
  // 1. Hooks & State
  // 2. Load checkout data on mount
  // 3. Handler functions
  // 4. Calculations
  // 5. Render loading state
  // 6. Render empty state
  // 7. Render main checkout UI
  // 8. Render modals
}
```

### Key Functions

#### loadCheckoutData()
```typescript
const loadCheckoutData = async () => {
  try {
    setIsLoading(true);
    
    // Load cart from sessionStorage or API
    const storedCart = sessionStorage.getItem("checkoutCart");
    if (storedCart) {
      setCheckoutItems(JSON.parse(storedCart));
    } else {
      // Fetch from cart API
      await fetchCart();
      setCheckoutItems(items);
    }
    
    // Load user address with test fallback
    const testAddress = { /* test data */ };
    setUserAddress(testAddress);
    
    // Try to fetch real data
    if (session?.user) {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          setUserAddress(data.address);
          setSavedAddresses(data.savedAddresses || []);
        }
      }
    }
  } catch (error) {
    setError("Failed to load checkout data");
  } finally {
    setIsLoading(false);
  }
};
```

#### handleApplyVoucher()
```typescript
const handleApplyVoucher = async () => {
  try {
    const response = await fetch("/api/vouchers/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: voucherCode,
        subtotal: subtotal
      })
    });
    
    const data = await response.json();
    
    if (data.valid) {
      setAppliedVoucher({
        code: voucherCode,
        discount: data.discount
      });
      setVoucherCode("");
      setVoucherError("");
    } else {
      setVoucherError(data.message || "Invalid voucher");
    }
  } catch (error) {
    setVoucherError("Failed to validate voucher");
  }
};
```

#### handlePlaceOrder()
```typescript
const handlePlaceOrder = async () => {
  // Validate
  if (!selectedPayment) {
    alert("Please select a payment method");
    return;
  }
  
  if (!userAddress) {
    alert("Please provide a delivery address");
    return;
  }
  
  try {
    setIsProcessing(true);
    
    // Prepare order data
    const orderData = {
      items: checkoutItems,
      shippingAddress: userAddress,
      shippingOption: selectedShipping,
      paymentMethod: selectedPayment,
      voucher: appliedVoucher,
      messageToSeller: messageToSeller,
      subtotal: subtotal,
      shippingFee: shippingFee,
      discount: discount,
      total: total
    };
    
    // Create order
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    // Clear cart
    await clearCart();
    sessionStorage.removeItem("checkoutCart");
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Redirect after delay
    setTimeout(() => {
      if (selectedPayment === "card") {
        router.push(`/payment/${result.data.orderId || result.data._id}`);
      } else if (selectedPayment === "ewallet") {
        router.push("/verification-payment");
      } else {
        router.push("/profile?section=orders");
      }
    }, 1500);
    
  } catch (error) {
    setError("Failed to place order. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};
```

---

## 🎨 UI Components

### 1. Address Card
```tsx
<div className="checkout-address-card">
  <div className="address-header">
    <FaMapMarkerAlt className="address-icon" />
    <span className="address-title">Delivery Address</span>
    <button onClick={() => setShowAddressModal(true)}>
      Change
    </button>
  </div>
  
  {userAddress && (
    <div className="address-details">
      <div className="address-name">{session?.user?.name}</div>
      <div className="address-phone">{userAddress.phone}</div>
      <div className="address-text">
        {userAddress.street}, {userAddress.barangay}, 
        {userAddress.city}, {userAddress.province} {userAddress.postalCode}
      </div>
    </div>
  )}
</div>
```

### 2. Shipping Section
```tsx
<div className="checkout-shipping-section">
  <div className="shipping-header">
    <span>Shipping Option</span>
    <button onClick={() => setShowShippingModal(true)}>
      Change
    </button>
  </div>
  
  <div className="shipping-details">
    <div className="shipping-name">{selectedShipping.name}</div>
    <div className="shipping-estimate">
      Receive by {getEstimatedDelivery()}
    </div>
    <div className="shipping-guarantee">
      Guaranteed: {selectedShipping.estimatedDays}
    </div>
  </div>
  
  <div className="shipping-fee">₱{shippingFee.toFixed(2)}</div>
</div>
```

### 3. Voucher Section
```tsx
<div className="checkout-voucher-section">
  <span className="voucher-label">Grow-Lokal Voucher</span>
  
  {appliedVoucher ? (
    <div className="voucher-applied">
      <span className="voucher-code">{appliedVoucher.code}</span>
      <span className="voucher-discount">-₱{appliedVoucher.discount}</span>
      <button onClick={handleRemoveVoucher}>✕</button>
    </div>
  ) : (
    <button onClick={() => setShowVoucherModal(true)}>
      Select Voucher
    </button>
  )}
</div>
```

### 4. Message Input
```tsx
<div className="checkout-message-section">
  <label>Message to Seller (Optional)</label>
  <input
    type="text"
    placeholder="Leave a message for the seller..."
    value={messageToSeller}
    onChange={(e) => setMessageToSeller(e.target.value.slice(0, 200))}
    maxLength={200}
  />
  <div className="char-counter">{messageToSeller.length}/200</div>
</div>
```

### 5. Payment Methods
```tsx
<div className="payment-buttons">
  <button
    className={`payment-btn ${selectedPayment === "cod" ? "active" : ""}`}
    onClick={() => setSelectedPayment("cod")}
  >
    Cash on Delivery
  </button>
  
  <button
    className={`payment-btn ${selectedPayment === "card" ? "active" : ""}`}
    onClick={() => setSelectedPayment("card")}
  >
    Credit/Debit Card
  </button>
  
  <button
    className={`payment-btn ${selectedPayment === "ewallet" ? "active" : ""}`}
    onClick={() => setSelectedPayment("ewallet")}
  >
    E-Wallet
  </button>
</div>

{/* Payment info based on selection */}
{selectedPayment === "card" && (
  <div className="payment-info-box">
    <p>You will be redirected to our secure payment page.</p>
    <p>We accept Visa, Mastercard, and other major cards.</p>
  </div>
)}
```

### 6. Modals

#### Address Selection Modal
```tsx
{showAddressModal && (
  <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h3>Select Delivery Address</h3>
      
      <div className="address-list">
        {savedAddresses.map((address, index) => (
          <div
            key={index}
            className={`address-item ${selectedAddress === address ? "selected" : ""}`}
            onClick={() => handleSelectAddress(address)}
          >
            <div className="address-phone">{address.phone}</div>
            <div className="address-text">
              {address.street}, {address.barangay}, {address.city}
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={() => setShowAddressModal(false)}>
        Cancel
      </button>
    </div>
  </div>
)}
```

#### Shipping Options Modal
```tsx
{showShippingModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Select Shipping Option</h3>
      
      {shippingOptions.map((option) => (
        <div
          key={option.id}
          className={`shipping-option ${selectedShipping.id === option.id ? "selected" : ""}`}
          onClick={() => {
            setSelectedShipping(option);
            setShowShippingModal(false);
          }}
        >
          <div>
            <div className="option-name">{option.name}</div>
            <div className="option-days">{option.estimatedDays}</div>
          </div>
          <div className="option-price">₱{option.price}</div>
        </div>
      ))}
      
      <button onClick={() => setShowShippingModal(false)}>
        Cancel
      </button>
    </div>
  </div>
)}
```

#### Success Modal
```tsx
{showSuccessModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>🎉 Order Placed Successfully!</h3>
      <p>
        {selectedPayment === "card" 
          ? "Redirecting to payment page..." 
          : selectedPayment === "ewallet"
          ? "Redirecting to payment verification..."
          : "Thank you! You'll receive updates on your order."}
      </p>
    </div>
  </div>
)}
```

---

## 📱 Responsive Design

### Mobile (< 768px)
- Stack address details vertically
- Single column product grid
- Full-width buttons
- Modal takes 90% width
- Touch-friendly button sizes (min 44px)

### Tablet (768px - 1024px)
- 2-column layout for some sections
- Balanced spacing
- Modal at 70% width

### Desktop (> 1024px)
- Full layout as designed
- Hover effects on buttons
- Modal at 500-600px width
- Side-by-side payment info

---

## ✅ Validation & Error Handling

### Client-Side Validation
```typescript
// Before placing order
if (!selectedPayment) {
  alert("Please select a payment method");
  return;
}

if (!userAddress) {
  alert("Please provide a delivery address");
  return;
}

if (checkoutItems.length === 0) {
  alert("Your cart is empty");
  router.push("/cart");
  return;
}
```

### API Error Handling
```typescript
try {
  const response = await fetch("/api/orders", {...});
  
  if (!response.ok) {
    throw new Error("Failed to create order");
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Order creation failed");
  }
  
  // Success flow...
  
} catch (error) {
  console.error("Order error:", error);
  setError(error.message || "Failed to place order");
  setIsProcessing(false);
}
```

### Error Display
```tsx
{error && (
  <div className="error-banner">
    <i className="fas fa-exclamation-circle"></i>
    <span>{error}</span>
    <button onClick={() => setError("")}>✕</button>
  </div>
)}
```

---

## 🔒 Security Considerations

1. **Authentication:**
   - Verify user session before showing checkout
   - Use NextAuth protected API routes

2. **Data Validation:**
   - Validate all inputs server-side
   - Sanitize message to seller
   - Check voucher eligibility

3. **Payment Security:**
   - Never handle card details directly
   - Use PayMongo for PCI compliance
   - Secure payment page routing

4. **Order Integrity:**
   - Verify product availability
   - Check stock levels before order
   - Validate pricing on server

---

## 🧪 Testing Checklist

### Functionality Tests
- [ ] Load checkout with items from cart
- [ ] Load checkout with sessionStorage data
- [ ] Change delivery address
- [ ] Change shipping option
- [ ] Apply valid voucher
- [ ] Apply invalid voucher
- [ ] Remove applied voucher
- [ ] Type message to seller (200 char limit)
- [ ] Select COD payment → Place order → Redirect
- [ ] Select Card payment → Place order → Redirect to payment
- [ ] Select E-wallet → Place order → Redirect to verification
- [ ] Empty cart handling
- [ ] API error handling

### UI Tests
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Modals open/close correctly
- [ ] Click outside modal to close
- [ ] Button states (hover, active, disabled)
- [ ] Loading spinner displays
- [ ] Success modal appears
- [ ] Error messages display

### Integration Tests
- [ ] Cart store integration
- [ ] Session management
- [ ] API calls succeed
- [ ] Order creation in database
- [ ] Payment page receives order ID
- [ ] Cart clears after order

---

## 📦 Implementation Steps

### Phase 1: Setup (Day 1)
1. Create checkout page component
2. Set up state management
3. Create TypeScript interfaces
4. Import necessary dependencies

### Phase 2: UI Layout (Day 1-2)
1. Build address card
2. Build product list section
3. Build shipping section
4. Build voucher section
5. Build message input
6. Build payment section
7. Build modals

### Phase 3: Backend (Day 2-3)
1. Create/update Orders API
2. Create Voucher validation API
3. Update User profile API
4. Test API endpoints

### Phase 4: Integration (Day 3-4)
1. Connect cart store
2. Implement loadCheckoutData()
3. Implement handlePlaceOrder()
4. Implement voucher validation
5. Implement address selection
6. Implement shipping selection

### Phase 5: Testing (Day 4-5)
1. Unit test components
2. Integration testing
3. End-to-end testing
4. Mobile responsiveness
5. Error scenarios

### Phase 6: Polish (Day 5)
1. Add loading states
2. Add transitions
3. Optimize performance
4. Add accessibility features
5. Final QA

---

## 📚 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "next-auth": "^4.0.0",
    "zustand": "^4.0.0",
    "react-icons": "^4.0.0"
  }
}
```

---

## 🎯 Success Criteria

✅ User can complete checkout with all payment methods
✅ Order is created in database with all details
✅ Cart is cleared after successful order
✅ User is redirected to appropriate page
✅ All validations work correctly
✅ Error handling is comprehensive
✅ UI is responsive and user-friendly
✅ Payment integration works seamlessly
✅ Test data auto-fills for development

---

## 📝 Notes

- Use existing PayMongo integration for card payments
- Maintain consistency with cart page design
- Follow brown theme throughout
- Prioritize mobile-first design
- Keep loading states minimal
- Test with real API data when available
- Document all API endpoints used

---

## 🚀 Quick Start Command

```bash
# After implementing, test with:
npm run dev

# Navigate to:
http://localhost:3000/checkout

# Test flow:
1. Add items to cart
2. Go to checkout
3. Select shipping
4. Apply voucher: GROWLOKAL10
5. Add message to seller
6. Select payment method
7. Place order
8. Verify redirect
```

---

**This prompt provides everything needed to build a complete, production-ready checkout page with full backend integration!** 🎉
