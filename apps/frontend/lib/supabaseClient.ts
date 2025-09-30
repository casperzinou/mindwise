import { createClient } from '@supabase/supabase-js';

// Use empty strings as fallbacks to prevent build errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only throw an error if we're in the browser and the variables are still missing
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

// Create a dummy client for build time if variables are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('', ''); // Create a dummy client that won't be used during build