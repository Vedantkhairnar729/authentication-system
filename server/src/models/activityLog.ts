import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  ipAddress: string;
  userAgent: string;
  metadata?: any;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'register',
      'password_reset',
      'password_change',
      'email_verification',
      '2fa_enabled',
      '2fa_disabled',
      'profile_update',
      'avatar_upload',
      'session_revoked'
    ]
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days
  }
});

// Index for performance
ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
