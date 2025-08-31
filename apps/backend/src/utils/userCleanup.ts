import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Completely delete a user and all associated data
 * @param userId The ID of the user to delete
 */
export async function deleteUserAndData(userId: string) {
  try {
    console.log(`Starting deletion process for user ${userId}...`);
    
    // 1. Get all chatbots for this user
    const { data: chatbots, error: chatbotsError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('user_id', userId);
    
    if (chatbotsError) {
      throw new Error(`Error fetching user's chatbots: ${chatbotsError.message}`);
    }
    
    // 2. Delete all jobs associated with the user's chatbots
    if (chatbots.length > 0) {
      const botIds = chatbots.map(bot => bot.id);
      
      const { error: jobsDeleteError } = await supabase
        .from('jobs')
        .delete()
        .in('bot_id', botIds);
      
      if (jobsDeleteError) {
        console.error(`Error deleting jobs: ${jobsDeleteError.message}`);
        // Continue with deletion even if this fails
      } else {
        console.log(`Deleted jobs for ${botIds.length} chatbots`);
      }
      
      // 3. Delete all chatbots for this user
      const { error: chatbotsDeleteError } = await supabase
        .from('chatbots')
        .delete()
        .eq('user_id', userId);
      
      if (chatbotsDeleteError) {
        throw new Error(`Error deleting chatbots: ${chatbotsDeleteError.message}`);
      }
      
      console.log(`Deleted ${chatbots.length} chatbots for user ${userId}`);
    } else {
      console.log(`No chatbots found for user ${userId}`);
    }
    
    // 4. Delete the user from the custom users table
    const { error: userDeleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (userDeleteError) {
      throw new Error(`Error deleting user from users table: ${userDeleteError.message}`);
    }
    
    console.log(`Successfully deleted user ${userId} from users table`);
    
    // Note: The actual Supabase Auth user deletion should be handled separately
    // This function only cleans up the custom data
    
    console.log(`Successfully completed deletion process for user ${userId}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Error during user deletion process:`, error);
    return { success: false, error: error.message };
  }
}