'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Chatbot = {
  id: string;
  name: string;
  created_at: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  // Fetch user data
  const { data: userData, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      // Check if we have valid Supabase configuration
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration missing');
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', userData?.user?.id],
    queryFn: async () => {
      if (!userData?.user?.id) return null;
      const { data } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', userData.user.id)
        .single();
      return data;
    },
    enabled: !!userData?.user?.id && !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch user's chatbots
  const { data: chatbots, isLoading: chatbotsLoading, isError: chatbotsError, error: chatbotsFetchError } = useQuery({
    queryKey: ['chatbots', userData?.user?.id],
    queryFn: async () => {
      if (!userData?.user?.id) return [];
      const { data, error } = await supabase
        .from('chatbots')
        .select('id, name, created_at')
        .eq('user_id', userData.user.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    },
    enabled: !!userData?.user?.id && !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Update user state when userData changes
  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
      if (userProfile) {
        setFullName(userProfile.full_name);
      }
    } else if (userData === null) {
      router.push('/auth');
    }
  }, [userData, userProfile, router]);

  // Handle missing environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle user loading state
  if (userLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle user error state
  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load user data. Please try refreshing the page.
          </AlertDescription>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </Alert>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center p-8">
        <div className="w-full max-w-6xl">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">{fullName ? `${fullName}'s Dashboard` : 'Dashboard'}</h1>
              <p className="text-gray-500">Welcome back, {fullName || user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/create-bot">
                <Button>Create New Bot</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          </header>
          <main className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Your Chatbots</h2>
            
            {chatbotsLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : chatbotsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load chatbots: {chatbotsFetchError?.message || 'Unknown error'}
                </AlertDescription>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-4"
                >
                  Retry
                </Button>
              </Alert>
            ) : chatbots && chatbots.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {chatbots.map((bot) => (
                  <Card key={bot.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{bot.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Created: {new Date(bot.created_at).toLocaleDateString()}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/dashboard/bot/${bot.id}`} className="w-full">
                        <Button variant="secondary" className="w-full">Manage Bot</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium">No Chatbots Found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first chatbot.</p>
                <Link href="/dashboard/create-bot">
                    <Button>Create Your First Bot</Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  return null;
}