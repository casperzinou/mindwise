import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import { scrapeWebsite } from './services/scraper';
import { processJobs } from './services/jobProcessor';
import { detectLanguage, translateText, getWebsiteLanguage, getLocalizedGreeting } from './services/advancedTranslationService';
import path from 'path';
import logger from './utils/logger';
import healthRoutes from './routes/health';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) { 
  logger.error('Supabase URL/Key missing');
  throw new Error('Supabase URL/Key missing'); 
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = express();
app.use(express.json());
// Configure CORS origins from environment variable or use defaults
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'https://mindwise-demo.pages.dev'];

app.use(cors({ 
  origin: corsOrigins,
  credentials: true
}));

// Serve static files for chat widget
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check routes
app.use('/api', healthRoutes);

const port = process.env.PORT || 3001;

// CHAT ENDPOINT - Enhanced with multilingual support and caching
app.post('/api/chat', async (req, res) => {
  const { botId, query } = req.body;
  if (!botId || !query) { 
    logger.warn('Missing botId or query in chat request');
    return res.status(400).json({ error: 'botId and query are required' }); 
  }
  
  try {
    logger.info(`Processing chat request for bot ${botId}`);
    
    // 1. Detect the language of the user's query
    const userLanguage = await detectLanguage(query);
    logger.info(`Detected user language: ${userLanguage}`);
    
    // 2. Get the website's primary language
    const websiteLanguage = await getWebsiteLanguage(botId);
    logger.info(`Website language: ${websiteLanguage}`);
    
    // 3. If languages differ, translate query to website language for document retrieval
    let searchQuery = query;
    if (userLanguage !== websiteLanguage) {
      logger.info(`Translating query from ${userLanguage} to ${websiteLanguage}`);
      searchQuery = await translateText(query, userLanguage, websiteLanguage);
    }
    
    // 4. Get embedding for the (possibly translated) query
    const { data: embedData, error: embedError } = await supabase.functions.invoke('get-embedding', { body: { query: searchQuery } });
    if (embedError) { 
      logger.error(`Embedding failed: ${embedError.message}`);
      throw new Error(`Embedding failed: ${embedError.message}`); 
    }
    
    // 5. Find matching documents
    const { data: matchData, error: matchError } = await supabase.rpc('match_documents', { 
      query_embedding: embedData.embedding, 
      match_count: 5, 
      filter: { bot_id: botId } 
    });
    if (matchError) { 
      logger.error(`Match failed: ${matchError.message}`);
      throw new Error(`Match failed: ${matchError.message}`); 
    }
    
    // 6. Extract contexts from matched documents
    const contexts = matchData.map((doc: any) => doc.content);
    
    // 7. If languages differ, translate contexts back to user language
    let translatedContexts = contexts;
    if (userLanguage !== websiteLanguage && contexts.length > 0) {
      logger.info(`Translating ${contexts.length} contexts from ${websiteLanguage} to ${userLanguage}`);
      translatedContexts = await Promise.all(
        contexts.map((context: string) => translateText(context, websiteLanguage, userLanguage))
      );
    }
    
    logger.info(`Successfully processed chat request. Found ${translatedContexts.length} contexts.`);
    res.status(200).json({ contexts: translatedContexts, userLanguage, websiteLanguage });
    
  } catch (error: any) {
    logger.error(`Error processing chat request: ${error.message}`, { error });
    res.status(500).json({ error: error.message });
  }
});

// GET CHATBOT INFO - New endpoint to get chatbot language and greeting
app.get('/api/chatbot/:botId', async (req, res) => {
  const { botId } = req.params;
  if (!botId) { 
    logger.warn('Missing botId in chatbot info request');
    return res.status(400).json({ error: 'botId is required' }); 
  }
  
  try {
    // Get chatbot info including language
    const { data: bot, error } = await supabase
      .from('chatbots')
      .select('id, name, configuration_details')
      .eq('id', botId)
      .single();
    
    if (error || !bot) {
      logger.warn(`Chatbot not found: ${botId}`);
      return res.status(404).json({ error: 'Chatbot not found' });
    }
    
    // Get website language
    const websiteLanguage = bot.configuration_details?.website_language || 'en';
    
    // Get localized greeting
    const greeting = getLocalizedGreeting(websiteLanguage);
    
    logger.info(`Retrieved chatbot info for ${botId}`);
    res.status(200).json({ 
      id: bot.id,
      name: bot.name,
      websiteLanguage,
      greeting
    });
    
  } catch (error: any) {
    logger.error(`Error getting chatbot info: ${error.message}`, { error });
    res.status(500).json({ error: error.message });
  }
});

// SCRAPE ENDPOINT - Updated to just create a job
app.post('/api/scrape', async (req, res) => {
  const { botId } = req.body;
  if (!botId) { 
    logger.warn('Missing botId in scrape request');
    return res.status(400).json({ error: 'botId is required' }); 
  }

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

    logger.info(`Training job successfully queued for bot ${botId}`);
    res.status(202).json({ message: 'Training job successfully queued.' });
  } catch (error: any) {
    logger.error(`Scraping error: ${error.message}`, { error });
    res.status(500).json({ error: `Training failed: ${error.message}` });
  }
});

// NEW ENDPOINT: Trigger job processing
app.post('/api/trigger-jobs', async (req, res) => {
  try {
    logger.info('Manual trigger for job processing received');
    await processJobs(); // Process jobs once
    logger.info('Job processing completed');
    res.status(200).json({ message: 'Job processing completed.' });
  } catch (error: any) {
    logger.error(`Job processing error: ${error.message}`, { error });
    res.status(500).json({ error: `Job processing failed: ${error.message}` });
  }
});

// DELETE ENDPOINT (no changes needed)
app.delete('/api/bot/:botId', async (req, res) => {
  const { botId } = req.params;
  if (!botId) { 
    logger.warn('Missing botId in delete request');
    return res.status(400).json({ error: 'botId is required' }); 
  }
  const { error } = await supabase.from('chatbots').delete().eq('id', botId);
  if (error) { 
    logger.error(`Failed to delete chatbot ${botId}`, { error });
    return res.status(500).json({ error: 'Failed to delete chatbot.' }); 
  }
  logger.info(`Bot ${botId} deleted successfully`);
  res.status(200).json({ message: 'Bot deleted successfully' });
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

app.listen(port, () => {
  const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
  logger.info(`Server is running at ${serverUrl}`);
  logger.info(`Chat widget files available at ${serverUrl}/mindwise-chat.js`);
});