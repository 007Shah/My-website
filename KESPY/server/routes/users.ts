import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get profile
router.get('/:username', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const user = await db.get('SELECT id, username, displayName, bio, avatar, coverImage, createdAt FROM users WHERE username = ?', [req.params.username.toLowerCase()]);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const followers = await db.get('SELECT COUNT(*) as count FROM follows WHERE followingId = ?', [user.id]);
    const following = await db.get('SELECT COUNT(*) as count FROM follows WHERE followerId = ?', [user.id]);
    
    let isFollowing = false;
    let hasPendingRequestFromMe = false;
    let hasPendingRequestToMe = false;
    let isFriend = false;

    if (req.userId) {
      const follow = await db.get('SELECT id FROM follows WHERE followerId = ? AND followingId = ?', [req.userId, user.id]);
      isFollowing = !!follow;

      // Check if mutual connection (friends)
      const mutual = await db.get(`
        SELECT id FROM follows 
        WHERE followerId = ? AND followingId = ?
        AND followingId IN (SELECT followerId FROM follows WHERE followingId = ?)
      `, [req.userId, user.id, req.userId]);
      isFriend = !!mutual;

      const reqFromMe = await db.get('SELECT id FROM friend_requests WHERE senderId = ? AND receiverId = ? AND status = ?', [req.userId, user.id, 'pending']);
      hasPendingRequestFromMe = !!reqFromMe;

      const reqToMe = await db.get('SELECT id FROM friend_requests WHERE senderId = ? AND receiverId = ? AND status = ?', [user.id, req.userId, 'pending']);
      hasPendingRequestToMe = !!reqToMe;
    }

    res.json({ 
      user: { 
        ...user, 
        followersCount: followers.count, 
        followingCount: following.count, 
        isFollowing,
        hasPendingRequestFromMe,
        hasPendingRequestToMe,
        isFriend
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { displayName, bio, avatar, coverImage } = req.body;
    const db = getDb();
    
    await db.run(
      'UPDATE users SET displayName = ?, bio = ?, avatar = ?, coverImage = ? WHERE id = ?',
      [displayName, bio, avatar, coverImage, req.userId]
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow/Unfollow
router.post('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  try {
    const followingId = parseInt(req.params.id);
    if (req.userId === followingId) {
      res.status(400).json({ error: 'Cannot follow yourself' });
      return;
    }

    const db = getDb();
    const existing = await db.get('SELECT id FROM follows WHERE followerId = ? AND followingId = ?', [req.userId, followingId]);

    if (existing) {
      await db.run('DELETE FROM follows WHERE id = ?', [existing.id]);
      res.json({ following: false });
    } else {
      await db.run('INSERT INTO follows (followerId, followingId) VALUES (?, ?)', [req.userId, followingId]);
      res.json({ following: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get followers list
router.get('/:username/followers', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const user = await db.get('SELECT id FROM users WHERE username = ?', [req.params.username.toLowerCase()]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const query = `
      SELECT u.id, u.username, u.displayName, u.avatar, u.bio
      FROM follows f
      JOIN users u ON f.followerId = u.id
      WHERE f.followingId = ?
    `;
    const followers = await db.all(query, [user.id]);
    res.json({ followers });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get following list
router.get('/:username/following', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const user = await db.get('SELECT id FROM users WHERE username = ?', [req.params.username.toLowerCase()]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const query = `
      SELECT u.id, u.username, u.displayName, u.avatar, u.bio
      FROM follows f
      JOIN users u ON f.followingId = u.id
      WHERE f.followerId = ?
    `;
    const following = await db.all(query, [user.id]);
    res.json({ following });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get self network feed showing friends, comments written by me, and mentions
router.get('/me/network', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    
    // Get current username
    const me = await db.get('SELECT username FROM users WHERE id = ?', [req.userId]);
    if (!me) return res.status(404).json({ error: 'User not found' });
    const myUsername = me.username;

    // Friends list (mutual followers)
    const friends = await db.all(`
      SELECT DISTINCT u.id, u.username, u.displayName, u.avatar, u.bio
      FROM follows f1
      JOIN follows f2 ON f1.followerId = f2.followingId AND f1.followingId = f2.followerId
      JOIN users u ON f1.followingId = u.id
      WHERE f1.followerId = ?
    `, [req.userId]);

    // Followers list
    const followers = await db.all(`
      SELECT u.id, u.username, u.displayName, u.avatar, u.bio
      FROM follows f
      JOIN users u ON f.followerId = u.id
      WHERE f.followingId = ?
    `, [req.userId]);

    // Following list
    const following = await db.all(`
      SELECT u.id, u.username, u.displayName, u.avatar, u.bio
      FROM follows f
      JOIN users u ON f.followingId = u.id
      WHERE f.followerId = ?
    `, [req.userId]);

    // Comments written by me, with comment likesCount, comment isLikedByMe, and the post commented on (plus post likes, post comments, and post author details)
    const commentsWritten = await db.all(`
      SELECT c.*, 
             u.username as commentAuthorUsername, u.displayName as commentAuthorDisplayName, u.avatar as commentAuthorAvatar,
             (SELECT COUNT(*) FROM comment_likes WHERE commentId = c.id) as likesCount,
             (SELECT COUNT(*) FROM comment_likes WHERE commentId = c.id AND userId = ?) as isLikedByMe,
             p.content as postContent, p.id as postId, p.image as postImage,
             pu.username as postAuthorUsername, pu.displayName as postAuthorDisplayName, pu.avatar as postAuthorAvatar,
             (SELECT COUNT(*) FROM likes WHERE postId = p.id) as postLikesCount,
             (SELECT COUNT(*) FROM comments WHERE postId = p.id) as postCommentsCount
      FROM comments c
      JOIN posts p ON c.postId = p.id
      JOIN users u ON c.userId = u.id
      JOIN users pu ON p.userId = pu.id
      WHERE c.userId = ?
      ORDER BY c.createdAt DESC
      LIMIT 100
    `, [req.userId, req.userId]);

    // Mentions received in posts
    const queryPattern = `%@${myUsername}%`;
    const checkAlt = `%@${myUsername.toLowerCase()}%`;
    const postMentions = await db.all(`
      SELECT p.*, u.username, u.displayName, u.avatar,
             (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
             (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount
      FROM posts p
      JOIN users u ON p.userId = u.id
      WHERE p.content LIKE ? OR p.content LIKE ?
      ORDER BY p.createdAt DESC
      LIMIT 20
    `, [queryPattern, checkAlt]);

    // Mentions received in comments
    const commentMentions = await db.all(`
      SELECT c.*, 
             u.username as commentAuthorUsername, u.displayName as commentAuthorDisplayName, u.avatar as commentAuthorAvatar,
             p.content as postContent, p.id as postId
      FROM comments c
      JOIN posts p ON c.postId = p.id
      JOIN users u ON c.userId = u.id
      WHERE c.content LIKE ? OR c.content LIKE ?
      ORDER BY c.createdAt DESC
      LIMIT 20
    `, [queryPattern, checkAlt]);

    res.json({
      friends,
      followers,
      following,
      comments: commentsWritten,
      mentions: {
        posts: postMentions,
        comments: commentMentions
      }
    });
  } catch (err) {
    console.error("Network endpoint error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending friend requests for me
router.get('/me/friend-requests', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const requests = await db.all(`
      SELECT fr.id, fr.senderId, fr.createdAt, u.username, u.displayName, u.avatar, u.bio
      FROM friend_requests fr
      JOIN users u ON fr.senderId = u.id
      WHERE fr.receiverId = ? AND fr.status = 'pending'
      ORDER BY fr.createdAt DESC
    `, [req.userId]);

    res.json({ requests });
  } catch (err) {
    console.error("Get friend requests error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send friend request
router.post('/friend-requests/send', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId || Number(receiverId) === Number(req.userId)) {
      return res.status(400).json({ error: 'Invalid receiver' });
    }

    const db = getDb();
    
    // Check if they are already friends or if a request already exists
    const existing = await db.get(`
      SELECT id, status FROM friend_requests 
      WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
    `, [req.userId, receiverId, receiverId, req.userId]);

    if (existing) {
      return res.status(400).json({ error: 'Friend request or relationship already exists' });
    }

    await db.run(
      'INSERT INTO friend_requests (senderId, receiverId, status) VALUES (?, ?, ?)',
      [req.userId, receiverId, 'pending']
    );

    // Insert Friend Request notification
    await db.run(
      'INSERT INTO notifications (receiverId, senderId, type) VALUES (?, ?, ?)',
      [receiverId, req.userId, 'friend_request']
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Send friend request error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept friend request
router.post('/friend-requests/:id/accept', requireAuth, async (req: AuthRequest, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const db = getDb();

    const request = await db.get('SELECT * FROM friend_requests WHERE id = ? AND receiverId = ?', [requestId, req.userId]);
    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Mark as accepted (or we can delete it)
    await db.run('DELETE FROM friend_requests WHERE id = ?', [requestId]);

    // Delete corresponding friend_request notification if exists so it doesn't clutter the panel
    await db.run('DELETE FROM notifications WHERE receiverId = ? AND senderId = ? AND type = ?', [req.userId, request.senderId, 'friend_request']);

    // Automatically follow each other to make them mutual friends (followers & followings!)
    await db.run('INSERT OR IGNORE INTO follows (followerId, followingId) VALUES (?, ?)', [request.senderId, request.receiverId]);
    await db.run('INSERT OR IGNORE INTO follows (followerId, followingId) VALUES (?, ?)', [request.receiverId, request.senderId]);

    res.json({ success: true });
  } catch (err) {
    console.error("Accept friend request error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Decline friend request
router.post('/friend-requests/:id/decline', requireAuth, async (req: AuthRequest, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const db = getDb();

    const request = await db.get('SELECT * FROM friend_requests WHERE id = ? AND receiverId = ?', [requestId, req.userId]);
    if (request) {
      // Clean up notification
      await db.run('DELETE FROM notifications WHERE receiverId = ? AND senderId = ? AND type = ?', [req.userId, request.senderId, 'friend_request']);
    }

    await db.run('DELETE FROM friend_requests WHERE id = ? AND receiverId = ?', [requestId, req.userId]);

    res.json({ success: true });
  } catch (err) {
    console.error("Decline friend request error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user notifications (likes, comments, friend requests, mentions)
router.get('/me/counts', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    
    const me = await db.get('SELECT username FROM users WHERE id = ?', [req.userId]);
    if (!me) return res.status(404).json({ error: 'User not found' });
    const myUsername = me.username;

    // Comments received on user's own posts
    const commentsReceivedResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM comments c
      JOIN posts p ON c.postId = p.id
      WHERE p.userId = ?
    `, [req.userId]);
    const commentsCount = commentsReceivedResult ? commentsReceivedResult.count : 0;

    // Mentions of user in posts/comments
    const queryPattern = `%@${myUsername}%`;
    const checkAlt = `%@${myUsername.toLowerCase()}%`;
    
    const postMentionsResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM posts 
      WHERE content LIKE ? OR content LIKE ?
    `, [queryPattern, checkAlt]);
    const postMentionsCount = postMentionsResult ? postMentionsResult.count : 0;

    const commentMentionsResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM comments 
      WHERE content LIKE ? OR content LIKE ?
    `, [queryPattern, checkAlt]);
    const commentMentionsCount = commentMentionsResult ? commentMentionsResult.count : 0;

    const mentionsCount = postMentionsCount + commentMentionsCount;

    res.json({ commentsCount, mentionsCount });
  } catch (err) {
    console.error("Get counts error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user notifications (likes, comments, friend requests, mentions)
router.get('/me/notifications', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const notifications = await db.all(`
      SELECT n.*, 
             u.username as senderUsername, u.displayName as senderDisplayName, u.avatar as senderAvatar,
             p.content as postContent
      FROM notifications n
      JOIN users u ON n.senderId = u.id
      LEFT JOIN posts p ON n.postId = p.id
      WHERE n.receiverId = ?
      ORDER BY n.createdAt DESC
      LIMIT 100
    `, [req.userId]);

    res.json({ notifications });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unified search across users, pages, and posts
router.get('/search/all', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.json({ users: [], pages: [], posts: [] });
    }

    const db = getDb();
    const likeQuery = `%${query}%`;

    // 1. Search Users
    const users = await db.all(`
      SELECT id, username, displayName, avatar, bio 
      FROM users 
      WHERE username LIKE ? OR displayName LIKE ? OR bio LIKE ?
      LIMIT 15
    `, [likeQuery, likeQuery, likeQuery]);

    // 2. Search Pages
    const pages = await db.all(`
      SELECT id, name, handle, category, description, avatar, followersCount
      FROM pages 
      WHERE name LIKE ? OR handle LIKE ? OR description LIKE ? OR category LIKE ?
      LIMIT 15
    `, [likeQuery, likeQuery, likeQuery, likeQuery]);

    // 3. Search Posts (including user info)
    const posts = await db.all(`
      SELECT p.*, 
             u.username, u.displayName, u.avatar as authorAvatar,
             pg.name as pageName, pg.handle as pageHandle, pg.avatar as pageAvatar
      FROM posts p
      JOIN users u ON p.userId = u.id
      LEFT JOIN pages pg ON p.pageId = pg.id
      WHERE p.content LIKE ?
      ORDER BY p.createdAt DESC
      LIMIT 15
    `, [likeQuery]);

    res.json({ users, pages, posts });
  } catch (err) {
    console.error("Unified search error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all notifications as read
router.post('/me/notifications/read', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    await db.run('UPDATE notifications SET read = 1 WHERE receiverId = ?', [req.userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Mark notifications read error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update username
router.put('/me/settings/username', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { username } = req.body;
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      return res.status(400).json({ error: 'Username must be alphanumeric or underscore' });
    }

    const db = getDb();
    const existing = await db.get('SELECT id FROM users WHERE username = ? AND id != ?', [cleanUsername, req.userId]);
    if (existing) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    await db.run('UPDATE users SET username = ? WHERE id = ?', [cleanUsername, req.userId]);
    res.json({ success: true, message: 'Username successfully updated' });
  } catch (err) {
    console.error("Update username error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update password
router.put('/me/settings/password', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const db = getDb();
    const user = await db.get('SELECT password FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId]);
    res.json({ success: true, message: 'Password successfully updated' });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get privacy settings
router.get('/me/settings/privacy', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const user = await db.get('SELECT privacy FROM users WHERE id = ?', [req.userId]);
    res.json({ privacy: user?.privacy ? JSON.parse(user.privacy) : {} });
  } catch (err) {
    console.error("Get privacy setting error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update privacy settings
router.put('/me/settings/privacy', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { privacy } = req.body;
    const db = getDb();
    await db.run('UPDATE users SET privacy = ? WHERE id = ?', [JSON.stringify(privacy || {}), req.userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Update privacy error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get blocked users list
router.get('/me/settings/blocks', requireAuth, async (req: AuthRequest, res) => {
  try {
    const db = getDb();
    const blocks = await db.all(`
      SELECT b.blockedId as id, u.username, u.displayName, u.avatar 
      FROM blocked_users b
      JOIN users u ON b.blockedId = u.id
      WHERE b.userId = ?
    `, [req.userId]);
    res.json({ blocks });
  } catch (err) {
    console.error("Get blocked list error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Block user
router.post('/me/settings/blocks/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const blockedId = parseInt(req.params.id);
    if (req.userId === blockedId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    const db = getDb();
    await db.run('INSERT OR IGNORE INTO blocked_users (userId, blockedId) VALUES (?, ?)', [req.userId, blockedId]);
    res.json({ success: true, message: 'User blocked successfully' });
  } catch (err) {
    console.error("Block user error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unblock user
router.delete('/me/settings/blocks/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const blockedId = parseInt(req.params.id);
    const db = getDb();
    await db.run('DELETE FROM blocked_users WHERE userId = ? AND blockedId = ?', [req.userId, blockedId]);
    res.json({ success: true, message: 'User unblocked successfully' });
  } catch (err) {
    console.error("Unblock user error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
