import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_FROM!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  });
};

// Send magic link email
export const sendMagicLinkEmail = async (email: string, magicLink: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"GrowLokal" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email - GrowLokal',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: 'Poppins', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #2E3F36;
              font-size: 2rem;
              margin: 0;
              font-weight: 600;
            }
            .content {
              text-align: center;
            }
            .content h2 {
              color: #2E3F36;
              font-size: 1.5rem;
              margin-bottom: 20px;
            }
            .content p {
              color: #666;
              font-size: 1rem;
              margin-bottom: 20px;
            }
            .verify-button {
              display: inline-block;
              background-color: #AF7928;
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 5px;
              font-weight: 600;
              font-size: 1rem;
              margin: 20px 0;
              transition: background-color 0.3s;
            }
            .verify-button:hover {
              background-color: #956520;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #888;
              font-size: 0.9rem;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>GrowLokal</h1>
            </div>
            
            <div class="content">
              <h2>Welcome to GrowLokal!</h2>
              <p>Thank you for signing up. To complete your registration and start exploring local businesses, please verify your email address.</p>
              
              <a href="${magicLink}" class="verify-button">Verify Email Address</a>
              
              <div class="warning">
                <p><strong>Important:</strong> This verification link will expire in 1 hour for security reasons.</p>
              </div>
              
              <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #AF7928; font-size: 0.9rem;">${magicLink}</p>
              
              <p>If you didn't create an account with GrowLokal, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 GrowLokal. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to GrowLokal!
      
      Thank you for signing up. To complete your registration, please verify your email address by clicking the link below:
      
      ${magicLink}
      
      This verification link will expire in 1 hour.
      
      If you didn't create an account with GrowLokal, you can safely ignore this email.
      
      © 2025 GrowLokal. All rights reserved.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"GrowLokal" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset your password - GrowLokal',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: 'Poppins', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #2E3F36;
              font-size: 2rem;
              margin: 0;
              font-weight: 600;
            }
            .content {
              text-align: center;
            }
            .content h2 {
              color: #2E3F36;
              font-size: 1.5rem;
              margin-bottom: 20px;
            }
            .content p {
              color: #666;
              font-size: 1rem;
              margin-bottom: 20px;
            }
            .reset-button {
              display: inline-block;
              background-color: #AF7928;
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 5px;
              font-weight: 600;
              font-size: 1rem;
              margin: 20px 0;
              transition: background-color 0.3s;
            }
            .reset-button:hover {
              background-color: #956520;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #888;
              font-size: 0.9rem;
            }
            .warning {
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              color: #721c24;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>GrowLokal</h1>
            </div>
            
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. If you made this request, click the button below to set a new password.</p>
              
              <a href="${resetLink}" class="reset-button">Reset Password</a>
              
              <div class="warning">
                <p><strong>Security Notice:</strong> This reset link will expire in 1 hour for your security.</p>
              </div>
              
              <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #AF7928; font-size: 0.9rem;">${resetLink}</p>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 GrowLokal. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Password - GrowLokal
      
      We received a request to reset your password. If you made this request, click the link below to set a new password:
      
      ${resetLink}
      
      This reset link will expire in 1 hour for your security.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      © 2025 GrowLokal. All rights reserved.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Password reset email sending failed:', error);
    return { success: false, error: error };
  }
};