'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { API_BASE_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Trash2, Copy } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

type Chatbot = {
  id: string;
  name: string;
  website_url: string;
};

export default function BotManagementPage() {
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const botId = params.botId as string;

  // Check for required environment variables
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
                      process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch bot data
  const { data: bot, isLoading, isError, error } = useQuery({
    queryKey: ['bot', botId],
    queryFn: async () => {
      if (!isConfigured) {
        throw new Error('Application not properly configured');
      }
      
      if (!botId) throw new Error('Bot ID is required');
      
      const { data, error } = await supabase
        .from('chatbots')
        .select('id, name, website_url')
        .eq('id', botId)
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Bot not found');
      }
      
      return data;
    },
    enabled: !!botId && !!isConfigured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Shorter embed code with loader
  const embedCode = bot ? `<!-- Mindwise Chatbot -->
<script>
  window.mindwiseBot = { 
    botId: "${bot.id}",
    apiUrl: "${API_BASE_URL}"
  };
  (function(){var s=document.createElement('script');s.src='${API_BASE_URL.replace('/api', '')}/mindwise-loader.js';document.head.appendChild(s);})();
</script>
<!-- Powered by Mindwise -->` : '';

  const handleCopy = () => {
    if (embedCode) {
      navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mutation for deleting bot
  const { mutate: deleteBot, isPending: isDeleting, isError: isDeleteError, error: deleteError, isSuccess: isDeleteSuccess } = useMutation({
    mutationFn: async () => {
      if (!isConfigured) {
        throw new Error('Application not properly configured');
      }
      
      if (!bot) throw new Error('Bot not found');
      
      const response = await fetch(`${API_BASE_URL}/bot/${bot.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete the bot.');
      }
      
      return true;
    },
    onSuccess: () => {
      // Invalidate and refetch chatbots query
      queryClient.invalidateQueries({ queryKey: ['chatbots'] });
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Error deleting bot:', error);
    }
  });

  // Handle delete confirmation
  const handleDelete = () => {
    if (!bot) return;

    const isConfirmed = window.confirm(`Are you sure you want to delete the bot "${bot.name}"? This action cannot be undone.`);

    if (isConfirmed) {
      deleteBot();
    }
  };

  // Handle missing configuration
  if (!isConfigured) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            The application is not properly configured. Please ensure the following environment variables are set:
            NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_API_BASE_URL.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading Bot Details...</div>;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Bot</h2>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Handle not found
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 text-white hover:bg-gray-700" 
                  onClick={handleCopy} 
                  disabled={!embedCode}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <pre><code>{embedCode || 'Loading embed code...'}</code></pre>
              </div>
            </div>
            
            {/* Delete Section */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Deleting your chatbot is a permanent action and cannot be undone. This will remove all associated data.
              </p>
              
              {isDeleteError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {deleteError instanceof Error ? deleteError.message : 'Failed to delete bot'}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete this Bot'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}