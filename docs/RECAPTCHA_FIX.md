# reCAPTCHA Fix Implementation

## Issues Identified and Fixed

### 1. **Script Loading Timing Issues**
   - **Problem**: reCAPTCHA script wasn't loading before components tried to use it
   - **Fix**: Created `RecaptchaProvider` component to load script globally at app startup
   - **File**: `src/components/RecaptchaProvider.tsx`

### 2. **Missing Global Initialization**
   - **Problem**: Each component was trying to load reCAPTCHA independently
   - **Fix**: Added provider to root layout to ensure single initialization
   - **File**: `src/app/layout.tsx`

### 3. **Improved Error Handling**
   - **Problem**: Silent failures when reCAPTCHA failed to load
   - **Fix**: Added comprehensive logging and better error messages
   - **Files**: 
     - `src/lib/recaptcha.ts` - Enhanced with detailed console logs
     - `src/lib/useRecaptcha.ts` - Better error handling and retry logic

### 4. **Badge Visibility**
   - **Problem**: reCAPTCHA v3 badge might be hidden by CSS
   - **Fix**: Added explicit CSS rules to ensure badge is visible
   - **File**: `src/app/globals.css`

### 5. **Development Debugging**
   - **Added**: Debug component to verify reCAPTCHA loading status
   - **File**: `src/components/RecaptchaDebug.tsx`

## Changes Made

### New Files Created:
1. **src/components/RecaptchaProvider.tsx** - Global reCAPTCHA initialization provider
2. **src/components/RecaptchaDebug.tsx** - Debug component for troubleshooting

### Modified Files:
1. **src/app/layout.tsx** - Added RecaptchaProvider and RecaptchaDebug
2. **src/lib/recaptcha.ts** - Enhanced logging and error handling
3. **src/lib/useRecaptcha.ts** - Improved loading detection and retry logic
4. **src/app/globals.css** - Added reCAPTCHA badge visibility CSS

## Testing Instructions

### 1. Check Console Logs
Open browser console (F12) and look for:
```
=== reCAPTCHA Debug Info ===
NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 6LeCM9srAAAAADYAWbxAUy5SNe-pEgiB_oYTWtud
Environment: development
Initializing reCAPTCHA with site key: 6LeCM9srAAAAADYAWbxAUy5SNe-pEgiB_oYTWtud
Loading reCAPTCHA script with site key: 6LeCM9srAAAAADYAWbxAUy5SNe-pEgiB_oYTWtud
reCAPTCHA script loaded successfully
✓ grecaptcha object found
✓ grecaptcha.ready: function
✓ grecaptcha.execute: function
```

### 2. Check reCAPTCHA Badge
- You should see a small reCAPTCHA badge in the bottom-right corner of the page
- The badge should say "protected by reCAPTCHA" with the Privacy/Terms links

### 3. Test Signup Flow
1. Go to http://localhost:3001/signup
2. Fill out the form
3. Check console for: `Getting reCAPTCHA token for action: signup`
4. Check console for: `Token obtained successfully`
5. Submit the form

### 4. Verify Token Submission
In the console, you should see:
```
Executing reCAPTCHA for action: signup
reCAPTCHA ready, executing...
reCAPTCHA token obtained for signup: 03AGdBq27...
```

## Troubleshooting

### If reCAPTCHA Still Not Working:

#### Check 1: Verify Environment Variables
```powershell
# Check if .env.local has the keys
cat .env.local | Select-String "RECAPTCHA"
```
Should show:
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeCM9srAAAAADYAWbxAUy5SNe-pEgiB_oYTWtud
RECAPTCHA_SECRET_KEY=6LeCM9srAAAAAEQlQHvLMYxBAkFTRrMGothYs3eu
```

#### Check 2: Restart Server
Environment variables are loaded at startup, so restart is required:
```powershell
# Stop the server (Ctrl+C) and restart
npm run dev
```

#### Check 3: Verify Keys with Google
1. Go to https://www.google.com/recaptcha/admin
2. Find your site "GrowLokal"
3. Verify the keys match your .env.local
4. Check that "localhost" is in the allowed domains

#### Check 4: Browser Console Errors
Look for any errors related to:
- CORS issues
- Invalid site key
- Network errors loading the script

#### Check 5: Network Tab
In DevTools Network tab:
1. Look for request to `https://www.google.com/recaptcha/api.js`
2. Should return 200 OK
3. Look for request to `https://www.google.com/recaptcha/api2/reload`
4. Should execute when you submit forms

### Common Issues:

#### "Invalid site key"
- Your NEXT_PUBLIC_RECAPTCHA_SITE_KEY doesn't match Google's records
- Solution: Verify the key in Google reCAPTCHA Admin Console

#### "Domain not allowed"
- localhost is not in your allowed domains list
- Solution: Add "localhost" to domains in Google reCAPTCHA Admin

#### "grecaptcha is not defined"
- Script failed to load
- Solution: Check browser console for network errors, check if ad blocker is blocking it

#### Badge not visible
- CSS might be hiding it
- Solution: Check if any custom CSS is hiding elements with class `.grecaptcha-badge`

## Development vs Production

### Development Mode (Current)
- reCAPTCHA will bypass if keys are missing
- Console logs are verbose for debugging
- `NEXT_PUBLIC_SHOW_DEV_LINKS=true` shows additional debug info

### Production Mode (When Deploying)
- reCAPTCHA is **required** - will block submissions without valid token
- Add your production domain to Google reCAPTCHA allowed domains
- Update NEXTAUTH_URL in .env.local to your production URL
- Consider removing RecaptchaDebug component

## Cleanup After Testing

Once reCAPTCHA is working, you can remove the debug component:

1. **Remove RecaptchaDebug import from layout.tsx**:
```typescript
// Remove this line:
import RecaptchaDebug from "@/components/RecaptchaDebug";

// Remove this component:
<RecaptchaDebug />
```

2. **Optionally delete the debug file**:
```powershell
rm src/components/RecaptchaDebug.tsx
```

3. **Reduce console logging** in `src/lib/recaptcha.ts` by commenting out console.log statements (keep console.error and console.warn)

## Expected Behavior

### On Page Load:
1. RecaptchaProvider loads the script
2. Console shows initialization messages
3. reCAPTCHA badge appears in bottom-right corner

### On Form Submit (Signup):
1. Form validation passes
2. `getToken('signup')` is called
3. reCAPTCHA executes invisibly
4. Token is obtained (no user interaction required - it's v3!)
5. Token is sent with form data to `/api/auth/register`
6. Server verifies token with Google
7. If score > 0.5, registration proceeds

### Score Thresholds:
- **1.0** - Very likely a human
- **0.5** - Neutral (current threshold)
- **0.0** - Very likely a bot

You can adjust the threshold in `src/app/api/auth/register/route.ts`:
```typescript
const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'signup', 0.5);
// Change 0.5 to your preferred threshold (0.0 - 1.0)
```

## Additional Resources

- [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA FAQ](https://developers.google.com/recaptcha/docs/faq)
