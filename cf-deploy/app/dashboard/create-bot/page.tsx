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
import { AlertCircle } from 'lucide-react';

export default function CreateBotPage() {
  const [botName, setBotName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [botPersonality, setBotPersonality] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

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
      setError('Please enter a bot name.');
      return false;
    }

    if (!websiteUrl.trim()) {
      setError('Please enter a website URL.');
      return false;
    }

    if (!validateUrl(websiteUrl)) {
      setError('Please enter a valid website URL (e.g., https://www.example.com).');
      return false;
    }

    if (!supportEmail.trim()) {
      setError('Please enter a support email.');
      return false;
    }

    if (!validateEmail(supportEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (botPersonality && botPersonality.length > 1000) {
      setError('Personality description must be less than 1000 characters.');
      return false;
    }

    return true;
  };

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to create a bot.');
      setLoading(false);
      return;
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
      setError(`Failed to create bot: ${insertError.message}`);
      setLoading(false);
      return;
    }

    // 2. If the insert was successful, call our backend to start the scrape
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrape`, {
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

      // 3. If everything is successful, show success message
      setSuccess('Bot created successfully! Training has started and may take a few minutes to complete.');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (apiError) {
      const error = apiError as Error;
      setError(`Bot created, but failed to start training. Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create a New Chatbot</CardTitle>
          <CardDescription>Enter the website to train your bot on.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBot}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input 
                  id="bot-name" 
                  placeholder="e.g., Acme Inc. Support" 
                  value={botName} 
                  onChange={(e) => setBotName(e.target.value)} 
                  required 
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  maxLength={1000}
                />
                {botPersonality && (
                  <div className="text-sm text-gray-500">
                    {botPersonality.length}/1000 characters
                  </div>
                )}
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert variant="default" className="border-green-500 text-green-700">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create & Start Training'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}