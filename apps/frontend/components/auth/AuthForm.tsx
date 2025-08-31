'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // New state for full name
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Sign In and Sign Up
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Basic validation functions
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateFullName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !validateFullName(fullName)) {
      setError('Please enter your full name (at least 2 characters).');
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      // Handle Sign Up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName // Pass the full name here
          }
        }
      });
      if (error) setError(error.message);
      else setMessage('Check your email for the confirmation link!');
    } else {
      // Handle Sign In
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else router.push('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-[350px]">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input 
                id="full-name" 
                placeholder="John Doe" 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                disabled={isLoading}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
          <p className="text-sm text-center text-gray-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <Button 
              variant="link" 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}