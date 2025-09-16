// ES Module 版本
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import db from '../db.mjs';
import { generateVerifyToken, sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.mjs';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || String(password).length < 8) {
    return res.status(400).json({ message: 'Invalid email or password too short' });
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = randomUUID();
    const verifyToken = generateVerifyToken();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时后过期
    
    const stmt = await db.prepare('INSERT INTO users (id, email, password_hash, email_verify_token, email_verify_expires) VALUES (?, ?, ?, ?, ?)');
    const result = await stmt.bind(userId, email, passwordHash, verifyToken, verifyExpires.toISOString()).run();
    
    // 发送验证邮件
    const emailResult = await sendVerificationEmail(email, verifyToken);
    
    return res.status(201).json({ 
      id: userId, 
      email,
      emailSent: emailResult.success,
      message: emailResult.success ? 'Registration successful! Please check your email for verification.' : 'Registration successful, but email sending failed. Please contact administrator.'
    });
  } catch (err) {
    if (String(err.message).includes('UNIQUE constraint')) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('Register error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    return res.status(500).json({ 
      message: 'Registration failed',
      error: err.message 
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const stmt = await db.prepare('SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1');
    const user = await stmt.bind(email).get();
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
    return res.json({ 
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// 获取用户资料
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    // 简单的 JWT 验证（生产环境建议使用专门的 JWT 库）
    let payload;
    try {
      payload = JSON.parse(atob(token));
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const stmt = await db.prepare('SELECT id, email, name, bio, avatar, created_at FROM users WHERE id = ? LIMIT 1');
    const user = await stmt.bind(payload.userId).get();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ message: 'Failed to get profile' });
  }
});

// 更新用户资料
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    // 简单的 JWT 验证
    let payload;
    try {
      payload = JSON.parse(atob(token));
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { name, bio } = req.body;
    
    const stmt = await db.prepare('UPDATE users SET name = ?, bio = ? WHERE id = ?');
    await stmt.bind(name || null, bio || null, payload.userId).run();
    
    // 获取更新后的用户信息
    const getUserStmt = await db.prepare('SELECT id, email, name, bio, avatar, created_at FROM users WHERE id = ? LIMIT 1');
    const user = await getUserStmt.bind(payload.userId).get();
    
    return res.json({ user });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// 验证邮箱
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Missing verification token' });
    }

    const stmt = await db.prepare('SELECT id, email, email_verify_expires FROM users WHERE email_verify_token = ? LIMIT 1');
    const user = await stmt.bind(token).get();
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    // 检查令牌是否过期
    const now = new Date();
    const expires = new Date(user.email_verify_expires);
    
    if (now > expires) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    // 更新用户验证状态
    const updateStmt = await db.prepare('UPDATE users SET email_verified = TRUE, email_verify_token = NULL, email_verify_expires = NULL WHERE id = ?');
    await updateStmt.bind(user.id).run();
    
    return res.json({ 
      message: 'Email verification successful!',
      email: user.email 
    });
  } catch (err) {
    console.error('Verify email error:', err);
    return res.status(500).json({ message: 'Verification failed' });
  }
});

// 重新发送验证邮件
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Missing email address' });
    }

    const stmt = await db.prepare('SELECT id, email, email_verified FROM users WHERE email = ? LIMIT 1');
    const user = await stmt.bind(email).get();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email_verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // 生成新的验证令牌
    const verifyToken = generateVerifyToken();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const updateStmt = await db.prepare('UPDATE users SET email_verify_token = ?, email_verify_expires = ? WHERE id = ?');
    await updateStmt.bind(verifyToken, verifyExpires.toISOString(), user.id).run();
    
    // 发送验证邮件
    const emailResult = await sendVerificationEmail(email, verifyToken);
    
    return res.json({ 
      message: emailResult.success ? 'Verification email has been resent!' : 'Email sending failed, please try again later.',
      success: emailResult.success
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    return res.status(500).json({ message: 'Failed to resend verification email' });
  }
});

// 忘记密码
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Missing email address' });
    }

    const stmt = await db.prepare('SELECT id, email, name FROM users WHERE email = ? LIMIT 1');
    const user = await stmt.bind(email).get();
    
    if (!user) {
      // 为了安全，即使用户不存在也返回成功
      return res.json({ message: 'If the email exists, a reset link has been sent to your email.' });
    }

    // 生成重置令牌
    const resetToken = generateVerifyToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1小时后过期
    
    const updateStmt = await db.prepare('UPDATE users SET email_verify_token = ?, email_verify_expires = ? WHERE id = ?');
    await updateStmt.bind(resetToken, resetExpires.toISOString(), user.id).run();
    
    // 发送重置邮件
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);
    
    return res.json({ 
      message: 'If the email exists, a reset link has been sent to your email.',
      success: emailResult.success
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// 重置密码
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ message: 'Invalid token or password too short' });
    }

    const stmt = await db.prepare('SELECT id, email, email_verify_expires FROM users WHERE email_verify_token = ? LIMIT 1');
    const user = await stmt.bind(token).get();
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    // 检查令牌是否过期
    const now = new Date();
    const expires = new Date(user.email_verify_expires);
    
    if (now > expires) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // 更新密码
    const passwordHash = bcrypt.hashSync(password, 10);
    const updateStmt = await db.prepare('UPDATE users SET password_hash = ?, email_verify_token = NULL, email_verify_expires = NULL WHERE id = ?');
    await updateStmt.bind(passwordHash, user.id).run();
    
    return res.json({ 
      message: 'Password reset successful!',
      email: user.email 
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Password reset failed' });
  }
});

export default router;