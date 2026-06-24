import express from 'express';
import { getDb } from '../db.js';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Create page
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, handle, category, description, avatar, coverImage } = req.body;
    if (!name || !handle) {
      res.status(400).json({ error: 'Name and unique handle are required' });
      return;
    }

    const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanHandle) {
      res.status(400).json({ error: 'Handle contains invalid characters' });
      return;
    }

    const db = getDb();
    
    // Check duplication
    const duplicate = await db.get('SELECT id FROM pages WHERE handle = ?', [cleanHandle]);
    if (duplicate) {
      res.status(400).json({ error: 'A page with this handle already exists' });
      return;
    }

    const result = await db.run(
      `INSERT INTO pages (ownerId, name, handle, category, description, avatar, coverImage)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, name, cleanHandle, category || 'Other', description || '', avatar || '', coverImage || '']
    );

    const page = await db.get('SELECT * FROM pages WHERE id = ?', [result.lastID]);
    res.json({ page });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List all pages
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { managed } = req.query;
    const db = getDb();
    let query = `
      SELECT pg.*, 
             (SELECT COUNT(*) FROM page_follows WHERE pageId = pg.id) as followersCount
             ${req.userId ? `, (SELECT COUNT(*) FROM page_follows WHERE pageId = pg.id AND userId = ${req.userId}) as isFollowing` : ''}
      FROM pages pg
    `;
    let args: any[] = [];

    if (managed === 'true' && req.userId) {
      query += ` WHERE pg.ownerId = ?`;
      args.push(req.userId);
    }

    query += ` ORDER BY pg.createdAt DESC`;
    const pages = await db.all(query, args);

    res.json({ 
      pages: pages.map(p => ({
        ...p,
        isFollowing: !!p.isFollowing
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single page details
router.get('/:handle', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const handle = req.params.handle.trim().toLowerCase();
    
    const query = `
      SELECT pg.*,
             u.username as ownerUsername, u.displayName as ownerDisplayName,
             (SELECT COUNT(*) FROM page_follows WHERE pageId = pg.id) as followersCount
             ${req.userId ? `, (SELECT COUNT(*) FROM page_follows WHERE pageId = pg.id AND userId = ${req.userId}) as isFollowingByMe` : ''}
      FROM pages pg
      JOIN users u ON pg.ownerId = u.id
      WHERE pg.handle = ?
    `;

    const page = await db.get(query, [handle]);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({
      page: {
        ...page,
        isFollowing: !!page.isFollowingByMe
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow/Unfollow page
router.post('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const db = getDb();

    // Verify page exists
    const page = await db.get('SELECT id, ownerId FROM pages WHERE id = ?', [pageId]);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const existing = await db.get('SELECT id FROM page_follows WHERE userId = ? AND pageId = ?', [req.userId, pageId]);

    if (existing) {
      await db.run('DELETE FROM page_follows WHERE id = ?', [existing.id]);
      res.json({ following: false });
    } else {
      await db.run('INSERT INTO page_follows (userId, pageId) VALUES (?, ?)', [req.userId, pageId]);
      res.json({ following: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create post under page (authenticated & must own page)
router.post('/:id/posts', requireAuth, async (req: AuthRequest, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const { content, image } = req.body;
    if (!content && !image) {
      res.status(400).json({ error: 'Post must have content or image' });
      return;
    }

    const db = getDb();

    // Verify page ownership
    const page = await db.get('SELECT id, ownerId FROM pages WHERE id = ?', [pageId]);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    if (Number(page.ownerId) !== Number(req.userId)) {
      res.status(403).json({ error: 'You are not authorized to publish as this Page' });
      return;
    }

    const result = await db.run(
      'INSERT INTO posts (userId, content, image, pageId) VALUES (?, ?, ?, ?)',
      [req.userId, content, image || null, pageId]
    );

    const post = await db.get(`
      SELECT p.*, pg.name as pageName, pg.handle as pageHandle, pg.avatar as pageAvatar
      FROM posts p 
      JOIN pages pg ON p.pageId = pg.id
      WHERE p.id = ?
    `, [result.lastID]);

    res.json({ 
      post: { 
        ...post, 
        likesCount: 0, 
        commentsCount: 0, 
        isLikedByMe: false 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
