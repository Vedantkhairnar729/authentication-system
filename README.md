# 🔐 Vite Express Authentication# Vite Express Authentication Project



A complete, production-ready authentication system built with **Vite**, **Express**, **Node.js**, **TypeScript**, and **MongoDB Atlas**.This project is a full-stack authentication application built using Vite for the client-side and Express for the server-side. It allows users to register and log in, managing authentication state with JSON Web Tokens (JWT).



![Status](https://img.shields.io/badge/status-active-success.svg)## Project Structure

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue.svg)```

![License](https://img.shields.io/badge/license-ISC-blue.svg)vite-express-auth

├── client                # Client-side application

---│   ├── index.html       # Main HTML file for the client

│   ├── package.json      # Client package configuration

## 📋 Table of Contents│   ├── vite.config.ts    # Vite configuration

│   ├── tsconfig.json     # TypeScript configuration for the client

- [Features](#-features)│   └── src               # Source files for the client

- [Tech Stack](#-tech-stack)│       ├── main.ts       # Entry point for the client application

- [Project Structure](#-project-structure)│       ├── App.tsx       # Main App component

- [Prerequisites](#-prerequisites)│       ├── pages         # Contains Login and Register pages

- [Installation](#-installation)│       │   ├── Login.tsx

- [Configuration](#-configuration)│       │   └── Register.tsx

- [Running the Application](#-running-the-application)│       ├── components     # Reusable components

- [API Endpoints](#-api-endpoints)│       │   └── AuthForm.tsx

- [MongoDB Compass Guide](#-mongodb-compass-guide)│       └── hooks          # Custom hooks

- [Usage Examples](#-usage-examples)│           └── useAuth.ts

- [Security Features](#-security-features)├── server                # Server-side application

- [Testing](#-testing)│   ├── package.json      # Server package configuration

- [Troubleshooting](#-troubleshooting)│   ├── tsconfig.json     # TypeScript configuration for the server

- [Deployment](#-deployment)│   ├── .env.example       # Example environment variables

- [Contributing](#-contributing)│   └── src               # Source files for the server

- [License](#-license)│       ├── index.ts      # Entry point for the server application

│       ├── routes        # Authentication routes

---│       │   └── auth.ts

│       ├── controllers   # Controllers for handling requests

## ✨ Features│       │   └── authController.ts

│       ├── services      # Business logic related to authentication

### Frontend (Client)│       │   └── authService.ts

- ✅ **React 18** with TypeScript│       ├── middleware     # Middleware functions

- ✅ **Vite** for lightning-fast development│       │   └── authMiddleware.ts

- ✅ **React Router** for navigation│       ├── models        # User model

- ✅ **Context API** for global auth state│       │   └── user.ts

- ✅ Custom **useAuth** hook│       └── utils         # Utility functions

- ✅ Protected routes with automatic redirects│           └── jwt.ts

- ✅ Login & Register pages├── package.json          # Overall project configuration

- ✅ Dashboard with user profile├── .gitignore            # Files to ignore in version control

- ✅ Responsive UI└── README.md             # Project documentation

```

### Backend (Server)

- ✅ **Express.js** REST API## Getting Started

- ✅ **TypeScript** for type safety

- ✅ **JWT** authentication (7-day expiration)### Prerequisites

- ✅ **bcrypt** password hashing (10 salt rounds)

- ✅ **Zod** schema validation- Node.js (version 14 or higher)

- ✅ HTTP-only cookies for XSS protection- npm or yarn

- ✅ CORS enabled

- ✅ Clean MVC architecture### Installation



### Database1. Clone the repository:

- ✅ **MongoDB Atlas** cloud database

- ✅ **Mongoose** ODM   ```

- ✅ User model with validation   git clone <repository-url>

- ✅ Unique email & username constraints   cd vite-express-auth

- ✅ Auto-generated timestamps   ```

- ✅ Indexed fields for performance

2. Install dependencies for the client:

---

   ```

## 🛠️ Tech Stack   cd client

   npm install

| Category | Technology |   ```

|----------|-----------|

| **Frontend** | React 18, TypeScript, Vite, React Router |3. Install dependencies for the server:

| **Backend** | Node.js, Express, TypeScript |

| **Database** | MongoDB Atlas, Mongoose |   ```

| **Authentication** | JWT, bcrypt |   cd ../server

| **Validation** | Zod |   npm install

| **Dev Tools** | tsx, concurrently |   ```



---### Configuration



## 📁 Project Structure1. Create a `.env` file in the `server` directory based on the `.env.example` file and set your environment variables.



```### Running the Application

vite-express-auth/

│1. Start the server:

├── client/                      # Frontend (Vite + React)

│   ├── public/   ```

│   ├── src/   cd server

│   │   ├── components/   npm run start

│   │   │   └── AuthForm.tsx     # Reusable auth form   ```

│   │   ├── hooks/

│   │   │   └── useAuth.tsx      # Custom auth hook2. Start the client:

│   │   ├── pages/

│   │   │   ├── Login.tsx        # Login page   ```

│   │   │   ├── Register.tsx     # Register page   cd ../client

│   │   │   └── Dashboard.tsx    # Protected dashboard   npm run dev

│   │   ├── App.tsx              # Main app component   ```

│   │   └── main.tsx             # Entry point

│   ├── index.html### Usage

│   ├── package.json

│   ├── tsconfig.json- Navigate to `http://localhost:3000` to access the client application.

│   └── vite.config.ts- Use the provided forms to register and log in.

│

├── server/                      # Backend (Express + Node.js)## Contributing

│   ├── src/

│   │   ├── config/Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

│   │   │   └── database.ts      # MongoDB connection

│   │   ├── controllers/## License

│   │   │   └── authController.ts # Auth logic

│   │   ├── middleware/This project is licensed under the MIT License.
│   │   │   └── authMiddleware.ts # JWT verification
│   │   ├── models/
│   │   │   └── user.ts          # User schema
│   │   ├── routes/
│   │   │   └── auth.ts          # Auth routes
│   │   ├── services/
│   │   │   └── authService.ts   # Business logic
│   │   ├── utils/
│   │   │   └── jwt.ts           # JWT helpers
│   │   └── index.ts             # Server entry point
│   ├── .env                     # Environment variables
│   ├── .env.example             # Env template
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                 # Root package (scripts)
├── README.md                    # This file
├── MONGODB-INTEGRATION.md       # MongoDB setup guide
├── TEST-RESULTS.md              # Test documentation
└── SETUP-COMPLETE.md            # Setup checklist
```

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas/register))
- **MongoDB Compass** (optional, for GUI) ([Download](https://www.mongodb.com/try/download/compass))
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd vite-express-auth
```

### Step 2: Install Dependencies

Install all dependencies (root, client, and server):

```bash
npm run install:all
```

Or install individually:

```bash
# Root
npm install

# Client
cd client
npm install

# Server
cd ../server
npm install
```

---

## ⚙️ Configuration

### Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create a Cluster** (free tier available)
3. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
4. **Whitelist IP Address**: Add `0.0.0.0/0` for development (or your specific IP)

### Step 2: Environment Variables

Create `.env` file in `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/auth_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-random-string-min-32-chars
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**⚠️ Security Notes:**
- Replace `MONGODB_URI` with your actual connection string
- Generate a strong random string for `JWT_SECRET` (min 32 characters)
- Never commit `.env` to version control
- Use different secrets for production

### Step 3: Generate JWT Secret (Optional)

Generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## 🏃 Running the Application

### Development Mode (Recommended)

Run both client and server concurrently:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Run Individually

**Server only:**
```bash
cd server
npm run dev
```

**Client only:**
```bash
cd client
npm run dev
```

### Production Build

**Build client:**
```bash
cd client
npm run build
```

**Build server:**
```bash
cd server
npm run build
npm start
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "68fb6d2479f25a72cd251db0",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "68fb6d2479f25a72cd251db0",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Logout User
```http
POST /api/auth/logout
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

#### 4. Get User Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>
Cookie: token=<token>
```

**Response (200 OK):**
```json
{
  "user": {
    "userId": "68fb6d2479f25a72cd251db0",
    "email": "user@example.com"
  }
}
```

#### 5. Health Check
```http
GET /api/health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "MongoDB connected"
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "User already exists"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid credentials"
}
```

**Validation Error:**
```json
{
  "error": [
    {
      "code": "too_small",
      "minimum": 6,
      "path": ["password"],
      "message": "String must contain at least 6 character(s)"
    }
  ]
}
```

---

## 🧭 MongoDB Compass Guide

### Connect to Your Database

1. **Open MongoDB Compass**
2. **New Connection**
3. **Paste Connection String:**
   ```
   mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/
   ```
4. **Click Connect**

### View Your Data

Navigate to:
```
📁 Cluster0
  └── 📂 auth_db
       └── 📄 users
```

### What You'll See

```json
{
  "_id": ObjectId("68fb6d2479f25a72cd251db0"),
  "email": "user@example.com",
  "username": "johndoe",
  "password": "$2a$10$hashed_password_here",
  "createdAt": ISODate("2025-10-24T12:00:00.000Z"),
  "__v": 0
}
```

### Useful Queries in Compass

**Find user by email:**
```json
{ "email": "user@example.com" }
```

**Find users registered today:**
```json
{ "createdAt": { "$gte": new Date("2025-10-24") } }
```

**Count all users (Aggregations tab):**
```json
[
  { "$count": "totalUsers" }
]
```

---

## 💡 Usage Examples

### Frontend Usage

#### Login Example

```typescript
import { useAuth } from './hooks/useAuth';

function LoginPage() {
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login('user@example.com', 'password123');
    // Automatically redirects to dashboard
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### Protected Route Example

```typescript
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Backend Usage

#### Create Protected Route

```typescript
import { authenticate } from './middleware/authMiddleware';

router.get('/protected', authenticate, (req: AuthRequest, res) => {
  res.json({ message: 'Access granted', user: req.user });
});
```

### Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

**Get Profile (with cookie):**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -b cookies.txt
```

---

## 🔒 Security Features

### Authentication
- ✅ **JWT Tokens** with 7-day expiration
- ✅ **HTTP-only cookies** prevent XSS attacks
- ✅ **bcrypt hashing** with 10 salt rounds
- ✅ **Secure cookie flags** in production

### Validation
- ✅ **Zod schemas** for input validation
- ✅ Email format validation
- ✅ Minimum password length (6 characters)
- ✅ Username length constraints (3-20 chars)

### Database
- ✅ **Unique indexes** on email & username
- ✅ **Mongoose validation**
- ✅ Password never returned in responses
- ✅ Auto-lowercase emails

### Best Practices
- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ TypeScript for type safety

### Production Checklist

Before deploying:
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Restrict CORS to specific origins
- [ ] Set secure cookie flags
- [ ] Add rate limiting (e.g., express-rate-limit)
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Regular security audits: `npm audit`

---

## 🧪 Testing

### Manual Testing Flow

1. **Start servers**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Register**: Create a new account
4. **Check MongoDB Compass**: Verify user was created
5. **Logout**: Clear session
6. **Login**: Use registered credentials
7. **View Dashboard**: Access protected route
8. **Test Duplicate**: Try registering with same email (should fail)

### Test Accounts

For development, you can create test accounts:

```json
{
  "email": "admin@example.com",
  "username": "admin",
  "password": "admin123"
}
```

### API Testing with Postman

Import this collection:

```json
{
  "info": { "name": "Vite Express Auth" },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"password123\"}"
        }
      }
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

#### 2. MongoDB Connection Failed

**Error:** `MongoServerError: bad auth`

**Solutions:**
- Verify username/password in connection string
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity
- Try connection string from Atlas dashboard

#### 3. CORS Errors

**Error:** `Access-Control-Allow-Origin header`

**Solution:** Check `CLIENT_URL` in `.env` matches your frontend URL

#### 4. JWT Token Invalid

**Error:** `Invalid or expired token`

**Solutions:**
- Check `JWT_SECRET` is set correctly
- Clear cookies and login again
- Verify token hasn't expired (default: 7 days)

#### 5. TypeScript Errors

**Error:** `Cannot find module...`

**Solution:**
```bash
cd client && npm install
cd ../server && npm install
```

### Debug Mode

Enable detailed logging:

```typescript
// server/src/index.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

---

## 🚢 Deployment

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy client:**
   ```bash
   cd client
   vercel --prod
   ```

3. **Update API URL** in client code to your backend URL

### Deploy to Railway (Backend)

1. **Create Railway account**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Add environment variables** from `.env`
4. **Deploy**

### Environment Variables for Production

```env
NODE_ENV=production
PORT=443
MONGODB_URI=mongodb+srv://prod_user:password@cluster0.xxxxx.mongodb.net/prod_db
JWT_SECRET=<strong-random-64-char-string>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com
```

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript
- Follow existing file structure
- Add comments for complex logic
- Run `npm run build` before committing

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 📞 Support

If you have questions or issues:

1. Check [Troubleshooting](#-troubleshooting) section
2. Search existing issues on GitHub
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version)

---

## 🙏 Acknowledgments

Built with:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📊 Project Stats

- **Lines of Code**: ~2,000+
- **Files**: 25+
- **Dependencies**: 20+
- **Build Time**: ~5 seconds
- **Dev Server Startup**: ~2 seconds

---

## 🗺️ Roadmap

### ✅ Implemented Features

All planned enhancements have been successfully implemented!

- [x] Email verification
- [x] Password reset functionality
- [x] Social login (Google, GitHub)
- [x] Two-factor authentication (2FA)
- [x] User roles & permissions
- [x] Profile picture uploads
- [x] Session management
- [x] Activity logs
- [x] Rate limiting
- [x] API documentation (Swagger)

**See [ENHANCEMENTS.md](./ENHANCEMENTS.md) for detailed documentation!**

### 🚀 Future Enhancements

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

## 📚 Additional Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [React Router Docs](https://reactrouter.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

<div align="center">

**Made with ❤️ using Vite, Express, and MongoDB**

⭐ Star this repo if you find it helpful!

</div>
