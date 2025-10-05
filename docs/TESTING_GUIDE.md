# Quick Testing Guide - Card Payment Flow

## Prerequisites
- MongoDB running
- Development server running (`npm run dev`)
- PayMongo test keys in `.env.local` (optional for basic testing)

## Complete Flow Test (5 minutes)

### Step 1: Start Server
```bash
npm run dev
```
Navigate to: `http://localhost:3000`

### Step 2: Browse & Add to Cart
1. Go to Marketplace: `http://localhost:3000/marketplace`
2. Click any product (e.g., a handicraft item)
3. Product modal opens
4. Select quantity (e.g., 2)
5. Click **"Add to Cart"** button
6. Wait for "✓ Added!" message
7. Modal closes automatically
8. Notice cart badge in navbar shows "2"

### Step 3: View Cart
**Option A:** Click cart icon in navbar
**Option B:** Go directly to `http://localhost:3000/cart`

You should see:
- Product image
- Product name and artist
- Quantity controls (+ / -)
- Price
- Subtotal

### Step 4: Proceed to Checkout
1. Click **"Proceed to Checkout"** button
2. Redirected to: `http://localhost:3000/checkout`

### Step 5: Fill Shipping Form
Enter the following test data:

```
Full Name: Juan Dela Cruz
Email: juan@test.com
Phone: +63 912 345 6789
Address: 123 Test Street, Barangay Sample
City: Manila
Province: Metro Manila
Postal Code: 1000
Country: Philippines (pre-filled)
```

### Step 6: Select Payment Method
Choose: **"Credit/Debit Card"** (first option with credit card icon)

### Step 7: Review & Place Order
1. Check order summary on the right:
   - Items count
   - Subtotal
   - Shipping fee (FREE if over ₱1,000)
   - Total
2. Click **"Place Order"** button
3. Wait for processing (spinner shows)

### Step 8: Automatic Redirect to Payment
You'll be redirected to: `http://localhost:3000/payment/ORD-20250102-0001`

The payment page shows:
- Left: Card payment form
- Right: Order summary
- Top: Secure badge (green)

### Step 9: Enter Card Details
Use these TEST card details:

```
Card Number: 4343 4343 4343 4345
Expiry Month: 12
Expiry Year: 2025
CVC: 123
```

**Tips:**
- Card number auto-formats with spaces
- System accepts any future date
- System accepts any 3-4 digit CVC

### Step 10: Pay
1. Click **"Pay ₱XXX.XX"** button
2. Button shows "Processing..." with spinner
3. Wait 2-5 seconds

### Step 11: Success & Redirect
After successful payment:
- Alert: "Payment successful!"
- Redirected to: `http://localhost:3000/orders/ORD-20250102-0001`

### Step 12: View Order Details
You should see:
- Order ID
- Status badges:
  - Order Status: **PROCESSING** (blue)
  - Payment Status: **PAID** (green)
- Order items list
- Order summary (subtotal, shipping, total)
- Shipping address
- Payment information with transaction ID

---

## Testing Different Scenarios

### Scenario 1: Successful Payment ✅
**Card:** `4343 4343 4343 4345`
**Result:** Payment succeeds, order marked as paid

### Scenario 2: Failed Payment ❌
**Card:** `4571 7360 0000 0014`
**Result:** Payment fails with error message

### Scenario 3: Cash on Delivery 💵
**Steps:**
1. Select "Cash on Delivery" at checkout
2. Place order
3. Redirected directly to order details (no payment page)
4. Order status: pending
5. Payment status: pending

### Scenario 4: GCash 📱
**Steps:**
1. Select "GCash" at checkout
2. Place order
3. Redirected to order details
4. In production: would redirect to GCash login

---

## Quick URLs for Testing

| Page | URL |
|------|-----|
| Marketplace | `http://localhost:3000/marketplace` |
| Cart | `http://localhost:3000/cart` |
| Checkout | `http://localhost:3000/checkout` |
| Payment | `http://localhost:3000/payment/[orderId]` |
| Order Details | `http://localhost:3000/orders/[orderId]` |

---

## Expected Database Changes

After completing the flow:

**Products Collection:**
- Stock decremented by order quantity

**Cart Collection:**
- Cart cleared for the user

**Orders Collection:**
- New order created with:
  - Unique order ID (ORD-YYYYMMDD-XXXX)
  - Items array
  - Shipping address
  - Payment details
  - Status: processing
  - Payment status: paid

---

## Troubleshooting

### Problem: "Order not found" on payment page
**Solution:** 
- Check if MongoDB is running
- Verify order was created successfully
- Check browser console for errors

### Problem: "Payment failed" error
**Solution:**
- Verify you're using correct test card: `4343 4343 4343 4345`
- Check if PayMongo keys are in `.env.local`
- Check browser console and terminal for API errors

### Problem: Cart is empty at checkout
**Solution:**
- Go back to marketplace
- Add items to cart again
- Make sure you see cart badge update

### Problem: Payment page is blank
**Solution:**
- Check browser console for errors
- Verify payment page file exists: `src/app/payment/[orderId]/page.tsx`
- Check if order ID in URL is valid

### Problem: "Cannot read properties of null"
**Solution:**
- Restart development server
- Clear browser cache
- Clear localStorage: `localStorage.clear()` in console

---

## Video Walkthrough (Text Version)

```
1. Open browser → localhost:3000/marketplace
2. See 5 categories of products
3. Click "Bamboo Basket" product
4. Modal opens with product details
5. Quantity: 2
6. Click "Add to Cart"
7. See "✓ Added!" message
8. Cart badge shows "2"
9. Click cart icon
10. See "Bamboo Basket x 2" in dropdown
11. Click "GO TO CART"
12. See full cart page
13. Click "Proceed to Checkout"
14. Fill form with test data
15. Select "Credit/Debit Card"
16. Click "Place Order"
17. Redirected to payment page
18. Enter: 4343 4343 4343 4345
19. Enter: 12 / 2025 / 123
20. Click "Pay ₱XXX.XX"
21. See "Processing..."
22. Alert: "Payment successful!"
23. See order details page
24. Order Status: PROCESSING
25. Payment Status: PAID
26. Done! ✅
```

---

## Test Checklist

- [ ] Can browse marketplace
- [ ] Can open product modal
- [ ] Can add item to cart
- [ ] Cart badge updates
- [ ] Can view cart page
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Can proceed to checkout
- [ ] Form validation works
- [ ] Can select payment method
- [ ] Can place order
- [ ] Redirected to payment page
- [ ] Payment page loads correctly
- [ ] Can enter card details
- [ ] Card number formats correctly
- [ ] Can submit payment
- [ ] Payment processes successfully
- [ ] Redirected to order details
- [ ] Order shows correct status
- [ ] Payment shows as paid
- [ ] Stock was decremented
- [ ] Cart was cleared

---

## Performance Expectations

| Action | Expected Time |
|--------|---------------|
| Add to cart | < 1 second |
| Load cart page | < 2 seconds |
| Place order | 2-3 seconds |
| Payment processing | 3-5 seconds |
| Order creation | 1-2 seconds |

---

## Success Criteria

**The flow is working correctly if:**
✅ You can complete checkout without errors
✅ Payment page loads with order details
✅ Test card is accepted
✅ Payment processes successfully  
✅ Order is marked as "paid"
✅ You're redirected to order details
✅ Order ID is displayed
✅ Cart is emptied after order

---

## Next Steps After Testing

Once payment flow works:
1. Test with failed card: `4571 7360 0000 0014`
2. Test Cash on Delivery flow
3. Test order cancellation
4. Add your real PayMongo test keys
5. Test with actual PayMongo API
6. Set up webhook endpoints (optional)
7. Add email notifications (optional)

---

## Need Help?

If you encounter issues:
1. Check terminal for server errors
2. Check browser console for client errors
3. Verify MongoDB is running
4. Check `.env.local` has all required variables
5. Restart development server
6. Clear browser cache and localStorage

---

**Happy Testing! 🚀**
