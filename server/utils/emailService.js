const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Check if email service is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.log('📧 Email service not configured, returning null transporter');
      return null;
    }

    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 30000,     // 30 seconds
      pool: false, // Disable pooling for better reliability
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendOtpEmail(email, otp, userName = 'User') {
    try {
      // Check if transporter is available
      if (!this.transporter) {
        console.log('📧 Email service not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      // Test connection first
      await this.transporter.verify();
      console.log('📧 Email service connection verified');

      const mailOptions = {
        from: {
          name: 'Vertex App',
          address: process.env.GMAIL_USER
        },
        to: email,
        subject: '🔐 Your OTP for Vertex App',
        html: this.getOtpEmailTemplate(otp, userName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      
      // Provide more specific error messages
      if (error.code === 'EAUTH') {
        return { success: false, error: 'Authentication failed. Check Gmail credentials.' };
      } else if (error.code === 'ETIMEDOUT') {
        return { success: false, error: 'Connection timeout. Check network or try again.' };
      } else if (error.code === 'ECONNECTION') {
        return { success: false, error: 'Connection failed. Check internet connection.' };
      }
      
      return { success: false, error: error.message };
    }
  }

  getOtpEmailTemplate(otp, userName) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .otp-code {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            padding: 20px;
            border-radius: 15px;
            margin: 30px 0;
            letter-spacing: 5px;
            font-family: 'Courier New', monospace;
          }
          .message {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Vertex App</h1>
            <p>Futuristic Multi-Service Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p class="message">
              Welcome to Vertex! Please use the following OTP to verify your email address and complete your registration.
            </p>
            <div class="otp-code">${otp}</div>
            <div class="warning">
              ⚠️ This OTP will expire in 10 minutes. Do not share this code with anyone.
            </div>
            <p class="message">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Vertex App. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
