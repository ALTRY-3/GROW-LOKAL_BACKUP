# Checkout Page Implementation Prompt

## Overview
Transform the current checkout page design into a fully functional, API-integrated checkout system with complete backend connectivity, user authentication, payment processing, and order management while preserving the exact visual design.

## Current Design Analysis
The checkout page features:
- **Shopping cart icon and title** - Consistent with cart page branding
- **Delivery Address Card** - Shows user name, email, and full address with green border
- **Product Summary Card** - Grid layout with product details, quantities, prices
- **Payment Method Card** - Toggle between COD and E-Wallet with green border
- **PayMongo Integration** - Radio selection with logo and processing details
- **Order Summary** - Right-aligned payment breakdown
- **Place Order Button** - Green branded button with success modal
- **Success Modal** - Confirmation dialog with routing to orders or payment

## Implementation Requirements

### 1. User Session & Authentication
- **Fetch user from NextAuth session** using `getServerSession()`
- **Guest checkout support** with email collection
- **User profile integration** - Fetch full user details from database
- **Address management** - Load saved addresses or allow new address entry
- **Email validation** for guest checkouts

### 2. Cart Integration
- **Retrieve selected items** from sessionStorage (set by cart page)
- **Fallback to full cart** if no selection exists
- **Validate cart data** exists and has items
- **Calculate totals dynamically** from cart items
- **Handle empty checkout** state with redirect to cart

### 3. Data Structure Mapping
```typescript
// Current UI expects:
interface CheckoutItem {
  id: number;
  image: string;
  seller: string;
  product: string;
  price: number;
  quantity: number;
}

// API/Cart provides:
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artistName: string;
  maxStock: number;
}
```

### 4. Address Management
- **Load user's default address** from profile
- **Address editing modal/form** (future enhancement)
- **Address validation** - Ensure all required fields
- **Save address to profile** option for logged-in users
- **Guest address collection** with full form

### 5. Shipping Calculation
- **Fixed shipping fee** ($58 as shown in design)
- **Calculate shipping** based on location (future enhancement)
- **Free shipping threshold** option (future enhancement)
- **Multiple shipping options** (Standard, Express) (future enhancement)

### 6. Payment Method Integration

#### Cash on Delivery (COD)
- **Simple selection** - No additional validation
- **Order creation** with payment method = 'cod'
- **Payment status** = 'pending'

#### E-Wallet (PayMongo)
- **PayMongo API integration** required
- **Create payment intent** with order details
- **Redirect to payment page** for processing
- **Handle payment callbacks** and webhooks
- **Update order status** after payment confirmation
- **2% processing fee** display and calculation

### 7. Order Creation Flow
```typescript
1. Validate all form data (address, payment method, items)
2. Check product stock availability via API
3. Create order via POST /api/orders
4. Decrement product stock
5. Clear cart after successful order
6. Redirect based on payment method:
   - COD: → /profile?section=orders
   - E-Wallet: → /verification-payment (payment processing page)
```

### 8. Stock Validation
- **Pre-order validation** - Check stock before order creation
- **Handle stock changes** - Show error if items out of stock
- **Update cart** if stock is insufficient
- **Clear unavailable items** from checkout

### 9. Error Handling
- **API errors** - Network failures, server errors
- **Validation errors** - Missing fields, invalid data
- **Stock errors** - Out of stock, insufficient quantity
- **Payment errors** - Payment failed, timeout
- **User feedback** - Toast notifications or error messages

### 10. Loading States
- **Page loading** - While fetching cart/user data
- **Order processing** - During order creation
- **Payment processing** - During payment flow
- **Disabled states** - Prevent double submission

### 11. Success Flow
- **Show success modal** - Confirmation message
- **Auto-redirect** - After 1-2 seconds
- **Store order ID** - For tracking
- **Clear checkout data** - Clean up sessionStorage

## API Endpoints to Use

### GET /api/cart
- Fetch user's cart if no selection provided

### POST /api/orders
```typescript
{
  items: CartItem[],
  shippingAddress: {
    fullName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    province: string,
    postalCode: string,
    country: string
  },
  paymentMethod: 'cod' | 'card' | 'gcash',
  subtotal: number,
  shippingFee: number,
  total: number
}
```

### POST /api/paymongo/create-payment (if not exists, needs creation)
- Create PayMongo payment intent
- Return payment URL for redirect

## Implementation Tasks

### Phase 1: User & Cart Integration
1. Add NextAuth session handling
2. Fetch user profile from database
3. Load selected items from sessionStorage
4. Fallback to full cart if needed
5. Calculate totals dynamically

### Phase 2: Address Management
1. Display user's saved address
2. Add address validation
3. Handle guest address collection
4. Store address for logged-in users

### Phase 3: Payment Integration
1. Implement COD flow
2. Add PayMongo API integration
3. Create payment intent endpoint
4. Handle payment method selection
5. Add processing fee calculation

### Phase 4: Order Creation
1. Connect to POST /api/orders
2. Add stock validation before order
3. Handle order creation response
4. Clear cart after successful order
5. Store order ID for tracking

### Phase 5: Error Handling & UX
1. Add loading states
2. Implement error messages
3. Add success notifications
4. Handle all edge cases
5. Add form validation

### Phase 6: Testing & Polish
1. Test COD flow end-to-end
2. Test e-wallet flow
3. Test error scenarios
4. Test guest checkout
5. Create documentation

## Expected Code Structure

```typescript
export default function CheckoutPage() {
  // User session
  const { data: session, status } = useSession();
  
  // State management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load cart items and user data
  useEffect(() => {
    loadCheckoutData();
  }, []);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingFee;
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Validate
      if (!selectedPayment) throw new Error('Select payment method');
      if (!userAddress) throw new Error('Add delivery address');
      
      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: userAddress,
          paymentMethod: selectedPayment,
          subtotal,
          shippingFee,
          total
        })
      });
      
      const data = await response.json();
      
      if (!data.success) throw new Error(data.message);
      
      // Handle success
      if (selectedPayment === 'cod') {
        router.push('/profile?section=orders');
      } else {
        // Create payment and redirect
        router.push('/verification-payment');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
}
```

## Design Preservation
- ✅ Maintain exact layout and styling
- ✅ Keep green theme (#af7928) throughout
- ✅ Preserve all visual elements (borders, cards, spacing)
- ✅ Keep responsive grid layout
- ✅ Maintain modal animation and styling
- ✅ Preserve button states and hover effects

## Success Criteria
- ✅ Load cart items from cart page selection
- ✅ Display user information correctly
- ✅ COD payment flow works end-to-end
- ✅ E-wallet payment flow works end-to-end
- ✅ Order creation succeeds with stock validation
- ✅ Cart clears after successful order
- ✅ Proper error handling for all scenarios
- ✅ Loading states during operations
- ✅ Success modal and redirects work
- ✅ Design exactly matches current layout

## Files to Modify
- `src/app/checkout/page.tsx` - Main checkout component
- `src/app/checkout/checkout.css` - Styling (minimal changes)
- May need to create: `src/app/api/paymongo/create-payment/route.ts`

## Testing Requirements
- Test COD checkout flow
- Test e-wallet checkout flow  
- Test guest checkout
- Test logged-in user checkout
- Test stock validation errors
- Test payment errors
- Test empty cart scenarios
- Test address validation

This implementation will create a production-ready checkout page that combines your beautiful design with robust backend functionality!