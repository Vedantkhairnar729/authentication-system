import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

// Check if user has required role
export const requireRole = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const User = require('../models/user').default;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          error: 'Access denied. Insufficient permissions.',
          requiredRole: roles,
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
};

// Check if user has required permission
export const requirePermission = (...permissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const User = require('../models/user').default;
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Admin has all permissions
      if (user.role === 'admin') {
        return next();
      }

      // Check if user has at least one of the required permissions
      const hasPermission = permissions.some(permission => 
        user.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Access denied. Insufficient permissions.',
          requiredPermissions: permissions,
          userPermissions: user.permissions
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
};

// Check if user is admin
export const isAdmin = requireRole('admin');

// Check if user is moderator or admin
export const isModerator = requireRole('admin', 'moderator');
