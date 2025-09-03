import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { scrapeWebsite } from './scraper';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

// Connection pool configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Function to get Supabase client with retry logic
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    logger.error('Supabase URL and Service Key must be provided');
    throw new Error('Supabase URL and Service Key must be provided');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    },
    db: {
      retry: {
        attempts: MAX_RETRIES,
        backoff: (attempt) => Math.pow(2, attempt) * RETRY_DELAY
      }
    }
  });
}

// Simple function to chunk text into smaller pieces
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  
  // Clean the text
  text = text.replace(/\s+/g, ' ').trim();
  
  // Create chunks with overlap
  for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
    const chunk = text.substring(i, i + chunkSize);
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

// Function to process jobs
async function processJobs() {
  logger.info('Checking for pending jobs...');
  
  try {
    const supabase = getSupabaseClient();
    
    // Get all pending jobs
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, bot_id')
      .eq('status', 'pending')
      .limit(5); // Process up to 5 jobs at a time

    if (error) {
      logger.error(`Error fetching jobs: ${error.message}`);
      return;
    }

    if (jobs.length === 0) {
      logger.info('No pending jobs found');
      return;
    }

    logger.info(`Found ${jobs.length} pending jobs`);

    // Process each job
    for (const job of jobs) {
      await processSingleJob(job);
    }
  } catch (error) {
    logger.error('Unexpected error in processJobs', { error });
  }
}

// Function to process a single job
async function processSingleJob(job: any) {
  logger.info(`Processing job ${job.id} for bot ${job.bot_id}`);
  
  try {
    const supabase = getSupabaseClient();
    
    // Update job status to processing
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    if (updateError) {
      logger.error(`Error updating job ${job.id} status: ${updateError.message}`);
      return;
    }

    // Get bot details
    const { data: bot, error: botError } = await supabase
      .from('chatbots')
      .select('id, name, website_url, configuration_details, user_id')
      .eq('id', job.bot_id)
      .single();

    if (botError || !bot) {
      logger.error(`Bot not found for job ${job.id}`);
      throw new Error(`Bot not found for job ${job.id}`);
    }

    if (!bot.website_url) {
      logger.error(`Bot ${bot.id} does not have a website URL configured`);
      throw new Error(`Bot ${bot.id} does not have a website URL configured`);
    }

    // Scrape the website with language detection
    logger.info(`Starting to scrape ${bot.website_url} for bot ${bot.name}`);
    const scrapedResult = await scrapeWebsite(bot.website_url);
    const scrapedContent = scrapedResult.content;
    const websiteLanguage = scrapedResult.language;
    
    // Update bot with website language
    const updatedConfigDetails = {
      ...(bot.configuration_details || {}),
      website_language: websiteLanguage
    };
    
    const { error: updateBotError } = await supabase
      .from('chatbots')
      .update({ 
        configuration_details: updatedConfigDetails,
        updated_at: new Date().toISOString()
      })
      .eq('id', bot.id);
    
    if (updateBotError) {
      logger.error(`Error updating bot language: ${updateBotError.message}`);
    } else {
      logger.info(`Successfully stored website language: ${websiteLanguage}`);
    }

    // Chunk the content
    logger.info(`Chunking content (${scrapedContent.length} characters)`);
    const chunks = chunkText(scrapedContent, 1000, 200);
    logger.info(`Created ${chunks.length} chunks`);
    
    // Process each chunk - create embeddings and store in database
    let successfulChunks = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        // Get embedding for the chunk
        logger.info(`Generating embedding for chunk ${i + 1}/${chunks.length}`);
        const { data: embedData, error: embedError } = await supabase.functions.invoke('get-embedding', { 
          body: { query: chunk } 
        });
        
        if (embedError) {
          logger.error(`Error generating embedding for chunk ${i + 1}: ${embedError.message}`);
          continue;
        }
        
        // Store the document with its embedding and language metadata
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            content: chunk,
            embedding: embedData.embedding,
            metadata: {
              bot_id: bot.id,
              source: bot.website_url,
              chunk_index: i,
              language: websiteLanguage, // Store the language of this content
              user_id: bot.user_id
            },
            bot_id: bot.id,
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          logger.error(`Error storing document for chunk ${i + 1}: ${insertError.message}`);
        } else {
          logger.info(`Successfully stored document for chunk ${i + 1}`);
          successfulChunks++;
        }
      } catch (chunkError) {
        logger.error(`Error processing chunk ${i + 1}`, { error: chunkError });
      }
    }
    
    logger.info(`Successfully processed job ${job.id}. Processed ${successfulChunks}/${chunks.length} chunks.`);
    
    // Update job status to completed
    const { error: completeError } = await supabase
      .from('jobs')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    if (completeError) {
      logger.error(`Error updating job ${job.id} to completed: ${completeError.message}`);
    } else {
      logger.info(`Job ${job.id} completed successfully`);
    }
  } catch (error: any) {
    logger.error(`Error processing job ${job.id}: ${error.message}`, { error });
    
    // Update job status to failed
    const supabase = getSupabaseClient();
    const { error: failError } = await supabase
      .from('jobs')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    if (failError) {
      logger.error(`Error updating job ${job.id} to failed: ${failError.message}`);
    }
  }
}

// Function to clear all jobs (useful for testing)
async function clearAllJobs() {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('jobs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all jobs
  
  if (error) {
    logger.error(`Error clearing jobs: ${error.message}`);
  } else {
    logger.info('All jobs cleared successfully');
  }
}

// Run the job processor periodically
async function startJobProcessor() {
  logger.info('Starting job processor...');
  
  // Run immediately
  await processJobs();
  
  // Then run every 30 seconds
  const intervalId = setInterval(async () => {
    try {
      await processJobs();
    } catch (error) {
      logger.error('Error in job processor interval', { error });
    }
  }, 30000);
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully');
    clearInterval(intervalId);
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully');
    clearInterval(intervalId);
    process.exit(0);
  });
}

// Start the job processor if this file is run directly
if (require.main === module) {
  // Check if we want to clear jobs
  if (process.argv.includes('--clear-jobs')) {
    clearAllJobs().then(() => process.exit(0));
  } else {
    startJobProcessor().catch(error => logger.error('Error starting job processor', { error }));
  }
}

export { processJobs, startJobProcessor, clearAllJobs };