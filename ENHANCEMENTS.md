# 🚀 Enhanced Features Documentation

This document describes all the enhanced features added to the authentication system.

## 📋 Table of Contents

1. [Email Verification](#email-verification)
2. [Password Reset](#password-reset)
3. [Social Login (Google & GitHub)](#social-login)
4. [Two-Factor Authentication (2FA)](#two-factor-authentication)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Profile Picture Upload](#profile-picture-upload)
7. [Session Management](#session-management)
8. [Activity Logs](#activity-logs)
9. [Rate Limiting](#rate-limiting)
10. [API Documentation (Swagger)](#api-documentation)

---

## 1. Email Verification

### Features
- Email verification token generation
- Automated email sending with HTML templates
- Token expiration (24 hours)
- Resend verification functionality

### API Endpoints

#### Register (with email verification)
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "..."
}
```

#### Verify Email
```http
GET /api/auth/verify-email?token=<verification-token>
```

#### Resend Verification
```http
POST /api/auth/resend-verification
Authorization: Bearer <token>
```

### Email Configuration

Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_NAME=Authentication System
```

**Gmail Setup:**
1. Enable 2FA on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `SMTP_PASS`

---

## 2. Password Reset

### Features
- Secure token-based password reset
- Email notification with reset link
- Token expiration (1 hour)
- Rate limiting (3 requests per hour)

### API Endpoints

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "<reset-token>",
  "newPassword": "newpassword123"
}
```

### Frontend Integration

Create a reset password page at `/reset-password`:

```typescript
const token = new URLSearchParams(window.location.search).get('token');

// Submit form with token and new password
await axios.post('/api/auth/reset-password', {
  token,
  newPassword
});
```

---

## 3. Social Login

### Supported Providers
- ✅ Google OAuth 2.0
- ✅ GitHub OAuth

### Setup

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
3. Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Secret to `.env`:

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### API Endpoints

#### Google Login
```http
GET /api/auth/google
```

Redirects to Google login page, then back to:
```http
GET /api/auth/google/callback
```

#### GitHub Login
```http
GET /api/auth/github
```

Redirects to GitHub login page, then back to:
```http
GET /api/auth/github/callback
```

### Frontend Integration

```tsx
<button onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}>
  Login with Google
</button>

<button onClick={() => window.location.href = 'http://localhost:5000/api/auth/github'}>
  Login with GitHub
</button>
```

---

## 4. Two-Factor Authentication

### Features
- TOTP-based 2FA (Time-based One-Time Password)
- QR code generation for authenticator apps
- Backup codes (future enhancement)
- Email notification on 2FA enable/disable

### API Endpoints

#### Setup 2FA
```http
POST /api/auth/2fa/setup
Authorization: Bearer <token>
```

**Response:**
```json
{
  "secret": "BASE32_SECRET",
  "qrCode": "data:image/png;base64,..."
}
```

#### Verify & Enable 2FA
```http
POST /api/auth/2fa/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```

#### Login with 2FA
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "twoFactorCode": "123456"
}
```

#### Disable 2FA
```http
POST /api/auth/2fa/disable
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "password123"
}
```

### Compatible Authenticator Apps
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Bitwarden

### Frontend Integration

```tsx
import QRCode from 'qrcode.react';

// 1. Setup 2FA
const { secret, qrCode } = await axios.post('/api/auth/2fa/setup');

// 2. Display QR code
<img src={qrCode} alt="Scan with authenticator app" />

// 3. User enters code from app
const code = '123456';
await axios.post('/api/auth/2fa/verify', { code });
```

---

## 5. User Roles & Permissions

### Roles
- `user` - Default role
- `moderator` - Elevated privileges
- `admin` - Full access

### Features
- Role-based access control (RBAC)
- Custom permissions system
- Middleware for route protection

### API Endpoints

#### Admin Only
```http
GET /api/auth/admin/users
Authorization: Bearer <admin-token>
```

#### Moderator or Admin
```http
GET /api/auth/moderator/reports
Authorization: Bearer <moderator-or-admin-token>
```

#### Permission-Based
```http
POST /api/auth/content/publish
Authorization: Bearer <token-with-publish-permission>
```

### Usage in Routes

```typescript
import { isAdmin, isModerator, requirePermission } from './middleware/rbacMiddleware';

// Admin only
router.get('/admin/dashboard', authenticate, isAdmin, handler);

// Moderator or Admin
router.get('/moderation', authenticate, isModerator, handler);

// Custom permission
router.post('/publish', authenticate, requirePermission('publish_content'), handler);
```

### Assigning Roles

Update user in database:
```javascript
await User.findByIdAndUpdate(userId, {
  role: 'admin',
  permissions: ['publish_content', 'edit_content', 'delete_content']
});
```

---

## 6. Profile Picture Upload

### Features
- Image upload with Multer
- File type validation (jpeg, jpg, png, gif, webp)
- File size limit (5MB)
- Automatic old avatar deletion
- Static file serving

### API Endpoints

#### Upload Avatar
```http
POST /api/auth/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>
```

**Response:**
```json
{
  "message": "Avatar updated successfully",
  "avatar": "/uploads/avatars/abc123.jpg"
}
```

### Frontend Integration

```tsx
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await axios.post('/api/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  console.log('Avatar URL:', response.data.avatar);
};

<input type="file" accept="image/*" onChange={(e) => {
  if (e.target.files) handleUpload(e.target.files[0]);
}} />
```

### Storage Location

Avatars are stored in: `server/uploads/avatars/`

Served at: `http://localhost:5000/uploads/avatars/<filename>`

---

## 7. Session Management

### Features
- Track active sessions
- View all sessions
- Revoke specific sessions
- Automatic session cleanup

### API Endpoints

#### Get Active Sessions
```http
GET /api/auth/sessions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "sessions": ["session-id-1", "session-id-2"]
}
```

#### Revoke Session
```http
POST /api/auth/sessions/revoke
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "session-id-1"
}
```

### Frontend Integration

```tsx
const sessions = await axios.get('/api/auth/sessions');

// Display sessions
sessions.data.sessions.map(sessionId => (
  <div>
    Session: {sessionId}
    <button onClick={() => revokeSession(sessionId)}>Revoke</button>
  </div>
));

const revokeSession = async (sessionId: string) => {
  await axios.post('/api/auth/sessions/revoke', { sessionId });
};
```

---

## 8. Activity Logs

### Features
- Automatic activity tracking
- IP address logging
- User agent tracking
- 30-day auto-deletion
- Query by user

### Tracked Actions
- `login`
- `logout`
- `register`
- `password_reset`
- `password_change`
- `email_verification`
- `2fa_enabled`
- `2fa_disabled`
- `profile_update`
- `avatar_upload`
- `session_revoked`

### API Endpoints

#### Get User Activity
```http
GET /api/auth/activity?limit=50
Authorization: Bearer <token>
```

**Response:**
```json
{
  "logs": [
    {
      "_id": "...",
      "userId": "...",
      "action": "login",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-10-27T12:00:00.000Z"
    }
  ]
}
```

### Usage in Controllers

```typescript
import { logActivity } from './middleware/activityLogger';

router.post('/login', logActivity('login'), loginHandler);
router.post('/logout', authenticate, logActivity('logout'), logoutHandler);
```

---

## 9. Rate Limiting

### Features
- IP-based rate limiting
- Different limits for different endpoints
- Redis support (optional)
- Custom error messages

### Rate Limits

| Endpoint Type | Window | Max Requests |
|--------------|--------|--------------|
| General API | 15 min | 100 |
| Auth (login) | 15 min | 5 |
| Password Reset | 1 hour | 3 |
| Email Verification | 1 hour | 3 |
| File Upload | 1 hour | 10 |

### Configuration

```typescript
import { authLimiter, passwordResetLimiter } from './middleware/rateLimiter';

router.post('/login', authLimiter, loginHandler);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordHandler);
```

### Error Response

```json
{
  "error": "Too many login attempts, please try again after 15 minutes."
}
```

---

## 10. API Documentation

### Features
- **Swagger UI** - Interactive API documentation
- **OpenAPI 3.0** - Industry standard specification
- **Auto-generated** - From JSDoc comments
- **Try it out** - Test endpoints directly in browser

### Access Documentation

```
http://localhost:5000/api-docs
```

### JSON Specification

```
http://localhost:5000/api-docs.json
```

### Screenshots

The Swagger UI provides:
- ✅ List of all endpoints
- ✅ Request/response schemas
- ✅ Authentication methods
- ✅ Interactive testing
- ✅ Code examples

### Adding Documentation to Routes

```typescript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post('/register', registerHandler);
```

---

## 🔧 Environment Variables Summary

Complete `.env` file with all features:

```env
# Server
PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/auth_db

# JWT
JWT_SECRET=your-super-secret-min-32-characters
JWT_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_NAME=Authentication System

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start server:**
   ```bash
   npm run dev
   ```

4. **Access documentation:**
   ```
   http://localhost:5000/api-docs
   ```

---

## 🧪 Testing

### Test Email Verification
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

### Test 2FA Setup
```bash
curl -X POST http://localhost:5000/api/auth/2fa/setup \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Rate Limiting
```bash
# Make 6 login attempts to trigger rate limit
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

---

## 📝 Next Steps

Potential future enhancements:
- [ ] Backup codes for 2FA
- [ ] SMS authentication
- [ ] Biometric authentication
- [ ] OAuth for more providers (Twitter, LinkedIn)
- [ ] Advanced analytics dashboard
- [ ] Email templates customization
- [ ] Multi-language support
- [ ] CAPTCHA integration
- [ ] IP whitelisting/blacklisting
- [ ] Audit trail exports

---

## 🤝 Contributing

To add more features:

1. Create new controller in `server/src/controllers/`
2. Add middleware in `server/src/middleware/`
3. Define routes in `server/src/routes/`
4. Update this documentation
5. Add Swagger documentation
6. Write tests

---

## 📚 Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Speakeasy (2FA)](https://github.com/speakeasy-npm/speakeasy)
- [Nodemailer](https://nodemailer.com/)
- [Multer](https://github.com/expressjs/multer)
- [Swagger/OpenAPI](https://swagger.io/)
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)

---

**All features are production-ready and thoroughly tested!** 🎉
