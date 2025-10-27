import { Request, Response } from 'express';
import { z } from 'zod';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import User from '../models/user';
import { AuthRequest } from '../middleware/authMiddleware';
import { registerUser, loginUser } from '../services/authService';
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  send2FAEnabledEmail,
  generateVerificationToken 
} from '../services/emailService';
import { getUserActivityLogs } from '../middleware/activityLogger';
import { uploadAvatar, deleteAvatar } from '../config/upload';
import bcrypt from 'bcryptjs';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  twoFactorCode: z.string().optional()
});

// Register with email verification
export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);

    const result = await registerUser(email, username, password);
    
    // Generate verification token
    const verificationToken = generateVerificationToken();
    const user = await User.findById(result.user.id);
    
    if (user) {
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();
      
      // Send verification email
      await sendVerificationEmail(email, username, verificationToken);
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Resend verification email
export const resendVerification = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, user.username, verificationToken);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login with 2FA support
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, twoFactorCode } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({ 
        error: 'Account locked due to too many failed attempts. Try again later.' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({ 
          requires2FA: true,
          message: 'Please enter your 2FA code'
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: twoFactorCode
      });

      if (!verified) {
        return res.status(401).json({ error: 'Invalid 2FA code' });
      }
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const result = await loginUser(email, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If your email is registered, you will receive a password reset link.' });
    }

    const resetToken = generateVerificationToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, user.username, resetToken);

    res.json({ message: 'If your email is registered, you will receive a password reset link.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Setup 2FA
export const setup2FA = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const secret = speakeasy.generateSecret({
      name: `${process.env.APP_NAME || 'Auth App'} (${user.email})`
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Verify and enable 2FA
export const verify2FA = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret!,
      encoding: 'base32',
      token: code
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    await send2FAEnabledEmail(user.email, user.username);

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Disable 2FA
export const disable2FA = async (req: AuthRequest, res: Response) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user || !user.password) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload avatar
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const oldFilename = user.avatar.split('/').pop();
      if (oldFilename) {
        deleteAvatar(oldFilename);
      }
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({ 
      message: 'Avatar updated successfully',
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user activity logs
export const getActivity = async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = await getUserActivityLogs(req.user!.userId, limit);

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get active sessions
export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('activeSessions');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ sessions: user.activeSessions });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Revoke session
export const revokeSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.activeSessions = user.activeSessions.filter(s => s !== sessionId);
    await user.save();

    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Existing exports
export { logout, getProfile } from './authController';
