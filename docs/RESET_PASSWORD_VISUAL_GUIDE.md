# Reset Password Page - Visual Guide

## 🎨 Design Overview

The reset password page features a modern **split-screen design** with:
- Left panel: Hero section with security messaging
- Right panel: Password reset form

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    RESET PASSWORD PAGE                       │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                   │
│    LEFT PANEL            │     RIGHT PANEL                  │
│    (Hero Section)        │     (Form Section)               │
│                          │                                   │
│  ┌────────────────────┐  │  ┌─────────────────────────┐    │
│  │ 🌿 GrowLokal       │  │  │ ← Back to Login         │    │
│  └────────────────────┘  │  └─────────────────────────┘    │
│                          │                                   │
│  Secure Your Account     │      ┌──────────────┐           │
│                          │      │     🔑       │ ← Animated │
│  Create a strong,        │      └──────────────┘    Lock   │
│  unique password...      │                                   │
│                          │      Reset Password              │
│  ┌──────────────────┐   │      Create a strong...          │
│  │                  │   │                                   │
│  │  Security Image  │   │  ┌─────────────────────────┐    │
│  │                  │   │  │ 🔒 New Password         │    │
│  └──────────────────┘   │  └─────────────────────────┘    │
│                          │                                   │
│  ✓ Bank-level encryption │  [Password Strength Meter]      │
│  ✓ 1-hour expiration    │                                   │
│  ✓ One-time use tokens  │  ┌─────────────────────────┐    │
│  ✓ Data privacy         │  │ 🔒 Confirm Password     │    │
│                          │  └─────────────────────────┘    │
│                          │                                   │
│                          │  ┌─────────────────────────┐    │
│                          │  │  💾 Update Password     │    │
│                          │  └─────────────────────────┘    │
│                          │                                   │
│                          │  Remember your password?         │
│                          │  Sign in here                    │
│                          │                                   │
│                          │  🛡️ Security | 🔒 Encrypted     │
└──────────────────────────┴──────────────────────────────────┘
```

---

## 🎭 Component Breakdown

### 1. Lock Icon (Header)
```
┌──────────────┐
│              │
│      🔑      │ ← 64x64px rounded square
│              │    Gradient: #AF7928 → #c98f3a
└──────────────┘    Pulse animation
```

### 2. Input Fields
```
┌─────────────────────────────────────┐
│  New Password                    👁️  │ ← Hover: background glow
└─────────────────────────────────────┘    Focus: golden border + lift
   [=====================]                  ← Password strength bar
   Strong • Breach check passed
```

### 3. Submit Button States

**Default:**
```
┌─────────────────────────────┐
│  💾 Update Password         │ ← Gradient background
└─────────────────────────────┘    Hover: shimmer + lift
```

**Loading:**
```
┌─────────────────────────────┐
│  ⏳ Updating Password...    │ ← Spinner animation
└─────────────────────────────┘    Disabled state
```

**Success:**
```
┌─────────────────────────────┐
│  ✅ Password Updated!       │ ← Green gradient
└─────────────────────────────┘    Success pulse animation
```

### 4. Message States

**Success Message:**
```
┌─────────────────────────────────────────┐
│ ✅ Password has been reset successfully! │ ← Green gradient
│    ⏱️ Redirecting to login...           │    Slide-in animation
└─────────────────────────────────────────┘
```

**Error Message:**
```
┌─────────────────────────────────────────┐
│ ⚠️ This password has been found in a     │ ← Red gradient
│    data breach. Choose another.          │    Slide-in animation
└─────────────────────────────────────────┘
```

### 5. Invalid Token State
```
┌───────────────────────────────────────┐
│                                        │
│              ⏰                        │ ← Bounce animation
│         (3.5rem icon)                  │
│                                        │
│  This password reset link has expired  │
│  Links are valid for 1 hour.          │
│                                        │
│  Password reset links expire after     │
│  1 hour for security reasons.          │
│                                        │
│  ┌──────────────────────────────┐    │
│  │ 🔄 Request New Reset Link    │    │ ← Retry button
│  └──────────────────────────────┘    │
│                                        │
└───────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors
```
Dark Green:    ████ #2E3F36
Medium Green:  ████ #3a4a40
Golden:        ████ #AF7928
Golden Light:  ████ #c98f3a
```

### UI Colors
```
Background:    ████ #f8f9fa
Input BG:      ████ #f8f9fa
Border:        ████ #e9ecef
Text Primary:  ████ #2E3F36
Text Muted:    ████ #6c757d
```

### State Colors
```
Success:       ████ #28a745 → #34c759 (gradient)
Error:         ████ #dc3545
Warning:       ████ #AF7928
```

---

## ⚡ Animations Reference

### Entrance Animations (300ms ease)
- **slideIn**: Opacity 0→1, Y -10px→0px
- **fadeIn**: Opacity 0→1
- **bounce**: Y 0→-10px→0 (1s)

### Interactive Animations
- **pulse**: Scale 1→1.05→1 (2s infinite) - Lock icon breathing
- **shake**: X 0→-5px→5px→0 (300ms) - Error inputs
- **spin**: Rotate 360° (1s infinite) - Loading spinner
- **successPulse**: Scale 1→1.05→1 (500ms) - Button success

### Hover Effects (300ms ease)
- **Lift**: translateY(-2px)
- **Shadow**: Increase shadow spread
- **Shimmer**: Moving gradient overlay on buttons
- **Background**: Color change on security features

---

## 📱 Responsive Breakpoints

### Desktop (1024px+)
```
┌────────────────┬────────────────┐
│                │                │
│   Left Panel   │  Right Panel   │
│   (50% width)  │  (50% width)   │
│                │                │
└────────────────┴────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────┬──────────┐
│          │          │
│  Left    │  Right   │
│  Panel   │  Panel   │
│          │          │
└──────────┴──────────┘
Reduced padding + smaller text
```

### Mobile (< 768px)
```
┌──────────────────────┐
│                      │
│     Left Panel       │
│  (Stacked on top)    │
│                      │
├──────────────────────┤
│                      │
│    Right Panel       │
│    (Below)           │
│                      │
└──────────────────────┘
Vertical layout
```

### Small Mobile (< 480px)
```
┌──────────────┐
│              │
│ Compact Hero │
│              │
├──────────────┤
│              │
│ Compact Form │
│              │
└──────────────┘
Minimal spacing
```

---

## 🎯 Interactive States

### Input Field States

**Default:**
- Background: #f8f9fa
- Border: #e9ecef (2px)
- Padding: 1rem

**Focus:**
- Background: #ffffff
- Border: #AF7928 (golden)
- Shadow: 0 0 0 4px rgba(175,121,40,0.08)
- Transform: translateY(-1px)

**Error:**
- Background: #fff5f5
- Border: #dc3545 (red)
- Animation: shake

**With Toggle:**
- Eye icon in padding
- Hover: background glow
- Click: toggle password visibility

### Password Strength Meter

```
Weak:        [====              ]  Red
Fair:        [========          ]  Orange
Good:        [============      ]  Yellow
Strong:      [================  ]  Light Green
Very Strong: [==================]  Dark Green
```

### Button States

**Enabled:**
- Background: Gradient (#2E3F36 → #3a4a40)
- Hover: Lift + shimmer + shadow
- Cursor: pointer

**Disabled:**
- Opacity: 0.6
- Cursor: not-allowed
- No hover effects

**Loading:**
- Spinner icon rotating
- Text: "Updating Password..."
- Disabled interaction

**Success:**
- Background: Green gradient
- Icon: checkmark
- Text: "Password Updated Successfully!"
- Brief pulse animation

---

## 🔐 Security Features Section

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ 🛡️ Bank-level│  │ 🔒 Encrypted │  │ 🔐 Privacy   │ │
│  │   Security   │  │   Storage    │  │  Protected   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘

Hover effect: Lift + background color change
```

---

## 🎬 User Flow

### Successful Password Reset
```
1. User clicks reset link in email
   ↓
2. Page loads with form ready
   ↓
3. User enters new password
   ↓ (Password strength meter shows)
4. User confirms password
   ↓ (Match indicator shows)
5. User clicks "Update Password"
   ↓ (Button shows spinner)
6. Success message appears
   ↓ (Green gradient box with checkmark)
7. Auto-redirect timer starts (4s)
   ↓ (Spinning loader in timer)
8. Redirect to /login
```

### Expired Token Flow
```
1. User clicks old reset link
   ↓
2. Page detects expired token
   ↓
3. Form hidden, error state shown
   ↓
4. Clock icon bounces in
   ↓
5. Explanation text appears
   ↓
6. "Request New Reset Link" button
   ↓ (Golden gradient, hover effects)
7. Click redirects to /forgot-password
```

---

## 💡 Design Tips

### Visual Hierarchy (Top to Bottom)
1. **Lock Icon** - Most prominent (64px, animated)
2. **Heading** - Bold, 1.8rem
3. **Description** - Muted, 0.95rem
4. **Form Fields** - Large, interactive
5. **Button** - Primary action, gradient
6. **Footer Links** - Subtle, small
7. **Security Badges** - Supporting, background

### Spacing Scale
- XS: 0.5rem (8px)
- SM: 0.75rem (12px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- XXL: 2.5rem (40px)

### Typography
- **Font Family**: Poppins (sans-serif)
- **Heading**: 1.8rem, 700 weight
- **Body**: 0.95rem, 400 weight
- **Small**: 0.8rem, 400 weight
- **Button**: 0.95rem, 600 weight

---

## ✨ Special Effects

### Shimmer Button Effect
```css
Button has ::before pseudo-element
  ↓
Gradient overlay positioned left: -100%
  ↓
On hover: slides from left to right
  ↓
Creates "shine" effect across button
```

### Pulse Lock Icon
```css
Lock icon scales 1 → 1.05 → 1
  ↓
2 second duration
  ↓
Infinite loop
  ↓
Creates "breathing" effect
```

### Slide-in Messages
```css
Message starts: opacity: 0, Y: -10px
  ↓
Animates to: opacity: 1, Y: 0
  ↓
300ms ease timing
  ↓
Smooth entrance
```

---

## 📋 Testing Checklist

**Visual Testing:**
- [ ] Lock icon animates correctly
- [ ] Inputs show focus states
- [ ] Button shows hover shimmer
- [ ] Messages slide in smoothly
- [ ] Password toggle works
- [ ] Strength meter updates
- [ ] Invalid token shows correctly
- [ ] Responsive on all breakpoints

**Interaction Testing:**
- [ ] Can type in password fields
- [ ] Password visibility toggles
- [ ] Form submits correctly
- [ ] Loading state shows
- [ ] Success message appears
- [ ] Auto-redirect works (4s)
- [ ] Back button navigates
- [ ] Retry button navigates

**State Testing:**
- [ ] Valid token shows form
- [ ] Expired token shows error
- [ ] Used token shows error
- [ ] Invalid token shows error
- [ ] Weak password rejected
- [ ] Breached password rejected
- [ ] Mismatched passwords rejected
- [ ] Strong password accepted

---

## 🚀 Performance Notes

- All animations use `transform` and `opacity` (GPU-accelerated)
- Images lazy-loaded with Next.js Image component
- No JavaScript animations (pure CSS)
- Efficient selectors (no deep nesting)
- Minimal reflows and repaints
- Smooth 60fps animations

---

## 📦 Assets Required

- `/logo.svg` - Logo icon
- `/left-panel.svg` - Pattern overlay
- `/slide2.jpg` - Hero image (security theme)
- Font Awesome icons (CDN or package)

---

This visual guide provides a comprehensive overview of the redesigned reset password page!
