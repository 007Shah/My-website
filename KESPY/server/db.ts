import { createClient, Client } from '@libsql/client';
import path from 'path';

let client: Client;

export const initDb = async () => {
  const dbPath = path.resolve(process.cwd(), 'database.sqlite');
  
  client = createClient({
    url: `file:${dbPath}`
  });

  const queries = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      displayName TEXT NOT NULL,
      bio TEXT,
      avatar TEXT,
      password TEXT NOT NULL,
      coverImage TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(postId) REFERENCES posts(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      commentId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, commentId),
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(commentId) REFERENCES comments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      postId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, postId),
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(postId) REFERENCES posts(id)
    );

    CREATE TABLE IF NOT EXISTS follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      followerId INTEGER NOT NULL,
      followingId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(followerId, followingId),
      FOREIGN KEY(followerId) REFERENCES users(id),
      FOREIGN KEY(followingId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      image TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId INTEGER NOT NULL,
      name TEXT NOT NULL,
      handle TEXT UNIQUE NOT NULL,
      category TEXT,
      description TEXT,
      avatar TEXT,
      coverImage TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ownerId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS page_follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      pageId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, pageId),
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(pageId) REFERENCES pages(id)
    );

    CREATE TABLE IF NOT EXISTS friend_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senderId INTEGER NOT NULL,
      receiverId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(senderId, receiverId),
      FOREIGN KEY(senderId) REFERENCES users(id),
      FOREIGN KEY(receiverId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receiverId INTEGER NOT NULL,
      senderId INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'like', 'comment', 'friend_request', 'mention'
      postId INTEGER DEFAULT NULL,
      read INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(receiverId) REFERENCES users(id),
      FOREIGN KEY(senderId) REFERENCES users(id),
      FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS blocked_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      blockedId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, blockedId),
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(blockedId) REFERENCES users(id)
    );
  `;

  // libsql requires multiple statements to be executed using batch or executeMultiple
  // Since we don't have PRAGMA inside, multiple execute statements are fine
  const statements = queries.split(';').filter(q => q.trim().length > 0);
  for (const s of statements) {
    await client.execute(s);
  }

  // Gracefully alter posts table to add optional pageId field if not present
  try {
    await client.execute("ALTER TABLE posts ADD COLUMN pageId INTEGER DEFAULT NULL");
  } catch (err: any) {
    // Ignore error if column already exists (sqlite error code for duplicate column)
    if (!err.message?.includes('duplicate column') && !err.message?.includes('already exists')) {
      console.warn("Alter table info:", err.message);
    }
  }

  // Gracefully alter users table to add privacy settings field
  try {
    await client.execute("ALTER TABLE users ADD COLUMN privacy TEXT DEFAULT '{}'");
  } catch (err: any) {
    if (!err.message?.includes('duplicate column') && !err.message?.includes('already exists')) {
      console.warn("Alter users table privacy info:", err.message);
    }
  }
};

class DbWrapper {
  async get(sql: string, args: any[] = []): Promise<any> {
    const res = await client.execute({ sql, args });
    return res.rows.length > 0 ? (res.rows[0] as any) : undefined;
  }
  
  async all(sql: string, args: any[] = []): Promise<any[]> {
    const res = await client.execute({ sql, args });
    return res.rows as any[];
  }
  
  async run(sql: string, args: any[] = []) {
    const res = await client.execute({ sql, args });
    return { lastID: res.lastInsertRowid ? Number(res.lastInsertRowid) : undefined, changes: res.rowsAffected };
  }
}

const dbWrapper = new DbWrapper();

export const getDb = () => {
  if (!client) throw new Error('Database not initialized');
  return dbWrapper;
};
