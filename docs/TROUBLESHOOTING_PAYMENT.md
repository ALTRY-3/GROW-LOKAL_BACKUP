# Troubleshooting: "No Card Payment Form" Issue

## Problem
After clicking "Place Order" at checkout, you're redirected to the payment page but **no card input fields appear** - just a blank page or loading state.

## Root Cause
The payment form doesn't appear because **PayMongo API keys are not configured**. The payment page tries to create a payment intent when it loads, but fails silently when API keys are missing.

## Solution

### Step 1: Create .env.local file
Create a file named `.env.local` in your project root (same folder as `package.json`):

```bash
# Windows PowerShell
cd d:\GrowLokalCopy\grow-lokal
New-Item .env.local -ItemType File
```

### Step 2: Add PayMongo Keys
Open `.env.local` and add these lines:

```env
MONGODB_URI=mongodb://localhost:27017/grow-lokal
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-random-string

# PayMongo Test Keys
PAYMONGO_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
PAYMONGO_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY_HERE
```

### Step 3: Get PayMongo Test Keys

1. **Sign up for PayMongo** (if you haven't):
   - Go to: https://dashboard.paymongo.com/signup
   - No business verification needed for test keys! ✅

2. **Get your test keys**:
   - Log in to: https://dashboard.paymongo.com/
   - Click **"Developers"** in sidebar
   - Click **"API Keys"**
   - Copy your **TEST** keys:
     - Secret Key (starts with `sk_test_`)
     - Public Key (starts with `pk_test_`)

3. **Paste into .env.local**:
   ```env
   PAYMONGO_SECRET_KEY=sk_test_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   PAYMONGO_PUBLIC_KEY=pk_test_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   ```

### Step 4: Restart Development Server

**IMPORTANT:** You must restart the server for environment variables to load!

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 5: Test Again

1. Go to marketplace: http://localhost:3000/marketplace
2. Add items to cart
3. Go to checkout
4. Fill in the form
5. Select "Credit/Debit Card"
6. Click "Place Order"
7. **Now you should see the card form!** 🎉

---

## What You Should See Now

### Before Fix (Missing Keys):
```
✅ Redirected to /payment/ORDER-ID
❌ No card input fields
❌ Button says "Initializing..." (disabled)
❌ Or shows error message about PAYMONGO_SECRET_KEY
```

### After Fix (With Keys):
```
✅ Redirected to /payment/ORDER-ID
✅ Card input fields appear:
   - Card Number
   - Expiry Month
   - Expiry Year  
   - CVC
✅ Test cards info box shows
✅ Pay button enabled with amount
```

---

## Test Cards (After Setup)

Once your keys are configured, use these test cards:

| Card Number         | Result  | Use Case |
|---------------------|---------|----------|
| 4343 4343 4343 4345 | ✅ Success | Test successful payment |
| 4571 7360 0000 0014 | ❌ Failed  | Test payment failure |

**Expiry:** Any future date (e.g., 12/2025)  
**CVC:** Any 3-4 digits (e.g., 123)

---

## Still Not Working?

### Check 1: Verify .env.local exists
```bash
# Windows PowerShell
Test-Path d:\GrowLokalCopy\grow-lokal\.env.local
# Should return: True
```

### Check 2: Verify keys format
Open `.env.local` and check:
- ✅ Secret key starts with `sk_test_`
- ✅ Public key starts with `pk_test_`
- ❌ No quotes around values
- ❌ No spaces before/after `=`

**Correct:**
```env
PAYMONGO_SECRET_KEY=sk_test_abc123
```

**Incorrect:**
```env
PAYMONGO_SECRET_KEY = "sk_test_abc123"  ❌ (has quotes and spaces)
```

### Check 3: Server was restarted
Environment variables only load when the server starts!

```bash
# Stop server: Ctrl+C
# Start again: npm run dev
```

### Check 4: Check browser console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Reload payment page
4. Look for errors:
   - **"Failed to create payment intent"** = Bad API keys
   - **"PAYMONGO_SECRET_KEY is not set"** = Keys not loaded
   - **Network error** = MongoDB or server issue

### Check 5: Check terminal output
Look for this warning in your terminal:
```
Warning: PAYMONGO_SECRET_KEY is not set in environment variables
```

If you see this → Server didn't load the keys → Check .env.local location and restart.

---

## Alternative: Test Without PayMongo (Temporary)

If you want to test the order flow without setting up PayMongo:

1. At checkout, select **"Cash on Delivery"** instead of card
2. Click "Place Order"
3. You'll be redirected directly to order details (skips payment page)

This confirms the checkout → order creation flow works!

---

## Quick Reference: Complete Setup

```bash
# 1. Create .env.local
cd d:\GrowLokalCopy\grow-lokal
New-Item .env.local -ItemType File

# 2. Edit .env.local (use notepad or VS Code)
code .env.local

# 3. Add these lines:
MONGODB_URI=mongodb://localhost:27017/grow-lokal
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-string-here
PAYMONGO_SECRET_KEY=sk_test_YOUR_KEY_FROM_DASHBOARD
PAYMONGO_PUBLIC_KEY=pk_test_YOUR_KEY_FROM_DASHBOARD

# 4. Save and close

# 5. Restart server
npm run dev

# 6. Test at http://localhost:3000/marketplace
```

---

## For Production Deployment

When deploying to production (Vercel, Heroku, etc.):

1. **Don't use .env.local** (local only)
2. **Use platform's environment variables settings**:
   - Vercel: Project Settings → Environment Variables
   - Heroku: Settings → Config Vars
3. **Use LIVE keys** (sk_live_* and pk_live_*)
4. **Complete business verification** (required for live keys)

---

## Need More Help?

- Full PayMongo setup: `docs/PAYMONGO_SETUP.md`
- Testing guide: `docs/TESTING_GUIDE.md`
- PayMongo docs: https://developers.paymongo.com/docs
- PayMongo dashboard: https://dashboard.paymongo.com/

---

**TL;DR:**
1. Create `.env.local` file
2. Add `PAYMONGO_SECRET_KEY=sk_test_...` and `PAYMONGO_PUBLIC_KEY=pk_test_...`
3. Get keys from https://dashboard.paymongo.com/ (free, no verification for test)
4. Restart server with `npm run dev`
5. Card form will now appear! ✅
