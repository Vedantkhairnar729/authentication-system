import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Generate verification token
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Send email verification
export const sendVerificationEmail = async (
  email: string,
  username: string,
  token: string
): Promise<void> => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Authentication System'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome, ${username}!</h2>
            <p>Thank you for registering. Please verify your email address to activate your account.</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <div class="footer">
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Authentication System'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #dc3545; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Password Reset Request</h2>
            <p>Hi ${username},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <div class="footer">
              <p>If you didn't request this, please ignore this email. Your password won't change.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send 2FA enabled notification
export const send2FAEnabledEmail = async (
  email: string,
  username: string
): Promise<void> => {
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Authentication System'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Two-Factor Authentication Enabled',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert { 
              padding: 15px; 
              background-color: #d4edda; 
              border: 1px solid #c3e6cb; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Security Update</h2>
            <p>Hi ${username},</p>
            <div class="alert">
              <strong>Two-Factor Authentication has been enabled on your account.</strong>
            </div>
            <p>Your account is now more secure. You'll need to enter a code from your authenticator app when you sign in.</p>
            <div class="footer">
              <p>If you didn't enable 2FA, please contact support immediately.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
  
  await transporter.sendMail(mailOptions);
};
