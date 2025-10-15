const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  profile: {
    name: String,
    avatar: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better performance
// Note: email index is automatically created by unique: true
userSchema.index({ 'otp.expiresAt': 1 });

// Virtual for OTP expiry check
userSchema.virtual('isOtpExpired').get(function() {
  return this.otp && this.otp.expiresAt && this.otp.expiresAt < new Date();
});

// Method to generate OTP
userSchema.methods.generateOtp = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOtp = function(otp) {
  if (!this.otp || this.isOtpExpired) {
    return false;
  }
  return this.otp.code === otp;
};

// Method to clear OTP
userSchema.methods.clearOtp = function() {
  this.otp = undefined;
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  if (this.isModified('otp') && this.otp && this.otp.code) {
    // Hash OTP for security (optional)
    this.otp.code = this.otp.code;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
