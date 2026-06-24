import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export interface AuthRequest extends Request {
  userId?: number;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
  } catch (err) {}
  next();
};
