'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { API_BASE_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react'; // Import Trash2 icon

type Chatbot = {
  id: string;
  name: string;
  website_url: string;
};

export default function BotManagementPage() {
  const [bot, setBot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false); // State for delete operation
  const [error, setError] = useState<string | null>(null); // State for errors
  const params = useParams();
  const router = useRouter();
  const botId = params.botId as string;

  useEffect(() => {
    if (!botId) return;

    const fetchBotData = async () => {
      try {
        const { data, error } = await supabase
          .from('chatbots')
          .select('id, name, website_url')
          .eq('id', botId)
          .single();

        if (error || !data) {
          console.error('Error fetching bot data:', error);
          router.push('/dashboard');
        } else {
          setBot(data);
        }
      } catch (err) {
        console.error('Error fetching bot data:', err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchBotData();
  }, [botId, router]);

  // Shorter embed code with loader
  const embedCode = bot ? `<!-- Mindwise Chatbot -->
<script>
  window.mindwiseBot = { 
    botId: "${bot.id}",
    apiUrl: "http://localhost:3001/api"
  };
  (function(){var s=document.createElement('script');s.src='http://localhost:3001/mindwise-loader.js';document.head.appendChild(s);})();
</script>
<!-- Powered by Mindwise -->` : '';

  function handleCopy() {
    if (embedCode) {
      navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- NEW: FUNCTION TO HANDLE DELETION ---
  const handleDelete = async () => {
    if (!bot) return;

    const isConfirmed = window.confirm(`Are you sure you want to delete the bot "${bot.name}"? This action cannot be undone.`);

    if (isConfirmed) {
      setDeleting(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/bot/${bot.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete the bot.');
        }

        // On successful deletion, redirect to the dashboard
        router.push('/dashboard');

      } catch (err) {
        const error = err as Error;
        setError(error.message);
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading Bot Details...</div>;
  }

  if (!bot) {
    return <div className="flex justify-center items-center min-h-screen">Bot not found. Redirecting...</div>;
  }

  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Manage: {bot.name}</CardTitle>
            <CardDescription>
              Trained on: <a href={bot.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{bot.website_url}</a>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">Embed on Your Website</h3>
              <p className="text-sm text-gray-600 mb-4">
                Copy and paste this snippet into the {`<head>`} section of your website{`'`}s HTML file.
              </p>
              <div className="relative bg-gray-900 text-white rounded-md p-4 font-mono text-sm">
                <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-white hover:bg-gray-700" onClick={handleCopy} disabled={!embedCode}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <pre><code>{embedCode || 'Loading embed code...'}</code></pre>
              </div>
            </div>
            
            {/* --- NEW: DELETE SECTION --- */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Deleting your chatbot is a permanent action and cannot be undone. This will remove all associated data.
              </p>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting ? 'Deleting...' : 'Delete this Bot'}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}