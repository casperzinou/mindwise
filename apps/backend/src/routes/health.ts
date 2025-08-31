import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      logger.error('Missing Supabase environment variables');
      return res.status(500).json({ 
        status: 'error', 
        message: 'Missing Supabase environment variables',
        timestamp: new Date().toISOString()
      });
    }

    // Try to connect to Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Perform a simple query to check database connectivity
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      logger.error('Database connectivity check failed', { error });
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connectivity check failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // If we get here, everything is working
    logger.info('Health check successful');
    res.status(200).json({ 
      status: 'ok', 
      message: 'Service is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Simple ping endpoint
router.get('/ping', (req, res) => {
  logger.info('Ping received');
  res.status(200).json({ 
    status: 'ok', 
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

export default router;