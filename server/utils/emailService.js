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

    // Try multiple SMTP configurations for better reliability
    const smtpConfigs = [
      {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000,
        pool: false,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        requireTLS: true,
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
      },
      {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000,
        pool: false,
        tls: {
          rejectUnauthorized: false
        },
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
      }
    ];

    // Use the first configuration by default
    return nodemailer.createTransport(smtpConfigs[0]);
  }

  async sendOtpEmail(email, otp, userName = 'User', retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    try {
      // Check if transporter is available
      if (!this.transporter) {
        console.log('📧 Email service not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      // Test connection first (with timeout)
      console.log(`📧 Testing email connection (attempt ${retryCount + 1}/${maxRetries + 1})...`);
      await Promise.race([
        this.transporter.verify(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection verification timeout')), 30000)
        )
      ]);
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
      console.error(`❌ Error sending OTP email (attempt ${retryCount + 1}):`, error);
      
      // Retry logic for connection timeouts and temporary failures
      if (retryCount < maxRetries && (
        error.code === 'ETIMEDOUT' || 
        error.code === 'ECONNECTION' || 
        error.code === 'ESOCKET' ||
        error.message.includes('timeout') ||
        error.message.includes('Connection verification timeout')
      )) {
        console.log(`🔄 Retrying email send in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`);
        
        // Try alternative SMTP configuration on retry
        if (retryCount === 1) {
          const altTransporter = this.createAlternativeTransporter(1);
          if (altTransporter) {
            this.transporter = altTransporter;
            console.log('📧 Switched to alternative SMTP configuration');
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.sendOtpEmail(email, otp, userName, retryCount + 1);
      }
      
      // Provide more specific error messages
      if (error.code === 'EAUTH') {
        return { success: false, error: 'Authentication failed. Check Gmail credentials.' };
      } else if (error.code === 'ETIMEDOUT') {
        return { success: false, error: 'Connection timeout after multiple retries. Check network or try again.' };
      } else if (error.code === 'ECONNECTION') {
        return { success: false, error: 'Connection failed after multiple retries. Check internet connection.' };
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
      if (!this.transporter) {
        console.log('📧 Email service not configured');
        return false;
      }

      console.log('📧 Testing email service connection...');
      await Promise.race([
        this.transporter.verify(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection test timeout')), 30000)
        )
      ]);
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error.message);
      return false;
    }
  }

  // Method to get connection status
  getConnectionStatus() {
    return {
      configured: !!this.transporter,
      hasCredentials: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS)
    };
  }

  // Method to create alternative transporter configurations
  createAlternativeTransporter(configIndex = 1) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      return null;
    }

    const smtpConfigs = [
      {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000,
        pool: false,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        requireTLS: true,
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
      },
      {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000,
        pool: false,
        tls: {
          rejectUnauthorized: false
        },
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
      }
    ];

    if (configIndex < smtpConfigs.length) {
      console.log(`📧 Trying alternative SMTP configuration ${configIndex + 1}`);
      return nodemailer.createTransport(smtpConfigs[configIndex]);
    }
    return null;
  }
}

module.exports = new EmailService();
