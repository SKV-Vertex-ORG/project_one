const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes are working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Send OTP
router.post('/send-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address')
], async (req, res) => {
  try {
    console.log('📧 Send OTP request received:', { email: req.body.email, timestamp: new Date() });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = new User({ email });
    }

    // Generate OTP
    const otp = user.generateOtp();
    await user.save();

    // Send OTP email (with fallback for development)
    let emailResult = { success: true };
    
    // Try to send email (will be skipped if not configured)
    emailResult = await emailService.sendOtpEmail(email, otp);
    
    if (!emailResult.success) {
      console.log('📧 Email service not configured, OTP generated but not sent');
      console.log('🔐 Generated OTP for', email, ':', otp);
    }

    res.json({
      message: 'OTP sent successfully',
      email: email,
      expiresIn: '10 minutes',
      // Include OTP in response for testing (since email is disabled)
      otp: otp
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Verify OTP
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found. Please request OTP first.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.verifyOtp(otp)) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
        code: 'INVALID_OTP'
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.lastLogin = new Date();
    user.clearOtp();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        profile: user.profile,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        isVerified: req.user.isVerified,
        profile: req.user.profile,
        preferences: req.user.preferences,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, [
  body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Theme must be light, dark, or auto'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, theme, currency } = req.body;
    
    if (name) {
      req.user.profile.name = name;
    }
    
    if (theme) {
      req.user.preferences.theme = theme;
    }
    
    if (currency) {
      req.user.preferences.currency = currency;
    }

    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        email: req.user.email,
        isVerified: req.user.isVerified,
        profile: req.user.profile,
        preferences: req.user.preferences
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
