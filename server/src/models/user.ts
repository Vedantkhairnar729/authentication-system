import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password?: string;
  createdAt: Date;
  
  // Email verification
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  
  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  
  // Social login
  googleId?: string;
  githubId?: string;
  provider?: 'local' | 'google' | 'github';
  
  // Two-factor authentication
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  
  // User roles & permissions
  role: 'user' | 'admin' | 'moderator';
  permissions: string[];
  
  // Profile picture
  avatar?: string;
  
  // Activity tracking
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  // Session management
  activeSessions: string[];
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username must not exceed 20 characters']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Social login
  googleId: String,
  githubId: String,
  provider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  
  // Two-factor authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  
  // User roles & permissions
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  permissions: {
    type: [String],
    default: []
  },
  
  // Profile picture
  avatar: String,
  
  // Activity tracking
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Session management
  activeSessions: {
    type: [String],
    default: []
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ githubId: 1 });

export default mongoose.model<IUser>('User', UserSchema);
