# Fix: Card Number Format Invalid Error

## Problem
**Error:** `details.card_number format is invalid`

When trying to pay with test card `4343 4343 4343 4345`, PayMongo API rejects it.

## Root Causes

### Possible Issues:
1. **Spaces not removed properly** - Card number still has spaces
2. **Empty or incomplete card number** - User didn't fill all fields
3. **Invalid characters** - Non-numeric characters in the card number
4. **Wrong card number length** - Too short or too long (must be 15-16 digits)

## Solution

### Added Input Validation

**File:** `src/app/payment/[orderId]/page.tsx`

Now validates all card details BEFORE sending to PayMongo:

```typescript
// Validate card details
const cleanCardNumber = cardNumber.replace(/\s/g, '');

✅ Card number: 15-16 digits (no spaces)
✅ Expiry month: 1-12
✅ Expiry year: 4 digits (e.g., 2025)
✅ CVC: 3-4 digits
```

### Added Debug Logging

Console now shows what's being sent to PayMongo:
```javascript
console.log('Creating payment method with:', {
  cardNumberLength: 16,
  expMonth: 12,
  expYear: 2025,
  cvcLength: 3,
});
```

### Better Error Messages

- Shows specific validation error before submitting
- Logs full PayMongo error response to console
- User-friendly error messages

---

## How to Test

### 1. Fill the Form Correctly

**Test Card:** `4343 4343 4343 4345`

```
Card Number: 4343 4343 4343 4345  ✅ (can have spaces, they'll be removed)
Expiry Month: 12                   ✅ (1-12)
Expiry Year: 2025                  ✅ (4 digits, future year)
CVC: 123                           ✅ (3 digits)
```

### 2. Check Browser Console

Open DevTools (F12) → Console tab

**You should see:**
```
Creating payment method with: {
  cardNumberLength: 16,
  expMonth: 12,
  expYear: 2025,
  cvcLength: 3
}
```

### 3. Common Mistakes

❌ **Card Number Too Short**
```
Card: 4343 4343 4343 434  (15 digits, missing last digit)
Error: "Please enter a valid 15-16 digit card number"
```

❌ **Invalid Expiry Month**
```
Expiry Month: 13  (months are 1-12)
Error: "Please enter a valid expiry month (1-12)"
```

❌ **Invalid Expiry Year**
```
Expiry Year: 25  (must be 4 digits)
Error: "Please enter a valid 4-digit expiry year"
```

❌ **CVC Too Short**
```
CVC: 12  (must be 3-4 digits)
Error: "Please enter a valid 3-4 digit CVC"
```

---

## Correct Test Card Format

### Success Card
```
Card Number:  4343 4343 4343 4345
Expiry Month: 12
Expiry Year:  2025
CVC:          123
```

PayMongo will receive:
```json
{
  "card_number": "4343434343434345",  // 16 digits, no spaces
  "exp_month": 12,                     // Integer
  "exp_year": 2025,                    // Integer
  "cvc": "123"                         // String
}
```

### Failed Card (for testing)
```
Card Number:  4571 7360 0000 0014
Expiry Month: 12
Expiry Year:  2025
CVC:          123
```

Result: Payment fails (insufficient funds simulation)

---

## Debugging Steps

If you still get "card_number format is invalid":

### Step 1: Check Browser Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. Click "Pay" button
4. Look for log message starting with "Creating payment method with:"
5. Verify:
   - cardNumberLength: 16 ✅
   - expMonth: 1-12 ✅
   - expYear: 4 digits ✅
   - cvcLength: 3-4 ✅
```

### Step 2: Check PayMongo Error Details
```
Look for log message "PayMongo API Error:"
It will show the exact error from PayMongo
```

### Step 3: Verify Public Key
```
1. Check .env.local has PAYMONGO_PUBLIC_KEY
2. Key should start with pk_test_
3. Restart server after changing .env.local
```

### Step 4: Test in PayMongo Dashboard
```
1. Go to https://dashboard.paymongo.com/
2. Go to Developers → API Keys
3. Click "Test in API Reference"
4. Try creating a payment method manually
5. Verify your API keys work
```

---

## What Changed

### Before:
- ❌ No validation before submission
- ❌ Generic error messages
- ❌ No debug logging
- ❌ Hard to troubleshoot

### After:
- ✅ Validates all fields before API call
- ✅ Shows specific error messages
- ✅ Logs debug info to console
- ✅ Easy to identify what's wrong

---

## Complete Test Flow

```bash
# 1. Make sure server is running
npm run dev

# 2. Open browser with DevTools
Press F12 → Console tab

# 3. Go through checkout
http://localhost:3000/marketplace
→ Add to cart
→ Checkout
→ Fill form
→ Select "Credit/Debit Card"
→ Place Order

# 4. Fill payment form
Card Number:  4343 4343 4343 4345
Expiry Month: 12
Expiry Year:  2025
CVC:          123

# 5. Click "Pay"
Watch console for logs:
- "Creating payment method with: {...}"
- Should see payment processing
- Should redirect to order page

# 6. Success!
✅ Payment completed
✅ Order status: Processing
✅ Payment status: Paid
```

---

## Still Getting Errors?

### Check These:

1. **Environment Variables**
   ```bash
   # In .env.local
   PAYMONGO_SECRET_KEY=sk_test_xxxxx  ✅
   PAYMONGO_PUBLIC_KEY=pk_test_xxxxx  ✅ (REQUIRED!)
   ```

2. **Server Restart**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Browser Cache**
   ```
   Hard reload: Ctrl+Shift+R
   Or clear cache: Ctrl+Shift+Delete
   ```

4. **PayMongo Account Status**
   - Log in to dashboard.paymongo.com
   - Verify account is active
   - Check if test mode is enabled

---

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| `card_number format is invalid` | Invalid card number format | Use test card: 4343 4343 4343 4345 |
| `exp_month is invalid` | Month not 1-12 | Use 12 for December |
| `exp_year is invalid` | Not 4 digits or past date | Use 2025 or later |
| `cvc is invalid` | Wrong CVC format | Use 123 |
| `API key is invalid` | Wrong public key | Check PAYMONGO_PUBLIC_KEY in .env.local |
| `Payment not initialized` | Payment intent not created | Wait for page to load, or refresh |

---

## Success Indicators

When everything works correctly:

```
Console Logs:
✅ Creating payment method with: { cardNumberLength: 16, ... }
✅ (No PayMongo API Error logs)
✅ Payment successful!

Browser:
✅ Alert: "Payment successful!"
✅ Redirects to /orders/ORD-xxxxx
✅ Shows "PAID" badge (green)
✅ Shows "PROCESSING" status (blue)
```

---

## Production Notes

For production deployment:

1. **Use PayMongo.js SDK** (don't send raw card data)
2. **Use LIVE keys** (sk_live_* and pk_live_*)
3. **Complete business verification**
4. **Set up webhooks** for payment confirmations
5. **Enable HTTPS**
6. **Add rate limiting**
7. **Implement 3D Secure** for certain cards

---

**The validation should now catch errors before submitting to PayMongo!** 🎯

Try filling the form again with the test card. You should see better error messages if something's wrong!
