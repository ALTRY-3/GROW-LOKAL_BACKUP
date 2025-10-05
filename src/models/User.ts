import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  passwordResetTokenUsed: boolean;
  provider: 'email' | 'google' | 'facebook';
  providerId?: string;
  image?: string;
  failedLoginAttempts: number;
  lastFailedLogin: Date | null;
  accountLockedUntil: Date | null;
  // Profile fields
  fullName?: string;
  phone?: string;
  address?: {
    street?: string;
    barangay?: string;
    city?: string;
    province?: string;
    region?: string;
    postalCode?: string;
  };
  gender?: 'male' | 'female' | 'other' | '';
  profilePicture?: string;
  isSeller: boolean;
  shopId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: function(this: IUser) {
        return this.provider === 'email';
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    passwordResetTokenUsed: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ['email', 'google', 'facebook'],
      default: 'email',
    },
    providerId: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedLogin: {
      type: Date,
      default: null,
    },
    accountLockedUntil: {
      type: Date,
      default: null,
    },
    // Profile fields
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      barangay: { type: String, trim: true },
      city: { type: String, trim: true },
      province: { type: String, trim: true },
      region: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    profilePicture: {
      type: String,
      default: '/default-profile.jpg',
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new) and exists
  if (!this.isModified('password') || !this.password) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent re-compilation during development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;