import express from 'express';
import passport from '../config/passport';
import { authenticate } from '../middleware/authMiddleware';
import { 
  authLimiter, 
  passwordResetLimiter, 
  emailVerificationLimiter,
  uploadLimiter 
} from '../middleware/rateLimiter';
import { logActivity } from '../middleware/activityLogger';
import { isAdmin, isModerator, requirePermission } from '../middleware/rbacMiddleware';
import { uploadAvatar } from '../config/upload';
import { logout, getProfile } from '../controllers/authController';
import * as enhancedAuth from '../controllers/enhancedAuthController';
import { generateToken } from '../utils/jwt';

const router = express.Router();

// ========== Basic Auth Routes ==========
router.post('/register', authLimiter, enhancedAuth.register);
router.post('/login', authLimiter, logActivity('login'), enhancedAuth.login);
router.post('/logout', authenticate, logActivity('logout'), logout);
router.get('/profile', authenticate, getProfile);

// ========== Email Verification ==========
router.get('/verify-email', emailVerificationLimiter, enhancedAuth.verifyEmail);
router.post('/resend-verification', authenticate, emailVerificationLimiter, enhancedAuth.resendVerification);

// ========== Password Reset ==========
router.post('/forgot-password', passwordResetLimiter, enhancedAuth.forgotPassword);
router.post('/reset-password', passwordResetLimiter, logActivity('password_reset'), enhancedAuth.resetPassword);

// ========== Two-Factor Authentication ==========
router.post('/2fa/setup', authenticate, enhancedAuth.setup2FA);
router.post('/2fa/verify', authenticate, logActivity('2fa_enabled'), enhancedAuth.verify2FA);
router.post('/2fa/disable', authenticate, logActivity('2fa_disabled'), enhancedAuth.disable2FA);

// ========== Social Login - Google ==========
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: any, res) => {
    const token = generateToken({ 
      userId: req.user._id.toString(), 
      email: req.user.email 
    });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.redirect(`${process.env.CLIENT_URL}/dashboard?login=success`);
  }
);

// ========== Social Login - GitHub ==========
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'] 
  })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req: any, res) => {
    const token = generateToken({ 
      userId: req.user._id.toString(), 
      email: req.user.email 
    });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.redirect(`${process.env.CLIENT_URL}/dashboard?login=success`);
  }
);

// ========== Profile Picture Upload ==========
router.post('/avatar', 
  authenticate, 
  uploadLimiter,
  uploadAvatar.single('avatar'),
  logActivity('avatar_upload'),
  enhancedAuth.updateAvatar
);

// ========== Activity Logs ==========
router.get('/activity', authenticate, enhancedAuth.getActivity);

// ========== Session Management ==========
router.get('/sessions', authenticate, enhancedAuth.getSessions);
router.post('/sessions/revoke', authenticate, logActivity('session_revoked'), enhancedAuth.revokeSession);

// ========== Admin Routes (Examples) ==========
router.get('/admin/users', authenticate, isAdmin, async (req, res) => {
  // This is a placeholder for admin functionality
  res.json({ message: 'Admin access granted', endpoint: 'List all users' });
});

router.patch('/admin/users/:id/role', authenticate, isAdmin, async (req, res) => {
  // This is a placeholder for role management
  res.json({ message: 'Admin access granted', endpoint: 'Update user role' });
});

// ========== Moderator Routes (Examples) ==========
router.get('/moderator/reports', authenticate, isModerator, async (req, res) => {
  res.json({ message: 'Moderator access granted', endpoint: 'View reports' });
});

// ========== Permission-Based Routes (Examples) ==========
router.post('/content/publish', 
  authenticate, 
  requirePermission('publish_content'), 
  async (req, res) => {
    res.json({ message: 'Permission granted', endpoint: 'Publish content' });
  }
);

export default router;
