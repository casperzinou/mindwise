'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

type Chatbot = {
  id: string;
  name: string;
  created_at: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      setUser(session.user);

      // Fetch user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      if (userProfile) {
        setFullName(userProfile.full_name);
      }

      // Fetch user's chatbots
      const { data: chatbotData, error: chatbotError } = await supabase
        .from('chatbots')
        .select('id, name, created_at')
        .eq('user_id', session.user.id);

      if (chatbotError) {
        console.error('Error fetching chatbots:', chatbotError);
      } else if (chatbotData) {
        setChatbots(chatbotData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
            {chatbots.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {chatbots.map((bot) => (
                  <Card key={bot.id}>
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