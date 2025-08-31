import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import { scrapeWebsite } from './services/scraper';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) { throw new Error('Supabase URL/Key missing'); }
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
const port = process.env.PORT || 3001;

// CHAT ENDPOINT (no changes needed)
app.post('/api/chat', async (req, res) => {
  const { botId, query } = req.body;
  if (!botId || !query) { return res.status(400).json({ error: 'botId and query are required' }); }
  try {
    const { data: embedData, error: embedError } = await supabase.functions.invoke('get-embedding', { body: { query } });
    if (embedError) { throw new Error(`Embedding failed: ${embedError.message}`); }
    const { data: matchData, error: matchError } = await supabase.rpc('match_documents', { query_embedding: embedData.embedding, match_count: 5, filter: { bot_id: botId } });
    if (matchError) { throw new Error(`Match failed: ${matchError.message}`); }
    const contexts = matchData.map((doc: any) => doc.content);
    res.status(200).json({ contexts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// SCRAPE ENDPOINT - Simplified to just create a job
app.post('/api/scrape', async (req, res) => {
  const { botId } = req.body;
  if (!botId) { return res.status(400).json({ error: 'botId is required' }); }

  try {
    // Insert a job into the jobs table
    const { error: jobError } = await supabase
      .from('jobs')
      .insert({ 
        bot_id: botId, 
        status: 'pending' 
      });

    if (jobError) {
      console.error('Error creating job:', jobError);
      return res.status(500).json({ error: 'Could not start training job.' });
    }

    res.status(202).json({ message: 'Training job successfully queued.' });
  } catch (error: any) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: `Training failed: ${error.message}` });
  }
});

// DELETE ENDPOINT (no changes needed)
app.delete('/api/bot/:botId', async (req, res) => {
  const { botId } = req.params;
  if (!botId) { return res.status(400).json({ error: 'botId is required' }); }
  const { error } = await supabase.from('chatbots').delete().eq('id', botId);
  if (error) { return res.status(500).json({ error: 'Failed to delete chatbot.' }); }
  res.status(200).json({ message: 'Bot deleted successfully' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});