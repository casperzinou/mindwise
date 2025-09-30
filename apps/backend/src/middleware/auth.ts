import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Supabase URL and Service Key must be provided');
  throw new Error('Supabase URL and Service Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.warn('Authorization header missing');
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    
    // Check if it's a Bearer token
    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      logger.warn('Invalid authorization header format');
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }
    
    const token = tokenParts[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      logger.warn('Invalid or expired token');
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Attach user to request
    (req as any).user = user;
    
    logger.debug('Authentication successful', { userId: user.id });
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Optional authentication middleware (for endpoints that can be accessed by both authenticated and unauthenticated users)
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // No auth header, continue without user
      next();
      return;
    }
    
    // Check if it's a Bearer token
    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      // Invalid format, continue without user
      next();
      return;
    }
    
    const token = tokenParts[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      // Invalid token, continue without user
      next();
      return;
    }
    
    // Attach user to request
    (req as any).user = user;
    
    logger.debug('Optional authentication successful', { userId: user.id });
    next();
  } catch (error) {
    logger.error('Optional authentication error', { error });
    // Continue without user on error
    next();
  }
};

export default { authenticate, optionalAuthenticate };