// ES Module 版本
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import db from '../db.mjs';

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
    const stmt = await db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)');
    const result = await stmt.bind(userId, email, passwordHash).run();
    
    return res.status(201).json({ 
      id: userId, 
      email 
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

export default router;