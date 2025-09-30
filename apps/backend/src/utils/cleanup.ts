import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupOrphanedRecords() {
  console.log('Starting cleanup of orphaned records...');
  
  try {
    // 1. Find chatbots with user_ids that don't exist in the users table
    const { data: chatbots, error: chatbotsError } = await supabase
      .from('chatbots')
      .select('id, user_id');
    
    if (chatbotsError) {
      throw new Error(`Error fetching chatbots: ${chatbotsError.message}`);
    }
    
    // 2. Get all valid user IDs
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');
    
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }
    
    const validUserIds = new Set(users.map(user => user.id));
    
    // 3. Find orphaned chatbots
    const orphanedChatbots = chatbots.filter(chatbot => !validUserIds.has(chatbot.user_id));
    
    if (orphanedChatbots.length > 0) {
      console.log(`Found ${orphanedChatbots.length} orphaned chatbots. Deleting...`);
      
      // 4. Delete orphaned chatbots
      for (const chatbot of orphanedChatbots) {
        const { error: deleteError } = await supabase
          .from('chatbots')
          .delete()
          .eq('id', chatbot.id);
        
        if (deleteError) {
          console.error(`Error deleting chatbot ${chatbot.id}: ${deleteError.message}`);
        } else {
          console.log(`Deleted orphaned chatbot ${chatbot.id}`);
        }
      }
    } else {
      console.log('No orphaned chatbots found.');
    }
    
    // 5. Find jobs with bot_ids that don't exist in the chatbots table
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, bot_id');
    
    if (jobsError) {
      throw new Error(`Error fetching jobs: ${jobsError.message}`);
    }
    
    // 6. Get all valid bot IDs
    const { data: bots, error: botsError } = await supabase
      .from('chatbots')
      .select('id');
    
    if (botsError) {
      throw new Error(`Error fetching bots: ${botsError.message}`);
    }
    
    const validBotIds = new Set(bots.map(bot => bot.id));
    
    // 7. Find orphaned jobs
    const orphanedJobs = jobs.filter(job => !validBotIds.has(job.bot_id));
    
    if (orphanedJobs.length > 0) {
      console.log(`Found ${orphanedJobs.length} orphaned jobs. Deleting...`);
      
      // 8. Delete orphaned jobs
      for (const job of orphanedJobs) {
        const { error: deleteError } = await supabase
          .from('jobs')
          .delete()
          .eq('id', job.id);
        
        if (deleteError) {
          console.error(`Error deleting job ${job.id}: ${deleteError.message}`);
        } else {
          console.log(`Deleted orphaned job ${job.id}`);
        }
      }
    } else {
      console.log('No orphaned jobs found.');
    }
    
    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the cleanup function
if (require.main === module) {
  cleanupOrphanedRecords().then(() => process.exit(0));
}