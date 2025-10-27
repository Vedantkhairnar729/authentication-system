import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import path from 'path';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import enhancedAuthRoutes from './routes/enhancedAuth';
import { apiLimiter } from './middleware/rateLimiter';
import { setupSwagger } from './config/swagger';
import './config/passport'; // Initialize passport strategies

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Rate limiting
app.use('/api', apiLimiter);

// Static files (for avatars)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger API Documentation
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes); // Basic auth routes (backward compatible)
app.use('/api/auth', enhancedAuthRoutes); // Enhanced auth routes with all features

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running', 
    database: 'MongoDB connected',
    features: [
      'Email Verification',
      'Password Reset',
      'Social Login (Google, GitHub)',
      'Two-Factor Authentication',
      'Role-Based Access Control',
      'Profile Picture Upload',
      'Session Management',
      'Activity Logs',
      'Rate Limiting',
      'API Documentation (Swagger)'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
  console.log(`✨ Features: Email verification, 2FA, Social login, RBAC, and more!`);
});
