import express from 'express';
import { getDb } from '../db.js';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get feed
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    let posts;
    const limit = parseInt(req.query.limit as string) || 20;

    // A simple query to get recent posts with user data and like count
    const query = `
      SELECT p.*, 
             u.username, u.displayName, u.avatar,
             pg.name as pageName, pg.handle as pageHandle, pg.avatar as pageAvatar, pg.ownerId as pageOwnerId,
             (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
             (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount
             ${req.userId ? `, (SELECT COUNT(*) FROM likes WHERE postId = p.id AND userId = ${req.userId}) as isLikedByMe` : ''}
      FROM posts p
      LEFT JOIN users u ON p.userId = u.id
      LEFT JOIN pages pg ON p.pageId = pg.id
      ORDER BY p.createdAt DESC
      LIMIT ?
    `;
    
    posts = await db.all(query, [limit]);

    res.json({ posts: posts.map(p => ({
      ...p,
      isLikedByMe: !!p.isLikedByMe
    })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts by user
router.get('/user/:username', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const user = await db.get('SELECT id FROM users WHERE username = ?', [req.params.username.toLowerCase()]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const query = `
      SELECT p.*, 
             u.username, u.displayName, u.avatar,
             pg.name as pageName, pg.handle as pageHandle, pg.avatar as pageAvatar, pg.ownerId as pageOwnerId,
             (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
             (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount
             ${req.userId ? `, (SELECT COUNT(*) FROM likes WHERE postId = p.id AND userId = ${req.userId}) as isLikedByMe` : ''}
      FROM posts p
      LEFT JOIN users u ON p.userId = u.id
      LEFT JOIN pages pg ON p.pageId = pg.id
      WHERE p.userId = ? AND p.pageId IS NULL
      ORDER BY p.createdAt DESC
    `;
    
    const posts = await db.all(query, [user.id]);
    res.json({ posts: posts.map(p => ({
      ...p,
      isLikedByMe: !!p.isLikedByMe
    })) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper to handle parsing mentions and creating notifications
async function handleMentions(content: string, senderId: number, postId: number) {
  try {
    const matches = content.match(/@([a-zA-Z0-9_]+)/g);
    if (!matches) return;
    const db = getDb();
    for (const item of matches) {
      const rawUsername = item.replace('@', '').toLowerCase();
      const user = await db.get('SELECT id FROM users WHERE LOWER(username) = ?', [rawUsername]);
      if (user && user.id !== senderId) {
        // Create mention notification!
        const existing = await db.get(
          'SELECT id FROM notifications WHERE receiverId = ? AND senderId = ? AND type = ? AND postId = ?',
          [user.id, senderId, 'mention', postId]
        );
        if (!existing) {
          await db.run(
            'INSERT INTO notifications (receiverId, senderId, type, postId) VALUES (?, ?, ?, ?)',
            [user.id, senderId, 'mention', postId]
          );
        }
      }
    }
  } catch (err) {
    console.error("Mention parsing error:", err);
  }
}

// Create post
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { content, image } = req.body;
    if (!content && !image) {
      res.status(400).json({ error: 'Post must have content or image' });
      return;
    }

    const db = getDb();
    const result = await db.run(
      'INSERT INTO posts (userId, content, image) VALUES (?, ?, ?)',
      [req.userId, content, image || null]
    );

    const post = await db.get(`
      SELECT p.*, 
             u.username, u.displayName, u.avatar,
             pg.name as pageName, pg.handle as pageHandle, pg.avatar as pageAvatar, pg.ownerId as pageOwnerId
      FROM posts p 
      LEFT JOIN users u ON p.userId = u.id
      LEFT JOIN pages pg ON p.pageId = pg.id
      WHERE p.id = ?
    `, [result.lastID]);

    // Handle mentions in post
    if (content) {
      await handleMentions(content, req.userId, result.lastID);
    }

    res.json({ post: { ...post, likesCount: 0, commentsCount: 0, isLikedByMe: false } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', requireAuth, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(req.params.id);
    const db = getDb();
    
    // check if post exists
    const post = await db.get('SELECT id, userId FROM posts WHERE id = ?', [postId]);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const existing = await db.get('SELECT id FROM likes WHERE userId = ? AND postId = ?', [req.userId, postId]);

    if (existing) {
      await db.run('DELETE FROM likes WHERE id = ?', [existing.id]);
      // Remove corresponding like notification
      await db.run(
        'DELETE FROM notifications WHERE receiverId = ? AND senderId = ? AND type = ? AND postId = ?',
        [post.userId, req.userId, 'like', postId]
      );
      res.json({ liked: false });
    } else {
      await db.run('INSERT INTO likes (userId, postId) VALUES (?, ?)', [req.userId, postId]);
      
      // Dispatch like notification if liked by someone else
      if (post.userId !== req.userId) {
        await db.run(
          'INSERT INTO notifications (receiverId, senderId, type, postId) VALUES (?, ?, ?, ?)',
          [post.userId, req.userId, 'like', postId]
        );
      }
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments
router.get('/:id/comments', async (req, res) => {
  try {
    const db = getDb();
    const comments = await db.all(`
      SELECT c.*, u.username, u.displayName, u.avatar
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.postId = ?
      ORDER BY c.createdAt ASC
    `, [req.params.id]);

    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment
router.post('/:id/comments', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });
    
    const postId = parseInt(req.params.id);
    const db = getDb();

    const postInfo = await db.get('SELECT userId FROM posts WHERE id = ?', [postId]);
    if (!postInfo) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const result = await db.run(
      'INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)',
      [postId, req.userId, content]
    );

    const comment = await db.get(`
      SELECT c.*, u.username, u.displayName, u.avatar
      FROM comments c JOIN users u ON c.userId = u.id
      WHERE c.id = ?
    `, [result.lastID]);

    // Dispatch comment notification (if comment is by someone else than post owner)
    if (postInfo.userId !== req.userId) {
      await db.run(
        'INSERT INTO notifications (receiverId, senderId, type, postId) VALUES (?, ?, ?, ?)',
        [postInfo.userId, req.userId, 'comment', postId]
      );
    }

    // Handle mentions in comment content
    await handleMentions(content, req.userId, postId);

    res.json({ comment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET active stories
router.get('/stories', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const query = `
      SELECT s.*, u.username, u.displayName, u.avatar
      FROM stories s
      JOIN users u ON s.userId = u.id
      ORDER BY s.createdAt DESC
      LIMIT 50
    `;
    const stories = await db.all(query);
    res.json({ stories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new story
router.post('/stories', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ error: 'Story image is required' });
      return;
    }
    const db = getDb();
    const result = await db.run(
      'INSERT INTO stories (userId, image) VALUES (?, ?)',
      [req.userId, image]
    );
    
    const story = await db.get(`
      SELECT s.*, u.username, u.displayName, u.avatar
      FROM stories s JOIN users u ON s.userId = u.id
      WHERE s.id = ?
    `, [result.lastID]);
    
    res.json({ story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete story
router.delete('/stories/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const storyId = parseInt(req.params.id);
    const db = getDb();

    const story = await db.get('SELECT * FROM stories WHERE id = ?', [storyId]);
    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    if (story.userId !== req.userId) {
      res.status(403).json({ error: 'You are not authorized to delete this story' });
      return;
    }

    await db.run('DELETE FROM stories WHERE id = ?', [storyId]);
    res.json({ success: true, message: 'Story successfully deleted' });
  } catch (err) {
    console.error("Delete story error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(req.params.id);
    const db = getDb();

    const post = await db.get(`
      SELECT p.*, pg.ownerId as pageOwnerId
      FROM posts p
      LEFT JOIN pages pg ON p.pageId = pg.id
      WHERE p.id = ?
    `, [postId]);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Auth check: post authors OR page owners
    const canDelete = Number(post.userId) === Number(req.userId) || (post.pageId && Number(post.pageOwnerId) === Number(req.userId));
    if (!canDelete) {
      res.status(403).json({ error: 'You are not authorized to delete this post' });
      return;
    }

    // 1. Delete comment_likes belonging to any comment on this post
    await db.run('DELETE FROM comment_likes WHERE commentId IN (SELECT id FROM comments WHERE postId = ?)', [postId]);
    // 2. Delete notifications associated with this post
    await db.run('DELETE FROM notifications WHERE postId = ?', [postId]);
    // 3. Delete comments first
    await db.run('DELETE FROM comments WHERE postId = ?', [postId]);
    // 4. Delete likes
    await db.run('DELETE FROM likes WHERE postId = ?', [postId]);
    // 5. Delete post itself
    await db.run('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({ success: true, message: 'Post successfully deleted' });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike comment
router.post('/comments/:id/like', requireAuth, async (req: AuthRequest, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const db = getDb();

    const existing = await db.get('SELECT id FROM comment_likes WHERE userId = ? AND commentId = ?', [req.userId, commentId]);

    if (existing) {
      await db.run('DELETE FROM comment_likes WHERE id = ?', [existing.id]);
      res.json({ liked: false });
    } else {
      await db.run('INSERT INTO comment_likes (userId, commentId) VALUES (?, ?)', [req.userId, commentId]);
      res.json({ liked: true });
    }
  } catch (err) {
    console.error("Like comment error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
