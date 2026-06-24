import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { generateToken, requireAuth, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, displayName, password } = req.body;
    if (!username || !password || !displayName) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = getDb();
    
    // Check existing
    const existing = await db.get('SELECT id FROM users WHERE username = ?', [username.toLowerCase()]);
    if (existing) {
      res.status(400).json({ error: 'Username already taken' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (username, displayName, password) VALUES (?, ?, ?)',
      [username.toLowerCase(), displayName, hashedPassword]
    );

    const token = generateToken(result.lastID!);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ user: { id: result.lastID, username, displayName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    const db = getDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username.toLowerCase()]);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });

    const { password: _, ...userNoPassword } = user;
    res.json({ user: userNoPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ success: true });
});

router.post('/google', async (req, res) => {
  try {
    const { email, displayName, avatar } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const db = getDb();

    let user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const result = await db.run(
        'INSERT INTO users (username, displayName, password, avatar) VALUES (?, ?, ?, ?)',
        [username, displayName || username, hashedPassword, avatar || '']
      );
      user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    }

    const token = generateToken(user.id);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });

    const { password: _, ...userNoPassword } = user;
    res.json({ user: userNoPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const user = await db.get('SELECT id, username, displayName, bio, avatar, coverImage, createdAt FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // get follower and following counts
    const followers = await db.get('SELECT COUNT(*) as count FROM follows WHERE followingId = ?', [user.id]);
    const following = await db.get('SELECT COUNT(*) as count FROM follows WHERE followerId = ?', [user.id]);
    
    res.json({ user: { ...user, followersCount: followers.count, followingCount: following.count } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
