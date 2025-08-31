// Test script to verify chat endpoint is working
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testChatEndpoint() {
  console.log('[test]: Testing chat endpoint...');
  
  try {
    // Test the match_documents RPC function
    console.log('[test]: Testing match_documents RPC function...');
    
    // Get embedding for a test query
    const { data: embedData, error: embedError } = await supabase.functions.invoke('get-embedding', { 
      body: { query: 'pricing plans' } 
    });
    
    if (embedError) {
      console.error('[test]: Error generating embedding:', embedError.message);
      return;
    }
    
    console.log('[test]: Successfully generated embedding');
    
    // Test match_documents with the embedding
    const { data: matchData, error: matchError } = await supabase.rpc('match_documents', { 
      query_embedding: embedData.embedding, 
      match_count: 5, 
      filter: { bot_id: 'b2590fca-a443-4024-8e69-cd5f4d377cce' } 
    });
    
    if (matchError) {
      console.error('[test]: Error matching documents:', matchError.message);
      return;
    }
    
    console.log(`[test]: Successfully matched ${matchData.length} documents`);
    
    // Print the first few characters of each document
    matchData.slice(0, 3).forEach((doc: any, index: number) => {
      console.log(`[test]: Document ${index + 1}: ${doc.content.substring(0, 100)}...`);
    });
    
    console.log('[test]: Chat endpoint test completed successfully!');
    
  } catch (error: any) {
    console.error('[test]: Error testing chat endpoint:', error.message);
  }
}

// Run the test
testChatEndpoint().then(() => process.exit(0));