# reCAPTCHA Badge Visibility Control - Implementation Summary

## ✅ Changes Made

The reCAPTCHA badge (logo in bottom right) has been configured to **only show on login and signup pages** and **hidden on all other pages**.

---

## 📁 Files Modified

### **1. src/components/RecaptchaProvider.tsx**
**Purpose**: Conditionally load reCAPTCHA script only on login/signup pages

**Changes**:
- Added `usePathname` hook to detect current route
- Modified logic to only load reCAPTCHA when `pathname === '/login'` or `pathname === '/signup'`
- Script won't load at all on other pages, preventing the badge from appearing

```tsx
const pathname = usePathname();

useEffect(() => {
  // Only load reCAPTCHA on login and signup pages
  const shouldLoadRecaptcha = pathname === '/login' || pathname === '/signup';
  
  if (!shouldLoadRecaptcha) {
    setIsLoaded(true);
    return;
  }
  // ... rest of loading logic
}, [pathname]);
```

### **2. src/components/PageIdentifier.tsx** (NEW)
**Purpose**: Add data attribute to body tag for CSS targeting

**What it does**:
- Uses `usePathname` to detect current page
- Sets `data-page` attribute on `<body>` tag (e.g., `data-page="login"`, `data-page="checkout"`)
- Removes attribute on unmount
- Allows CSS to target specific pages

```tsx
"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageIdentifier() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname) {
      const page = pathname.replace(/^\//, '') || 'home';
      document.body.setAttribute('data-page', page);
    }
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, [pathname]);
  
  return null;
}
```

### **3. src/app/layout.tsx**
**Purpose**: Register PageIdentifier component

**Changes**:
- Imported `PageIdentifier` component
- Added `<PageIdentifier />` to the component tree

```tsx
import PageIdentifier from "@/components/PageIdentifier";

// ... in JSX:
<RecaptchaProvider>
  <PageIdentifier />
  <RecaptchaDebug />
  {children}
  <Chatbot />
</RecaptchaProvider>
```

### **3a. src/components/RecaptchaDebug.tsx** (UPDATED)
**Purpose**: Debug reCAPTCHA loading only on relevant pages

**Changes**:
- Added `usePathname` hook to detect current route
- Only runs debug checks on `/login` and `/signup` pages
- Prevents console error on other pages where reCAPTCHA shouldn't load

```tsx
const pathname = usePathname();

useEffect(() => {
  // Only debug reCAPTCHA on login and signup pages
  const shouldLoadRecaptcha = pathname === '/login' || pathname === '/signup';
  
  if (!shouldLoadRecaptcha) {
    console.log('ℹ️ reCAPTCHA not loaded on this page (only loads on /login and /signup)');
    return;
  }
  
  // ... rest of debug logic only runs on login/signup
}, [pathname]);
```

### **4. src/app/globals.css**
**Purpose**: Hide reCAPTCHA badge globally, show only on login/signup

**Changes**:
- Made `.grecaptcha-badge` hidden by default
- Added specific rules to show badge only when `body[data-page="login"]` or `body[data-page="signup"]`

```css
/* reCAPTCHA badge styling - Hidden by default */
.grecaptcha-badge {
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Show reCAPTCHA badge only on login and signup pages */
body[data-page="login"] .grecaptcha-badge,
body[data-page="signup"] .grecaptcha-badge {
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 9999 !important;
}
```

---

## 🎯 How It Works

### **Two-Layer Protection**

1. **Script Loading Level** (RecaptchaProvider)
   - reCAPTCHA script only loads on `/login` and `/signup` routes
   - Other pages don't even load the script, so badge won't appear at all

2. **CSS Level** (globals.css)
   - Fallback protection via CSS
   - Badge hidden by default globally
   - Only visible when `body` has `data-page="login"` or `data-page="signup"`

### **Page Flow**

**On Login/Signup Pages:**
1. User navigates to `/login` or `/signup`
2. `PageIdentifier` sets `data-page="login"` on `<body>`
3. `RecaptchaProvider` detects route and loads reCAPTCHA script
4. CSS shows `.grecaptcha-badge` because of `body[data-page="login"]` rule
5. ✅ Badge is visible in bottom right

**On Other Pages (Marketplace, Checkout, Profile, etc.):**
1. User navigates to any other route
2. `PageIdentifier` sets `data-page="marketplace"` (or other page name)
3. `RecaptchaProvider` skips reCAPTCHA script loading
4. CSS keeps `.grecaptcha-badge` hidden (no matching selector)
5. ✅ Badge is hidden

---

## 🧪 Testing

### **Pages Where Badge Should Show:**
- ✅ `/login` - Badge visible
- ✅ `/signup` - Badge visible

### **Pages Where Badge Should Be Hidden:**
- ✅ `/marketplace` - No badge
- ✅ `/checkout` - No badge
- ✅ `/cart` - No badge
- ✅ `/profile` - No badge
- ✅ `/products` - No badge
- ✅ All other pages - No badge

### **Test Steps:**
1. Go to login page → Should see reCAPTCHA badge in bottom right
2. Go to signup page → Should see reCAPTCHA badge in bottom right
3. Go to marketplace → Badge should disappear
4. Go to checkout → Badge should remain hidden
5. Navigate back to login → Badge should reappear

---

## 🔧 Technical Details

### **Why Two Approaches?**

1. **Performance**: Not loading the script on most pages improves performance
2. **Reliability**: CSS fallback ensures badge stays hidden even if script somehow loads
3. **Flexibility**: Easy to add more pages that need reCAPTCHA by updating the condition

### **Data Attribute Pattern**

The `data-page` attribute on `<body>` creates a powerful pattern:
```html
<!-- On login page -->
<body data-page="login">

<!-- On marketplace -->
<body data-page="marketplace">

<!-- On checkout -->
<body data-page="checkout">
```

This allows page-specific CSS targeting:
```css
body[data-page="login"] .some-element { }
body[data-page="checkout"] .some-element { }
```

---

## 📝 Notes

- **Google reCAPTCHA Terms**: Hiding the badge is allowed as long as you display the reCAPTCHA terms in your privacy policy
- **No Breaking Changes**: Existing login/signup functionality remains unchanged
- **Clean Implementation**: No intrusive code changes, just conditional loading
- **Easy to Extend**: To add more pages that need reCAPTCHA, just update the condition in `RecaptchaProvider.tsx`

---

## 🎉 Result

✅ **reCAPTCHA badge now only appears on login and signup pages**  
✅ **All other pages are clean without the badge**  
✅ **No performance impact on non-auth pages**  
✅ **Login and signup still fully protected by reCAPTCHA**

---

## 🐛 Console Error Fix

### **Issue**: "grecaptcha not loaded after 10 seconds"

**Cause**: `RecaptchaDebug` was checking for grecaptcha on all pages, even though it only loads on login/signup.

**Fix**: Updated `RecaptchaDebug.tsx` to:
- Check current pathname using `usePathname()`
- Only run debug checks on `/login` and `/signup` pages
- Show info message on other pages instead of error
- No more false "not loaded" errors!

**Result**: 
- ✅ Debug logs only appear on login/signup pages
- ✅ No console errors on marketplace, checkout, etc.
- ✅ Clean console on pages where reCAPTCHA isn't needed

---

*Implementation Date: October 6, 2025*  
*Files Created: 1 (PageIdentifier.tsx)*  
*Files Modified: 4 (RecaptchaProvider.tsx, RecaptchaDebug.tsx, layout.tsx, globals.css)*
