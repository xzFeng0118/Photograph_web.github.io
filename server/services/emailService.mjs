// 邮件服务 - 使用 Resend API
import { randomBytes } from 'crypto';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 'your-resend-api-key';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';

// 生成验证令牌
export function generateVerifyToken() {
  return randomBytes(32).toString('hex');
}

// 发送验证邮件
export async function sendVerificationEmail(email, token, name = null) {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const emailContent = {
    from: FROM_EMAIL,
    to: [email],
    subject: 'Verify Your Email Address - James\' Photography',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📸 James' Photography</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Welcome to join us!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            ${name ? `Dear ${name},` : 'Hello,'}<br><br>
            Thank you for registering with James' Photography! To ensure account security, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button cannot be clicked, please copy the following link to your browser:<br>
            <a href="${verifyUrl}" style="color: #667eea; word-break: break-all;">${verifyUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email is sent automatically by the system, please do not reply.<br>
            The verification link will expire in 24 hours.
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to James' Photography!
      
      ${name ? `Dear ${name},` : 'Hello,'}
      
      Thank you for registering! Please click the following link to verify your email address:
      
      ${verifyUrl}
      
      If you cannot click the link, please copy it to your browser.
      
      The verification link will expire in 24 hours.
      
      --
      James' Photography
    `
  };

  try {
    // If Resend API Key is not configured, simulate sending
    if (RESEND_API_KEY === 'your-resend-api-key') {
      console.log('📧 [Simulation] Sending verification email to:', email);
      console.log('📧 [Simulation] Verification link:', verifyUrl);
      return { success: true, message: 'Email sent successfully (simulation mode)' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('📧 Verification email sent successfully:', result.id);
      return { success: true, message: 'Email sent successfully' };
    } else {
      console.error('📧 Email sending failed:', result);
      return { success: false, message: result.message || 'Email sending failed' };
    }
  } catch (error) {
      console.error('📧 Email sending error:', error);
      return { success: false, message: 'Email service temporarily unavailable' };
  }
}

// 发送密码重置邮件
export async function sendPasswordResetEmail(email, token, name = null) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const emailContent = {
    from: FROM_EMAIL,
    to: [email],
    subject: 'Reset Your Password - James\' Photography',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 James' Photography</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6;">
            ${name ? `Dear ${name},` : 'Hello,'}<br><br>
            We received your password reset request. Click the button below to reset your password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button cannot be clicked, please copy the following link to your browser:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>⚠️ Security Reminder:</strong><br>
            • If you did not request a password reset, please ignore this email<br>
            • The reset link will expire in 1 hour<br>
            • Please do not share this link with others
          </div>
        </div>
      </div>
    `
  };

  try {
    if (RESEND_API_KEY === 'your-resend-api-key') {
      console.log('📧 [Simulation] Sending password reset email to:', email);
      console.log('📧 [Simulation] Reset link:', resetUrl);
      return { success: true, message: 'Email sent successfully (simulation mode)' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('📧 Password reset email sent successfully:', result.id);
      return { success: true, message: 'Email sent successfully' };
    } else {
      console.error('📧 Email sending failed:', result);
      return { success: false, message: result.message || 'Email sending failed' };
    }
  } catch (error) {
      console.error('📧 Email sending error:', error);
      return { success: false, message: 'Email service temporarily unavailable' };
  }
}