# reCAPTCHA v3 Configuration Guide for GrowLokal

## 🎯 Overview

This guide will help you set up Google reCAPTCHA v3 for your GrowLokal application to protect against bots and automated attacks.

---

## 📋 Step-by-Step Setup

### Step 1: Get reCAPTCHA Keys

1. **Visit Google reCAPTCHA Admin Console**
   - Go to: https://www.google.com/recaptcha/admin/create
   - Log in with your Google account

2. **Create a new site**
   - **Label**: `GrowLokal` (or any name you prefer)
   - **reCAPTCHA type**: Select **"reCAPTCHA v3"**
   - **Domains**: Add the following domains:
     ```
     localhost
     growlokal.com (your production domain)
     ```
   - ✅ Accept the reCAPTCHA Terms of Service
   - Click **"Submit"**

3. **Copy Your Keys**
   After submission, you'll see two keys:
   ```
   Site Key (Public):  6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   Secret Key (Private): 6LcYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
   ```

---

### Step 2: Configure Environment Variables

1. **Open your `.env.local` file** in the root of your project

2. **Add/Update the following variables:**

```bash
# reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  # Your Site Key
RECAPTCHA_SECRET_KEY=6LcYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY        # Your Secret Key

# Optional: Show development links (for testing)
NEXT_PUBLIC_SHOW_DEV_LINKS=true
```

3. **Important Notes:**
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Public key (exposed to frontend)
   - `RECAPTCHA_SECRET_KEY` - Secret key (server-side only, NEVER expose to frontend)
   - Replace the example keys with your actual keys from Google

---

### Step 3: Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

**Why?** Next.js only reads environment variables on startup.

---

## ✅ Verification

### Test reCAPTCHA is Working

1. **Open your browser console** (F12 or Right-click → Inspect → Console)

2. **Navigate to the signup page**: `http://localhost:3000/signup`

3. **Check console for reCAPTCHA messages:**
   - ✅ **Success**: No errors, you should see the reCAPTCHA badge in the bottom-right corner
   - ❌ **Error**: "reCAPTCHA site key not configured" → Check your `.env.local`

4. **Test signup flow:**
   - Fill out the signup form
   - Click "SIGNUP" button
   - reCAPTCHA should silently execute in the background
   - Check Network tab for `/api/auth/register` request

---

## 🔧 Where reCAPTCHA is Used

Your application uses reCAPTCHA in the following places:

### 1. **Signup Page** (`/signup`)
- **When**: Always (every signup attempt)
- **Action**: `signup`
- **Purpose**: Prevent bot account creation

### 2. **Login Page** (`/login`)
- **When**: After 3 failed login attempts
- **Action**: `login`
- **Purpose**: Prevent brute force attacks
- **API Endpoint**: `/api/auth/check-captcha`

---

## 📁 Configuration Files

### Frontend (Client-Side)

**File**: `src/lib/useRecaptcha.ts`
```typescript
// React hook for using reCAPTCHA
const { getToken, error } = useRecaptcha();

// Get token before form submission
const token = await getToken('signup'); // or 'login'
```

**File**: `src/lib/recaptcha.ts`
```typescript
// Core reCAPTCHA utilities
- loadRecaptchaScript() - Loads Google reCAPTCHA script
- executeRecaptcha() - Executes reCAPTCHA and returns token
```

### Backend (Server-Side)

**File**: `src/lib/recaptcha.ts`
```typescript
// Server-side verification
export async function verifyRecaptcha(token: string, action: string): Promise<{
  success: boolean;
  score: number;
  action: string;
}>
```

**Verification Endpoint**: `src/app/api/auth/register/route.ts`
```typescript
// Example usage in API route
const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'signup');

if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
  return { error: 'Failed security verification' };
}
```

---

## ⚙️ reCAPTCHA Settings

### Score Threshold

reCAPTCHA v3 returns a score from 0.0 (bot) to 1.0 (human).

**Current threshold**: `0.5`

```typescript
// In your API routes
if (recaptchaResult.score < 0.5) {
  // Reject as potential bot
}
```

**Adjust the threshold** based on your needs:
- `0.3` - More lenient (fewer false positives)
- `0.5` - Balanced (recommended)
- `0.7` - Stricter (more false positives)

### Actions

Actions help you track which parts of your app are being protected:

```typescript
'signup'   // User registration
'login'    // User login (after failed attempts)
'contact'  // Contact forms (if you add them)
'payment'  // Payment forms (if you add them)
```

---

## 🚨 Troubleshooting

### Issue: "reCAPTCHA site key not configured"

**Solution:**
1. Check `.env.local` has `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
2. Restart your development server
3. Clear browser cache and reload

### Issue: "reCAPTCHA verification failed"

**Possible causes:**
1. **Wrong secret key** - Check `RECAPTCHA_SECRET_KEY` in `.env.local`
2. **Domain not registered** - Add `localhost` to reCAPTCHA admin console
3. **Network error** - Check internet connection

### Issue: reCAPTCHA badge not showing

**Solution:**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
3. Check if script is loaded: Look for `<script src="https://www.google.com/recaptcha/api.js">`

### Issue: "Invalid site key"

**Solution:**
1. Double-check you copied the **Site Key** (not Secret Key)
2. Ensure no extra spaces in the key
3. Verify the key is for reCAPTCHA v3 (not v2)

### Issue: Development mode bypass

If you want to skip reCAPTCHA in development:

```typescript
// In your API routes
if (process.env.NODE_ENV === 'development' && !recaptchaToken) {
  console.log('Development mode: Skipping reCAPTCHA verification');
  // Allow without verification
}
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `RECAPTCHA_SECRET_KEY` private (never commit to Git)
- Use environment variables for both keys
- Verify tokens on the server-side
- Set appropriate score thresholds
- Monitor reCAPTCHA admin console for unusual activity

### ❌ DON'T:
- Expose secret key in frontend code
- Trust scores from the client
- Set threshold too high (causes false positives)
- Skip server-side verification
- Reuse tokens (they're single-use)

---

## 📊 Monitoring

### reCAPTCHA Admin Console

Visit: https://www.google.com/recaptcha/admin

**Metrics you can track:**
- Request volume
- Score distribution
- Top actions
- Domain verification
- Suspicious activity

**Recommended checks:**
- Review scores weekly
- Adjust thresholds if needed
- Check for unusual patterns
- Verify domain list is up-to-date

---

## 🧪 Testing

### Test Scenarios

1. **Successful signup with reCAPTCHA**
   ```
   1. Open /signup
   2. Fill form with valid data
   3. Submit
   4. Check Network tab: recaptchaToken should be in request
   5. Verify signup succeeds
   ```

2. **Failed login triggers reCAPTCHA requirement**
   ```
   1. Open /login
   2. Try wrong password 3 times
   3. On 4th attempt, reCAPTCHA should be checked
   4. API should verify the token
   ```

3. **Bot detection**
   ```
   1. Rapid form submissions
   2. Automated scripts
   3. Should be blocked with low scores
   ```

---

## 🌐 Production Deployment

### Before deploying to production:

1. **Update domains in reCAPTCHA console**
   ```
   yourproductiondomain.com
   www.yourproductiondomain.com
   ```

2. **Update environment variables on hosting platform**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
   - Heroku: Settings → Config Vars

3. **Test on production domain**
   - Verify reCAPTCHA loads
   - Check Network tab for verification
   - Test signup/login flows

4. **Monitor the first 24-48 hours**
   - Check admin console
   - Adjust score threshold if needed
   - Look for false positives

---

## 📚 Resources

- **reCAPTCHA Admin Console**: https://www.google.com/recaptcha/admin
- **reCAPTCHA Documentation**: https://developers.google.com/recaptcha/docs/v3
- **reCAPTCHA FAQs**: https://developers.google.com/recaptcha/docs/faq
- **Score Interpretation**: https://developers.google.com/recaptcha/docs/v3#interpreting_the_score

---

## 🎉 Quick Start Checklist

- [ ] Create reCAPTCHA v3 site at Google Admin Console
- [ ] Copy Site Key and Secret Key
- [ ] Add keys to `.env.local`
- [ ] Restart development server
- [ ] Test signup page (check for reCAPTCHA badge)
- [ ] Test login page (try 3 failed attempts)
- [ ] Check browser console for errors
- [ ] Verify Network requests include recaptchaToken
- [ ] Check reCAPTCHA admin console for activity

---

**Need Help?**
- Check browser console for errors
- Review reCAPTCHA admin console
- Verify all environment variables are set
- Ensure development server was restarted after adding keys

**Last Updated**: October 2, 2025
