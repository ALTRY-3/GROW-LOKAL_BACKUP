# PayMongo Integration Guide

This document explains how to set up and use PayMongo payment integration in GrowLokal.

## Table of Contents
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [Payment Flow](#payment-flow)
- [API Endpoints](#api-endpoints)
- [Security](#security)

---

## Overview

GrowLokal uses **PayMongo** as the payment gateway for processing online payments. PayMongo supports:

- **Credit/Debit Cards** (Visa, Mastercard)
- **GCash** e-wallet
- **GrabPay** (can be added)
- **PayMaya** (can be added)

---

## Setup Instructions

### 1. Create a PayMongo Account

1. Go to [PayMongo Dashboard](https://dashboard.paymongo.com/)
2. Sign up for a new account (just email and password)
3. **No verification needed for test keys!** ✅
4. Business verification is only required when you're ready to accept real payments with live keys

### 2. Get API Keys

1. Log in to PayMongo Dashboard
2. Go to **Developers → API Keys**
3. You'll see two sets of keys:
   - **TEST keys** (for development) - ✅ **Available immediately, no verification!**
   - **LIVE keys** (for production) - ⚠️ **Requires business verification**
4. Copy your **TEST keys** to start developing right away

### 3. Configure Environment Variables

Add your PayMongo keys to `.env.local`:

```bash
# PayMongo Configuration
PAYMONGO_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYMONGO_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

**Important:**
- Use `sk_test_` and `pk_test_` keys for development ✅ **No verification required**
- Use `sk_live_` and `pk_live_` keys for production ⚠️ **Verification required**
- Test keys work immediately after signup - start developing right away!
- **NEVER commit** your secret keys to version control
- Add `.env.local` to `.gitignore`

---

## Testing

### Test Card Numbers

PayMongo provides test cards for different scenarios:

| Card Number | Expiry | CVC | Result |
|-------------|--------|-----|--------|
| `4343 4343 4343 4345` | Any future date | Any 3-digit | ✅ **Success** |
| `4571 7360 0000 0014` | Any future date | Any 3-digit | ❌ **Failed** (insufficient funds) |
| `4571 7360 0000 0022` | Any future date | Any 3-digit | ❌ **Failed** (generic decline) |

**Notes:**
- Use any future expiry date (e.g., 12/2025)
- Use any 3-digit CVC (e.g., 123)
- Test cards only work with TEST API keys
- **Important:** You need BOTH `PAYMONGO_SECRET_KEY` and `PAYMONGO_PUBLIC_KEY` in `.env.local` for card payments to work

### Testing the Payment Flow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Create an order:**
   - Go to `/marketplace`
   - Add items to cart
   - Proceed to checkout
   - Fill shipping information
   - Select "Credit/Debit Card" as payment method
   - Click "Place Order"

3. **Complete payment:**
   - You'll be redirected to `/payment/[orderId]`
   - Enter test card number: `4343 4343 4343 4345`
   - Enter expiry: `12/2025`
   - Enter CVC: `123`
   - Click "Pay"

4. **Verify order:**
   - After successful payment, you'll be redirected to order details
   - Order status should be "processing"
   - Payment status should be "paid"

---

## Payment Flow

### 1. Card Payment Flow

```
┌─────────────┐
│   Customer  │
└──────┬──────┘
       │
       │ 1. Place Order
       ▼
┌─────────────────┐
│   Checkout      │
│   (shipping +   │
│   payment info) │
└──────┬──────────┘
       │
       │ 2. Create Order (POST /api/orders)
       ▼
┌─────────────────┐
│   Backend       │
│   - Validate    │
│   - Reserve     │
│   - Stock       │
└──────┬──────────┘
       │
       │ 3. Redirect to Payment Page
       ▼
┌─────────────────┐
│  Payment Page   │
│  (/payment/[id])│
└──────┬──────────┘
       │
       │ 4. Create Payment Intent
       ▼
┌─────────────────┐
│   PayMongo API  │
│   - Generate    │
│   - Client Key  │
└──────┬──────────┘
       │
       │ 5. Enter Card Details
       ▼
┌─────────────────┐
│   Customer      │
│   - Card Number │
│   - Expiry      │
│   - CVC         │
└──────┬──────────┘
       │
       │ 6. Tokenize & Attach
       ▼
┌─────────────────┐
│   PayMongo API  │
│   - Create      │
│   - Payment     │
│   - Method      │
└──────┬──────────┘
       │
       │ 7. Confirm Payment
       ▼
┌─────────────────┐
│   Backend       │
│   - Update      │
│   - Order       │
│   - Status      │
└──────┬──────────┘
       │
       │ 8. Redirect to Order Details
       ▼
┌─────────────────┐
│  Order Details  │
│  (Success!)     │
└─────────────────┘
```

### 2. GCash Payment Flow

```
1. Customer selects GCash
2. Order created → Creates PayMongo Source
3. Customer redirected to GCash login page
4. Customer authorizes payment in GCash
5. Redirected back to success/failed page
6. Webhook confirms payment
7. Order status updated
```

---

## API Endpoints

### 1. Create Payment Intent

**POST** `/api/payment/create-intent`

Creates a payment intent for card payments or source for GCash.

**Request Body:**
```json
{
  "orderId": "ORD-20250102-0001",
  "paymentMethod": "card" | "gcash" | "cod"
}
```

**Response (Card):**
```json
{
  "success": true,
  "data": {
    "paymentIntentId": "pi_xxx",
    "clientKey": "pi_xxx_client_xxx",
    "status": "awaiting_payment_method",
    "amount": 100000
  }
}
```

**Response (GCash):**
```json
{
  "success": true,
  "data": {
    "sourceId": "src_xxx",
    "checkoutUrl": "https://pm.link/xxx",
    "status": "pending"
  }
}
```

### 2. Confirm Payment

**POST** `/api/payment/confirm`

Confirms a payment and updates order status.

**Request Body:**
```json
{
  "orderId": "ORD-20250102-0001",
  "paymentIntentId": "pi_xxx",
  "paymentMethodId": "pm_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "orderId": "ORD-20250102-0001",
    "paymentStatus": "paid",
    "orderStatus": "processing"
  }
}
```

---

## Security

### PCI Compliance

**Important:** The current implementation directly handles card details in the frontend for demonstration purposes. For production:

1. **Use PayMongo.js SDK**
   - Include the official PayMongo.js library
   - Tokenize cards client-side
   - Never send raw card data to your server

2. **Example with PayMongo.js:**
   ```html
   <script src="https://cdn.paymongo.com/v1/paymongo.js"></script>
   <script>
     const paymongo = PayMongo(PUBLIC_KEY);
     
     // Create payment method client-side
     const paymentMethod = await paymongo.createPaymentMethod({
       type: 'card',
       details: {
         card_number: cardNumber,
         exp_month: expMonth,
         exp_year: expYear,
         cvc: cvc,
       },
     });
     
     // Send only the payment method ID to your server
     const response = await fetch('/api/payment/confirm', {
       method: 'POST',
       body: JSON.stringify({
         paymentMethodId: paymentMethod.id
       })
     });
   </script>
   ```

### Best Practices

1. **Environment Variables**
   - Store API keys in `.env.local`
   - Never expose secret keys to frontend
   - Use different keys for dev/production

2. **Webhooks** (Recommended for Production)
   - Set up webhook endpoint at `/api/webhooks/paymongo`
   - Verify webhook signatures
   - Handle events: `payment.paid`, `payment.failed`, `source.chargeable`

3. **Error Handling**
   - Log payment errors securely
   - Show user-friendly error messages
   - Retry failed payments

4. **HTTPS**
   - Always use HTTPS in production
   - PayMongo requires secure connections

---

## Production Checklist

Before going live:

- [ ] Replace TEST keys with LIVE keys
- [ ] Set up webhook endpoints
- [ ] Implement PayMongo.js SDK
- [ ] Enable HTTPS
- [ ] Test all payment scenarios
- [ ] Add payment logging/monitoring
- [ ] Set up error alerting
- [ ] Review PayMongo dashboard
- [ ] Complete business verification
- [ ] Test refund process
- [ ] Add terms and conditions
- [ ] Comply with data privacy laws

---

## Additional Resources

- [PayMongo Documentation](https://developers.paymongo.com/docs)
- [PayMongo API Reference](https://developers.paymongo.com/reference)
- [PayMongo Dashboard](https://dashboard.paymongo.com/)
- [PayMongo Support](https://support.paymongo.com/)

---

## Troubleshooting

### Common Issues

**1. "Invalid API Key"**
- Check if `PAYMONGO_SECRET_KEY` is set in `.env.local`
- Verify you're using the correct key (test vs live)
- Restart dev server after changing .env

**2. "Payment Failed"**
- Check if using valid test card
- Verify expiry date is in the future
- Check API key permissions

**3. "Order Not Found"**
- Ensure order was created successfully
- Check order ID in URL
- Verify database connection

**4. "Payment Intent Creation Failed"**
- Check amount is valid (minimum ₱100.00)
- Verify currency is set to "PHP"
- Check PayMongo dashboard for errors

---

## Support

For issues with:
- **GrowLokal Integration:** Contact development team
- **PayMongo API:** [PayMongo Support](https://support.paymongo.com/)
- **Account Issues:** [PayMongo Dashboard](https://dashboard.paymongo.com/)
