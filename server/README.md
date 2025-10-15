# 🚀 Vertex Server

Backend API server for the Vertex application built with Node.js, Express, and MongoDB.

## ✨ Features

- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with OTP verification
- **Email Service** with Gmail integration
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Input Validation** with express-validator
- **Error Handling** and logging

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account with App Password

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   
   Create a `.env` file:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/vertex-app
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Email Configuration
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-app-password-here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

4. **Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Bill Splitter
- `POST /api/bill-splitter/calculate` - Calculate bill split
- `GET /api/bill-splitter/history` - Get calculation history
- `POST /api/bill-splitter/save` - Save calculation

### Health
- `GET /api/health` - Health check endpoint

## 🏃‍♂️ Local Development

The server is configured for local development with automatic restarts using nodemon.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `GMAIL_USER` | Gmail address for OTP | Yes | - |
| `GMAIL_PASS` | Gmail app password | Yes | - |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `CLIENT_URL` | Frontend URL for CORS | No | http://localhost:5173 |
| `FRONTEND_URL` | Alternative frontend URL | No | http://localhost:3000 |

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `GMAIL_PASS`

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **JWT Tokens** - Secure authentication
- **Input Validation** - Prevent malicious input
- **OTP Expiration** - Time-limited codes

## 📊 Monitoring

The server includes health check endpoints and logging for monitoring:

- Health endpoint: `/api/health`
- Request logging
- Error tracking
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
