# Test Card Behavior - Success & Failed Scenarios

## Overview

PayMongo provides test cards to simulate different payment scenarios. This document explains how each test card behaves and what you should expect.

---

## Test Cards

### ✅ Success Card
**Card Number:** `4343 4343 4343 4345` (Visa)

**Expected Flow:**
1. Enter card details
2. Click "Pay"
3. Payment method created ✅
4. Payment intent attached ✅
5. Payment confirmed ✅
6. Alert: "Payment successful!"
7. Redirect to order details
8. Order status: **PROCESSING**
9. Payment status: **PAID**

**Console Output:**
```javascript
Creating payment method with: {...}
Attaching payment method: {...}
Payment intent status after attach: "succeeded"
Payment successful!
```

---

### ❌ Failed Card (Insufficient Funds)
**Card Number:** `5100 0000 0000 0198` (Mastercard)

**Expected Flow:**
1. Enter card details
2. Click "Pay"
3. Payment method created ✅ (creates successfully!)
4. Payment intent attached ⚠️
5. Payment status: **failed** or **requires_payment_method**
6. Error shown on page
7. Order remains **PENDING**
8. Payment status: **FAILED**

**What Happens:**
- The card number is valid and creates a payment method
- But when PayMongo tries to charge it, the bank "declines" it
- This simulates a real-world scenario: insufficient funds

**Console Output:**
```javascript
Creating payment method with: {...}
Attaching payment method: {...}
Payment intent status after attach: "requires_payment_method" or "failed"
Payment confirmation failed
```

**Error Message Shown:**
```
❌ Payment Declined

Payment declined. Your card was declined by your bank. 
Please try a different card or payment method.

Note: If using test card 4571 7360 0000 0014, 
this is expected behavior (simulates declined payment).
```

---

### ❌ Failed Card (Generic Decline)
**Card Number:** `4400 0000 0000 0016` (Visa)

**Expected Flow:**
Same as insufficient funds card above.

**Difference:**
- `5100 0000 0000 0198` = Insufficient funds (specific reason: `insufficient_funds`)
- `4400 0000 0000 0016` = Generic decline (reason: `generic_decline`)

---

### 🔒 3D Secure Card (Requires Authentication)
**Card Number:** `4120 0000 0000 0007` (Visa)

**Expected Flow:**
1. Enter card details
2. Click "Pay"
3. Payment method created ✅
4. Payment status: **awaiting_next_action**
5. Redirect to bank authentication page
6. Complete authentication
7. Return to site
8. Payment confirmed ✅
9. Order marked as PAID

---

## Payment Status Flow

### Success Path:
```
awaiting_payment_method
    ↓ (attach payment method)
succeeded
    ↓ (confirm payment)
Order: PROCESSING
Payment: PAID
```

### Failed Path:
```
awaiting_payment_method
    ↓ (attach payment method)
requires_payment_method (failed)
    ↓
Error shown to user
Order: PENDING
Payment: FAILED
```

### 3D Secure Path (some cards):
```
awaiting_payment_method
    ↓ (attach payment method)
awaiting_next_action
    ↓ (redirect to bank)
[User authenticates]
    ↓ (return from bank)
succeeded
    ↓
Order: PROCESSING
Payment: PAID
```

---

## Testing Scenarios

### Scenario 1: Successful Payment ✅

**Steps:**
1. Add item to cart
2. Checkout with card payment
3. Enter: `4343 4343 4343 4345` / `12/2025` / `123`
4. Click "Pay"

**Expected Result:**
- ✅ Alert: "Payment successful!"
- ✅ Redirects to order page
- ✅ Order shows "PROCESSING" (blue badge)
- ✅ Payment shows "PAID" (green badge)

---

### Scenario 2: Declined Payment (Insufficient Funds) ❌

**Steps:**
1. Add item to cart
2. Checkout with card payment
3. Enter: `5100 0000 0000 0198` / `12/2025` / `123`
4. Click "Pay"

**Expected Result:**
- ❌ Error message shown on payment page
- ❌ Stays on payment page (doesn't redirect)
- ❌ Order remains "PENDING"
- ❌ Can try again with different card

**What User Sees:**
```
Payment Setup Error

❌ Payment Declined

The card does not have sufficient funds to complete the transaction.
Payment declined with code: insufficient_funds

Please try a different card or payment method.
```

---

### Scenario 3: Generic Decline ❌

**Steps:**
1. Add item to cart
2. Checkout with card payment
3. Enter: `4400 0000 0000 0016` / `12/2025` / `123`
4. Click "Pay"

**Expected Result:**
- ❌ Error message shown
- ❌ Shows: "The payment failed to be processed due to unknown reasons. Please contact your card issuing bank."

---

### Scenario 4: Try Again After Decline ✅

**Steps:**
1. Failed payment with `5100 0000 0000 0198`
2. Clear the error
3. Enter successful card: `4343 4343 4343 4345`
4. Click "Pay" again

**Expected Result:**
- ✅ Second payment succeeds
- ✅ Order updated to PAID

---

## Improved Error Handling

### What We Added:

1. **Payment Status Checking**
   - Checks `status` after attaching payment method
   - Handles: `succeeded`, `awaiting_next_action`, `processing`, `requires_payment_method`, `failed`

2. **User-Friendly Messages**
   - "Payment declined" instead of generic error
   - Clear note when using test cards
   - Specific guidance based on error type

3. **Console Debugging**
   - Logs payment status after attach
   - Shows what went wrong
   - Helps troubleshoot issues

4. **3D Secure Support**
   - Detects `awaiting_next_action`
   - Redirects to bank authentication
   - Returns after authentication

---

## Console Output Examples

### Success:
```javascript
Creating payment method with: {
  cardNumberLength: 16,
  expMonth: 12,
  expYear: 2025,
  cvcLength: 3,
  publicKeyPresent: true,
  publicKeyPrefix: "pk_test_"
}

Attaching payment method: {
  paymentIntentId: "pi_xxx",
  paymentMethodId: "pm_xxx",
  usingPublicKey: "pk_test_FU"
}

Payment intent status after attach: "succeeded"

// Backend confirms payment
// Redirect to order page
```

### Failed:
```javascript
Creating payment method with: {
  cardNumberLength: 16,
  expMonth: 12,
  expYear: 2025,
  cvcLength: 3,
  publicKeyPresent: true,
  publicKeyPrefix: "pk_test_"
}

Attaching payment method: {
  paymentIntentId: "pi_xxx",
  paymentMethodId: "pm_xxx",
  usingPublicKey: "pk_test_FU"
}

Payment intent status after attach: "requires_payment_method"

Payment error: Error: Payment declined. Your card was declined by your bank.
```

---

## Real-World Behavior

### What Test Cards Simulate:

**Success Card (4343 4343 4343 4345):**
- Simulates: Customer with sufficient funds and valid card
- Bank authorizes payment
- Transaction completes immediately

**Failed Card (4571 7360 0000 0014):**
- Simulates: Customer with insufficient funds
- Bank declines payment
- Customer needs to use different card

**Failed Card (4571 7360 0000 0022):**
- Simulates: Generic decline (expired card, incorrect details, fraud check, etc.)
- Bank declines without specific reason
- Customer needs to contact bank or try different card

---

## Database State After Each Scenario

### After Successful Payment:
```javascript
Order {
  orderId: "ORD-20251002-0001",
  status: "processing",
  paymentDetails: {
    method: "card",
    status: "paid",
    transactionId: "pi_xxx",
    paidAt: "2025-10-02T..."
  }
}
```

### After Failed Payment:
```javascript
Order {
  orderId: "ORD-20251002-0001",
  status: "pending",              // ← Stays pending
  paymentDetails: {
    method: "card",
    status: "pending",            // ← Not updated
    transactionId: null,
    paidAt: null
  }
}
```

**Note:** Failed payment doesn't update the order - user can retry.

---

## Testing Checklist

```
✅ Test successful payment (4343 4343 4343 4345)
   - Payment succeeds
   - Order marked as paid
   - Redirects to order page
   - Green "PAID" badge shown

✅ Test failed payment (4571 7360 0000 0014)
   - Payment fails
   - Error message shown
   - Stays on payment page
   - Order remains pending

✅ Test retry after failure
   - Use failed card first
   - Then use success card
   - Second payment should work

✅ Check order status in database
   - Successful: status = "processing", paid = true
   - Failed: status = "pending", paid = false

✅ Test with empty fields
   - Validation prevents submission
   - Shows "Please enter valid..." messages

✅ Test with invalid card number
   - Shows validation error before API call
```

---

## Production Considerations

In production with real cards:

1. **Payment Failures Are Normal**
   - Insufficient funds
   - Expired cards
   - Fraud detection
   - Network issues

2. **Retry Logic**
   - Allow users to try different payment methods
   - Show clear error messages
   - Keep order in pending state
   - Don't double-charge

3. **Status Monitoring**
   - Some payments take time (3D Secure)
   - Use webhooks for async updates
   - Poll payment status if needed

4. **User Communication**
   - Email on successful payment
   - Email on payment failure with retry link
   - Order status updates

---

## Summary

**Test Card Behavior:**
- ✅ `4343 4343 4343 4345` - Always succeeds
- ❌ `4571 7360 0000 0014` - Always fails (insufficient funds)
- ❌ `4571 7360 0000 0022` - Always fails (generic decline)

**Error Handling:**
- ✅ Shows user-friendly messages
- ✅ Explains test card behavior
- ✅ Allows retry with different card
- ✅ Logs details to console for debugging

**This is working as expected!** The failed card is supposed to show an error. 🎯
