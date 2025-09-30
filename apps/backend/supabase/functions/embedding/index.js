"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_2_1 = require("npm:@supabase/supabase-js@2");
const text_splitter_1 = require("npm:langchain/text_splitter");
const scraper_ts_1 = require("../_shared/scraper.ts"); // We will create this shared file
const session = new Supabase.ai.Session('gte-small');
Deno.serve(async (req) => {
    try {
        const supabaseClient = (0, supabase_js_2_1.createClient)(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'));
        const { record: job } = await req.json();
        const { bot_id: botId, id: jobId } = job;
        // 1. Get the website URL from the chatbots table
        const { data: chatbot, error: fetchError } = await supabaseClient.from('chatbots').select('website_url').eq('id', botId).single();
        if (fetchError)
            throw new Error(`Failed to fetch chatbot: ${fetchError.message}`);
        // 2. Scrape the website
        const scrapedText = await (0, scraper_ts_1.scrapeWebsite)(chatbot.website_url);
        // 3. Delete old documents
        await supabaseClient.from('documents').delete().eq('bot_id', botId);
        // 4. Split text and generate embeddings
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
        const documents = await splitter.createDocuments([scrapedText]);
        const embeddings = await session.run(documents.map((doc) => doc.pageContent), { mean_pool: true, normalize: true });
        const documentsToInsert = documents.map((doc, i) => ({ bot_id: botId, content: doc.pageContent, embedding: embeddings[i] }));
        // 5. Insert new documents
        const { error: insertError } = await supabaseClient.from('documents').insert(documentsToInsert);
        if (insertError)
            throw new Error(`Failed to insert documents: ${insertError.message}`);
        // 6. Delete the job from the queue
        await supabaseClient.from('jobs').delete().eq('id', jobId);
        return new Response(JSON.stringify({ message: `Successfully processed job ${jobId}` }), { status: 200 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
//# sourceMappingURL=index.js.map