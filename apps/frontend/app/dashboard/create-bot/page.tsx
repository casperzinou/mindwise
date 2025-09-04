'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { API_BASE_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreateBotPage() {
  const [botName, setBotName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [botPersonality, setBotPersonality] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check for required environment variables
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
                      process.env.NEXT_PUBLIC_API_BASE_URL;

  // Validation functions
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    if (!botName.trim()) {
      return false;
    }

    if (!websiteUrl.trim()) {
      return false;
    }

    if (!validateUrl(websiteUrl)) {
      return false;
    }

    if (!supportEmail.trim()) {
      return false;
    }

    if (!validateEmail(supportEmail)) {
      return false;
    }

    if (botPersonality && botPersonality.length > 1000) {
      return false;
    }

    return true;
  };

  // Mutation for creating bot
  const { mutate: createBot, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async () => {
      // Check configuration
      if (!isConfigured) {
        throw new Error('Application not properly configured. Please check environment variables.');
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to create a bot.');
      }

      // 1. Insert the new bot and get its ID back from Supabase
      const { data: newBot, error: insertError } = await supabase
        .from('chatbots')
        .insert({
          name: botName,
          user_id: user.id,
          website_url: websiteUrl,
          support_email: supportEmail,
          configuration_details: { personality: botPersonality }
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create bot: ${insertError.message}`);
      }

      // 2. If the insert was successful, call our backend to start the scrape
      const response = await fetch(`${API_BASE_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botId: newBot.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start scraping process.');
      }

      return newBot;
    },
    onSuccess: () => {
      // Invalidate and refetch chatbots query
      queryClient.invalidateQueries({ queryKey: ['chatbots'] });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    },
    onError: (error) => {
      console.error('Error creating bot:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    createBot();
  };

  // Handle missing configuration
  if (!isConfigured) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
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

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create a New Chatbot</CardTitle>
          <CardDescription>Enter the website to train your bot on.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input 
                  id="bot-name" 
                  placeholder="e.g., Acme Inc. Support" 
                  value={botName} 
                  onChange={(e) => setBotName(e.target.value)} 
                  required 
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input 
                  id="website-url" 
                  type="url" 
                  placeholder="https://www.yourwebsite.com" 
                  value={websiteUrl} 
                  onChange={(e) => setWebsiteUrl(e.target.value)} 
                  required 
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support-email">Support Team Email</Label>
                <Input 
                  id="support-email" 
                  type="email" 
                  placeholder="e.g., support@yourcompany.com" 
                  value={supportEmail} 
                  onChange={(e) => setSupportEmail(e.target.value)} 
                  required 
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bot-personality">Personality / Instructions (Optional)</Label>
                <Textarea 
                  id="bot-personality" 
                  placeholder="Leave blank to auto-generate based on your website." 
                  value={botPersonality} 
                  onChange={(e) => setBotPersonality(e.target.value)} 
                  rows={4} 
                  disabled={isPending}
                  maxLength={1000}
                />
                {botPersonality && (
                  <div className="text-sm text-gray-500">
                    {botPersonality.length}/1000 characters
                  </div>
                )}
              </div>
              
              {isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error instanceof Error ? error.message : 'An unknown error occurred'}
                  </AlertDescription>
                </Alert>
              )}
              
              {isSuccess && (
                <Alert variant="default" className="border-green-500 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Bot created successfully! Training has started and may take a few minutes to complete. Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" disabled={isPending || !validateForm()}>
                {isPending ? 'Creating...' : 'Create & Start Training'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}