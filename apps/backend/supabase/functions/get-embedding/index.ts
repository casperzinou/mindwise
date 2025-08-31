import { SupabaseClient } from 'npm:@supabase/supabase-js@2'

// Initialize the embedding model session
const session = new Supabase.ai.Session('gte-small')

Deno.serve(async (req) => {
  const corsHeaders = {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'}
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const { query } = await req.json()
    if (!query) { throw new Error('Missing "query" in request body') }

    // Generate the embedding using the native session
    const embedding = await session.run(query, {
      mean_pool: true,
      normalize: true,
    })

    return new Response(JSON.stringify({ embedding }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})