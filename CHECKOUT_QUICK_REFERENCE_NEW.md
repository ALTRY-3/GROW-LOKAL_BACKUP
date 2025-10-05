# 🛒 CHECKOUT - QUICK IMPLEMENTATION REFERENCE

## 🎯 Essential Features Checklist

### Must-Have Features
- [x] User authentication with NextAuth
- [x] Load cart items (sessionStorage + API)
- [x] Delivery address with test data fallback
- [x] 3 shipping options (₱58/₱75/₱120)
- [x] Voucher system (GROWLOKAL10 = ₱50 off)
- [x] Message to seller (200 char limit)
- [x] 3 payment methods (COD/Card/E-wallet)
- [x] Order creation API
- [x] Cart clearing after order
- [x] Conditional redirects

## ⚡ Quick Copy-Paste Snippets

### Test Address
```typescript
const testAddress = {
  street: "123 Test Street",
  barangay: "Barangay Sample",
  city: "Manila",
  province: "Metro Manila",
  postalCode: "1000",
  phone: "+63 912 345 6789"
};
```

### Shipping Options
```typescript
const shippingOptions = [
  { id: "standard", name: "Standard Shipping", price: 58, estimatedDays: "3-5 business days" },
  { id: "express", name: "Express Shipping", price: 75, estimatedDays: "2-3 business days" },
  { id: "priority", name: "Priority Shipping", price: 120, estimatedDays: "1-2 business days" }
];
```

### Order API Call
```typescript
const response = await fetch("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    items: checkoutItems,
    shippingAddress: userAddress,
    shippingOption: selectedShipping,
    paymentMethod: selectedPayment,
    voucher: appliedVoucher,
    messageToSeller: messageToSeller,
    subtotal, shippingFee, discount, total
  })
});

const result = await response.json();
// result.data.orderId or result.data._id
```

### Redirect Logic
```typescript
setTimeout(() => {
  if (selectedPayment === "card") {
    router.push(`/payment/${orderId}`);
  } else if (selectedPayment === "ewallet") {
    router.push("/verification-payment");
  } else {
    router.push("/profile?section=orders");
  }
}, 1500);
```

## 🎨 Colors
- Brown: `#AF7928`
- Green: `#2e3f36`
- Background: `#f8f8f8`
- Success: `#00a699`
- Error: `#e74c3c`

## 📋 State Variables
```typescript
const [checkoutItems, setCheckoutItems] = useState([]);
const [userAddress, setUserAddress] = useState(null);
const [selectedPayment, setSelectedPayment] = useState("");
const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
const [appliedVoucher, setAppliedVoucher] = useState(null);
const [messageToSeller, setMessageToSeller] = useState("");
const [isProcessing, setIsProcessing] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
```

## 🔧 Key Functions

### Load Data
```typescript
useEffect(() => {
  loadCheckoutData();
}, []);

const loadCheckoutData = async () => {
  const storedCart = sessionStorage.getItem("checkoutCart");
  if (storedCart) setCheckoutItems(JSON.parse(storedCart));
  setUserAddress(testAddress); // fallback
  // Fetch real data if session exists
};
```

### Place Order
```typescript
const handlePlaceOrder = async () => {
  if (!selectedPayment || !userAddress) return alert("Please complete form");
  
  setIsProcessing(true);
  const response = await fetch("/api/orders", { /* ... */ });
  const result = await response.json();
  
  await clearCart();
  sessionStorage.removeItem("checkoutCart");
  setShowSuccessModal(true);
  
  setTimeout(() => { /* redirect logic */ }, 1500);
};
```

## 🚀 Implementation Order
1. ✅ Set up page structure & imports
2. ✅ Create state variables
3. ✅ Add loadCheckoutData function
4. ✅ Build address card UI
5. ✅ Build product list UI
6. ✅ Add shipping section with modal
7. ✅ Add voucher section
8. ✅ Add message input
9. ✅ Build payment methods UI
10. ✅ Add handlePlaceOrder function
11. ✅ Create all modals
12. ✅ Test full flow

## 🧪 Test Flow
1. Add items to cart
2. Navigate to /checkout
3. Verify test address appears
4. Change shipping option
5. Apply voucher: `GROWLOKAL10`
6. Type message to seller
7. Select payment method
8. Click Place Order
9. Verify success modal
10. Verify redirect works
11. Check order in database

## 📦 API Endpoints
- `GET /api/user/profile` - Get user data
- `POST /api/orders` - Create order
- `POST /api/vouchers/validate` - Validate voucher
- `DELETE /api/cart` - Clear cart

## 🎯 Success Indicators
✅ No console errors
✅ All modals work
✅ Order created in DB
✅ Cart cleared
✅ Correct redirect
✅ Mobile responsive
✅ Loading states show
✅ Validations work

---

**Full documentation: CHECKOUT_NEW_DESIGN_PROMPT.md**
