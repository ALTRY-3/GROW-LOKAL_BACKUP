# Profile Page - Complete Functionality Implementation Prompt

## 🎯 Overview
The profile page currently uses mock data and has several non-functional features. This prompt outlines all missing functionality that needs to be implemented to make the profile page fully operational.

---

## 📋 Current State Analysis

### ✅ What's Working:
- UI layout and responsive design
- Section navigation (Profile, Orders, Start Selling/My Shop)
- Form inputs and state management
- Modal displays
- CSS styling and animations

### ❌ What's Missing:
1. **User Authentication Integration**
2. **Profile Data API Integration**
3. **Order Management System**
4. **Image Upload Functionality**
5. **Seller Registration System**
6. **Form Validation**
7. **Data Persistence**
8. **Error Handling**

---

## 🔧 Required Implementations

### 1. **User Authentication & Session Management**

#### **Current Issue:**
- Using hardcoded `mockUser` data
- No integration with NextAuth session
- No user ID tracking

#### **Required Changes:**

**Import NextAuth:**
```typescript
import { useSession } from "next-auth/react";
```

**Replace Mock Data with Session:**
```typescript
// Remove mockUser
const { data: session, status } = useSession();

// Add loading and unauthenticated states
if (status === "loading") {
  return <div>Loading profile...</div>;
}

if (status === "unauthenticated") {
  router.push('/login');
  return null;
}

const userId = session?.user?.id;
const userEmail = session?.user?.email;
```

#### **API Endpoint Needed:**
- `GET /api/user/profile` - Fetch user profile data
- `PUT /api/user/profile` - Update user profile

---

### 2. **Profile Data Management**

#### **Current Issue:**
- Data only exists in component state
- No fetch from database
- No save to database

#### **Required Implementation:**

**Create API Route: `/src/app/api/user/profile/route.ts`**
```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

// GET - Fetch user profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        fullName: user.fullName || user.name,
        email: user.email,
        phone: user.phone || '',
        profilePicture: user.profilePicture || '/default-profile.jpg',
        address: {
          street: user.address?.street || '',
          barangay: user.address?.barangay || '',
          city: user.address?.city || '',
          province: user.address?.province || '',
          region: user.address?.region || '',
          postalCode: user.address?.postalCode || ''
        },
        gender: user.gender || '',
        isSeller: user.isSeller || false
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, address, gender, profilePicture } = body;

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        fullName,
        phone,
        address,
        gender,
        profilePicture,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}
```

**Update User Model: `/src/models/User.ts`**
```typescript
// Add these fields to User schema:
fullName: { type: String },
phone: { type: String },
address: {
  street: String,
  barangay: String,
  city: String,
  province: String,
  region: String,
  postalCode: String
},
gender: { type: String, enum: ['male', 'female', 'other', ''] },
profilePicture: { type: String, default: '/default-profile.jpg' },
isSeller: { type: Boolean, default: false },
updatedAt: { type: Date, default: Date.now }
```

**Fetch Profile Data on Load:**
```typescript
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setFullName(data.data.fullName);
        setEmail(data.data.email);
        setPhone(data.data.phone);
        setStreet(data.data.address.street);
        setBarangay(data.data.address.barangay);
        setCity(data.data.address.city);
        setProvince(data.data.address.province);
        setRegion(data.data.address.region);
        setPostal(data.data.address.postalCode);
        setIsSeller(data.data.isSeller);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (session?.user) {
    fetchProfile();
  }
}, [session]);
```

**Save Profile Handler:**
```typescript
const handleSaveProfile = async () => {
  try {
    setIsSaving(true);
    
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        phone,
        address: {
          street,
          barangay,
          city,
          province,
          region,
          postalCode: postal
        },
        gender: selectedGender
      })
    });

    const data = await response.json();
    
    if (data.success) {
      setShowSaveModal(true);
      setTimeout(() => setShowSaveModal(false), 2000);
    } else {
      setShowSaveError(true);
    }
  } catch (error) {
    setShowSaveError(true);
  } finally {
    setIsSaving(false);
  }
};
```

---

### 3. **Image Upload Functionality**

#### **Current Issue:**
- Profile picture upload doesn't work
- No image storage implementation
- No file validation

#### **Required Implementation:**

**Install Dependencies:**
```bash
npm install cloudinary multer
```

**Create Upload API: `/src/app/api/upload/route.ts`**
```typescript
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExt}`;
    const filepath = join(process.cwd(), 'public', 'uploads', 'profiles', filename);

    // Save file
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: `/uploads/profiles/${filename}`
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
```

**Create Upload Directory:**
```bash
mkdir -p public/uploads/profiles
```

**Profile Picture Upload Handler:**
```typescript
const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image too large. Maximum size is 5MB');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setProfilePicture(data.data.url);
      
      // Update user profile with new picture
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: data.data.url })
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload image');
  }
};
```

---

### 4. **Orders Management System**

#### **Current Issue:**
- Hardcoded mock orders
- No real order data from database
- Actions (Confirm, Rate, View Store) don't work

#### **Required Implementation:**

**Create Orders API: `/src/app/api/user/orders/route.ts`**
```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'shipping', 'completed', 'cancelled'

    await connectDB();
    
    let query: any = { userId: session.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.productId')
      .populate('sellerId', 'name shopName')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}
```

**Create Order Model: `/src/models/Order.ts`**
```typescript
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'shipping', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  shippingAddress: {
    street: String,
    barangay: String,
    city: String,
    province: String,
    region: String,
    postalCode: String
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
```

**Fetch Orders:**
```typescript
const [orders, setOrders] = useState([]);
const [isLoadingOrders, setIsLoadingOrders] = useState(false);

useEffect(() => {
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const statusParam = activeOrdersTab === 'All' ? 'all' : activeOrdersTab.toLowerCase();
      const response = await fetch(`/api/user/orders?status=${statusParam}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  if (activeSection === 'orders' && session?.user) {
    fetchOrders();
  }
}, [activeSection, activeOrdersTab, session]);
```

**Confirm Receipt Handler:**
```typescript
const handleConfirmReceipt = async (orderId: string) => {
  try {
    const response = await fetch(`/api/user/orders/${orderId}/confirm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    
    if (data.success) {
      setConfirmedOrders(prev => new Set(prev).add(orderId));
      setActiveOrdersTab('Completed');
      setSuccessMessage('Order confirmed as received!');
      setShowSuccessModal(true);
      
      // Refresh orders
      fetchOrders();
    }
  } catch (error) {
    console.error('Error confirming order:', error);
  }
};
```

**Rate Order Handler:**
```typescript
const handleRateOrder = async (orderId: string, rating: number) => {
  try {
    const response = await fetch(`/api/user/orders/${orderId}/rate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating })
    });

    const data = await response.json();
    
    if (data.success) {
      setOrderRatings(prev => ({ ...prev, [orderId]: rating }));
      setSuccessMessage('Thank you for rating!');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    }
  } catch (error) {
    console.error('Error rating order:', error);
  }
};
```

---

### 5. **Seller Registration System**

#### **Current Issue:**
- Seller registration doesn't persist
- No validation of seller data
- No email verification

#### **Required Implementation:**

**Create Seller Registration API: `/src/app/api/seller/register/route.ts`**
```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Shop from "@/models/Shop";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { shopName, pickupAddress, pickupBarangay, shopEmail, phone, sellerStory, validIdUrl } = body;

    // Validation
    if (!shopName || !pickupAddress || !pickupBarangay || !shopEmail || !phone || !validIdUrl) {
      return NextResponse.json({ 
        success: false, 
        message: "All fields are required" 
      }, { status: 400 });
    }

    await connectDB();

    // Check if shop name already exists
    const existingShop = await Shop.findOne({ shopName });
    if (existingShop) {
      return NextResponse.json({ 
        success: false, 
        message: "Shop name already taken" 
      }, { status: 400 });
    }

    // Create shop
    const shop = await Shop.create({
      userId: session.user.id,
      shopName,
      pickupAddress: {
        street: pickupAddress,
        barangay: pickupBarangay
      },
      email: shopEmail,
      phone,
      story: sellerStory,
      validId: validIdUrl,
      status: 'pending', // Needs admin approval
      createdAt: new Date()
    });

    // Update user to seller
    await User.findByIdAndUpdate(session.user.id, { 
      isSeller: true,
      shopId: shop._id 
    });

    return NextResponse.json({
      success: true,
      message: "Seller registration submitted successfully",
      data: shop
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Registration failed" 
    }, { status: 500 });
  }
}
```

**Create Shop Model: `/src/models/Shop.ts`**
```typescript
import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopName: { type: String, required: true, unique: true },
  pickupAddress: {
    street: String,
    barangay: String
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  story: { type: String },
  validId: { type: String, required: true },
  logo: { type: String, default: '/default-shop-logo.png' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
```

**Seller Registration Handler:**
```typescript
const handleSellerRegistration = async () => {
  // Validation
  if (!isShopInfoComplete) {
    alert('Please fill all required fields');
    return;
  }

  try {
    setLoadingSubmit(true);

    const response = await fetch('/api/seller/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopName,
        pickupAddress,
        pickupBarangay,
        shopEmail,
        phone,
        sellerStory,
        validIdUrl: validIdFile ? await uploadFile(validIdFile) : ''
      })
    });

    const data = await response.json();

    if (data.success) {
      setIsSeller(true);
      setShowSubmitModal(true);
      setShowProgressModal(false);
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Failed to submit registration');
  } finally {
    setLoadingSubmit(false);
  }
};
```

---

### 6. **Form Validation**

#### **Required Implementation:**

```typescript
// Email validation
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Phone validation (Philippine format)
const validatePhone = (phone: string) => {
  const re = /^(09|\+639)\d{9}$/;
  return re.test(phone);
};

// Postal code validation
const validatePostalCode = (code: string) => {
  return /^\d{4}$/.test(code);
};

// Form validation before save
const validateProfileForm = () => {
  const errors = [];

  if (!fullName.trim()) errors.push('Full name is required');
  if (!email.trim()) errors.push('Email is required');
  if (!validateEmail(email)) errors.push('Invalid email format');
  if (phone && !validatePhone(phone)) errors.push('Invalid phone format (09XXXXXXXXX)');
  if (postal && !validatePostalCode(postal)) errors.push('Invalid postal code (4 digits)');
  if (!region) errors.push('Region is required');
  if (!province) errors.push('Province is required');
  if (!city) errors.push('City is required');

  return errors;
};

// Use in save handler
const handleSaveProfile = async () => {
  const errors = validateProfileForm();
  
  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  // Proceed with save...
};
```

---

### 7. **Search Functionality for Orders**

#### **Current Issue:**
- Search input doesn't work

#### **Required Implementation:**

```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredOrders = orders.filter(order => {
  const query = searchQuery.toLowerCase();
  return (
    order.items.some(item => 
      item.productId?.name?.toLowerCase().includes(query)
    ) ||
    order.sellerId?.shopName?.toLowerCase().includes(query)
  );
});

// Use filteredOrders instead of orders in rendering
```

---

### 8. **Loading States & Error Handling**

#### **Required Implementation:**

```typescript
// Add loading states
const [isSaving, setIsSaving] = useState(false);
const [isLoadingProfile, setIsLoadingProfile] = useState(false);
const [isLoadingOrders, setIsLoadingOrders] = useState(false);

// Add error states
const [profileError, setProfileError] = useState('');
const [ordersError, setOrdersError] = useState('');

// Show loading indicators
{isLoadingProfile && <div className="loading-spinner">Loading profile...</div>}
{isLoadingOrders && <div className="loading-spinner">Loading orders...</div>}

// Show errors
{profileError && <div className="error-message">{profileError}</div>}
{ordersError && <div className="error-message">{ordersError}</div>}

// Disable buttons while loading
<button 
  className="save-btn" 
  onClick={handleSaveProfile}
  disabled={isSaving}
>
  {isSaving ? 'Saving...' : 'SAVE'}
</button>
```

---

## 📦 Required Dependencies

```bash
npm install uuid
npm install @types/uuid --save-dev
```

---

## 🗄️ Database Schema Updates

### **User Model Updates:**
```typescript
// Add to existing User model
fullName: String,
phone: String,
address: {
  street: String,
  barangay: String,
  city: String,
  province: String,
  region: String,
  postalCode: String
},
gender: String,
profilePicture: String,
isSeller: { type: Boolean, default: false },
shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }
```

### **New Models Needed:**
1. `Order.ts` - For order management
2. `Shop.ts` - For seller shops
3. `Product.ts` - For products (if not exists)

---

## 🔐 Security Considerations

1. **File Upload Security:**
   - Validate file types and sizes
   - Sanitize filenames
   - Store in secure location
   - Consider using cloud storage (Cloudinary, S3)

2. **API Security:**
   - Always verify session before operations
   - Validate all inputs
   - Use try-catch blocks
   - Rate limiting for uploads

3. **Data Validation:**
   - Server-side validation for all forms
   - Sanitize user inputs
   - Prevent SQL injection (using Mongoose helps)

---

## 🧪 Testing Checklist

After implementation, test:

- [ ] Profile loads user data from database
- [ ] Profile picture upload works
- [ ] Profile save persists to database
- [ ] Form validation prevents invalid data
- [ ] Orders load from database
- [ ] Order filtering by status works
- [ ] Search orders works
- [ ] Confirm receipt updates order status
- [ ] Rating saves to database
- [ ] Seller registration submits successfully
- [ ] Valid ID upload works
- [ ] Loading states display correctly
- [ ] Error messages show for failures
- [ ] Logout clears profile data

---

## 📝 Implementation Priority

1. **High Priority (Core Functionality):**
   - User authentication integration
   - Profile data fetch and save
   - Orders management
   - Form validation

2. **Medium Priority (Enhanced UX):**
   - Image upload
   - Search functionality
   - Loading states
   - Error handling

3. **Low Priority (Optional):**
   - Seller registration
   - Shop management
   - Advanced filtering

---

## 🚀 Next Steps

1. Create all API routes
2. Update database models
3. Implement fetch functions in ProfilePage component
4. Add form validation
5. Implement image upload
6. Add loading and error states
7. Test all functionality
8. Add error boundaries for production

---

*This prompt provides a complete roadmap for implementing all missing functionality in the profile page. Follow each section systematically for a fully functional profile system.*
