import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      emailVerified: true // Only allow password reset for verified users
    });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, you will receive a password reset link.',
      });
    }

    // Generate secure random token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token expiration to 1 hour from now
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Update user with password reset token
    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: resetToken,
      passwordResetExpires: tokenExpires,
    });

    // Create password reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(email, resetLink);
      
      if (!emailResult.success) {
        console.error('Failed to send password reset email:', emailResult.error);
        return NextResponse.json(
          { success: false, message: 'Failed to send password reset email' },
          { status: 500 }
        );
      } else {
        console.log('Password reset email sent successfully:', emailResult.messageId);
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      return NextResponse.json(
        { success: false, message: 'Email service unavailable' },
        { status: 500 }
      );
    }

    // In development, also log the reset link for testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development password reset link for ${email}: ${resetLink}`);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, you will receive a password reset link.',
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}