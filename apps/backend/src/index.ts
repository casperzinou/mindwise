import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import healthRouter from './routes/health';
import { authenticate, optionalAuthenticate } from './middleware/auth';
import { validate, validationSchemas } from './middleware/validation';
import logger from './utils/logger';
import { scrapeWebsite } from './services/scraper';
import { initializeRedis } from './services/cacheService';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Supabase URL and Service Key must be provided');
  throw new Error('Supabase URL and Service Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const port = process.env.PORT || 3001;

// Apply middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000' }));
app.use(limiter);
app.use('/api/', healthRouter);

// HEALTH CHECK ENDPOINTS
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Service is healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ping', (req, res) => {
  logger.info('Ping received');
  res.status(200).json({ 
    status: 'ok', 
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

// CHAT ENDPOINT
app.post('/api/chat', optionalAuthenticate, validate(validationSchemas.chat), async (req, res) => {
  const { botId, query } = req.body;
  
  try {
    // Get embedding from Supabase function
    const { data: embedData, error: embedError } = await supabase.functions.invoke('get-embedding', { body: { query } });
    if (embedError) { 
      logger.error('Embedding failed', { error: embedError });
      throw new Error(`Embedding failed: ${embedError.message}`); 
    }
    
    // Match documents using the embedding
    const { data: matchData, error: matchError } = await supabase.rpc('match_documents', { 
      query_embedding: embedData.embedding, 
      match_count: 5, 
      filter: { bot_id: botId } 
    });
    
    if (matchError) { 
      logger.error('Match failed', { error: matchError });
      throw new Error(`Match failed: ${matchError.message}`); 
    }
    
    const contexts = matchData.map((doc: any) => doc.content);
    res.status(200).json({ contexts });
  } catch (error: any) {
    logger.error('Chat error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// GET CHATBOT INFO
app.get('/api/chatbot/:botId', optionalAuthenticate, async (req, res) => {
  const { botId } = req.params;
  
  if (!botId) {
    return res.status(400).json({ error: 'botId is required' });
  }
  
  try {
    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', botId)
      .single();
      
    if (error) {
      logger.error('Failed to fetch chatbot', { error });
      return res.status(500).json({ error: 'Failed to fetch chatbot.' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Chatbot not found.' });
    }
    
    res.status(200).json(data);
  } catch (error: any) {
    logger.error('Get chatbot error', { error: error.message });
    res.status(500).json({ error: `Failed to fetch chatbot: ${error.message}` });
  }
});

// SCRAPE ENDPOINT - Simplified to just create a job
app.post('/api/scrape', authenticate, validate(validationSchemas.scrape), async (req, res) => {
  const { botId } = req.body;
  
  try {
    // Insert a job into the jobs table
    const { error: jobError } = await supabase
      .from('jobs')
      .insert({ 
        bot_id: botId, 
        status: 'pending' 
      });

    if (jobError) {
      logger.error('Error creating job', { error: jobError });
      return res.status(500).json({ error: 'Could not start training job.' });
    }

    res.status(202).json({ message: 'Training job successfully queued.' });
  } catch (error: any) {
    logger.error('Scraping error', { error: error.message });
    res.status(500).json({ error: `Training failed: ${error.message}` });
  }
});

// TRIGGER JOBS ENDPOINT
app.post('/api/trigger-jobs', authenticate, async (req, res) => {
  try {
    // This endpoint would trigger the job processor
    // In a production environment, this would be handled by a separate service
    res.status(200).json({ message: 'Job processing triggered.' });
  } catch (error: any) {
    logger.error('Trigger jobs error', { error: error.message });
    res.status(500).json({ error: `Failed to trigger jobs: ${error.message}` });
  }
});

// DELETE ENDPOINT
app.delete('/api/bot/:botId', authenticate, async (req, res) => {
  const { botId } = req.params;
  
  if (!botId) {
    return res.status(400).json({ error: 'botId is required' });
  }
  
  try {
    const { error } = await supabase.from('chatbots').delete().eq('id', botId);
    
    if (error) {
      logger.error('Failed to delete chatbot', { error });
      return res.status(500).json({ error: 'Failed to delete chatbot.' });
    }
    
    res.status(200).json({ message: 'Bot deleted successfully' });
  } catch (error: any) {
    logger.error('Delete bot error', { error: error.message });
    res.status(500).json({ error: `Failed to delete bot: ${error.message}` });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize Redis if configured
initializeRedis().catch(error => {
  logger.error('Failed to initialize Redis', { error });
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});