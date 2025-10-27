import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import ActivityLog from '../models/activityLog';

export const logActivity = (action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.get('user-agent') || 'unknown';

        await ActivityLog.create({
          userId: req.user.userId,
          action,
          ipAddress,
          userAgent,
          metadata: {
            path: req.path,
            method: req.method,
            body: action === 'login' ? undefined : req.body // Don't log passwords
          }
        });
      }
      next();
    } catch (error) {
      // Don't fail the request if logging fails
      console.error('Activity logging error:', error);
      next();
    }
  };
};

// Get user activity logs
export const getUserActivityLogs = async (userId: string, limit: number = 50) => {
  return await ActivityLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v');
};
