'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would handle the email submission
    // For now, we'll just redirect to the signup page
    router.push(`/auth?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Mindwise
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                Log In
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Your Website into a <span className="text-blue-600">24/7 Sales and Support Agent</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Add a custom AI chatbot to your site with one line of code that instantly answers visitor questions and converts them into customers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg">
                  Claim Your $1 Offer
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-lg">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Glitch Offer Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50" id="offer">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Accountants Are Ready to Riot
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              They demand we charge $99/mo. But our genius engineers overbuilt our servers for 5,000 daily users, and right now, most of that power is sitting idle. So we're making a reckless bet: using that idle server capacity as our entire marketing budget. We know once you try it, going back will feel like trading a supercomputer for a chalkboard. Why? Because OUR AI is just that good.
            </p>
            
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <Link href="/auth">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-xl font-bold rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">Claim the "Glitch" Price</span>
                    <span className="text-lg font-normal">$99/mo of Server Power for $1</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20" id="features">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
              Powerful Features, Effortless Setup
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Everything you need to create intelligent chatbots trained on your website content
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Knowledge Base</h3>
                <p className="text-gray-600">
                  Our AI automatically scans and learns your entire website, help center, and product documentation in minutes. It provides instant, accurate answers to 80% of customer questions, freeing up your team.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M18 9a2 2 0 0 1 2 2v2H4v-2a2 2 0 0 1 2-2Z"></path>
                    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7"></path>
                    <path d="M9 13h6"></path>
                    <path d="m12 16 1.5-1.5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Human Handoff</h3>
                <p className="text-gray-600">
                  When the AI detects a complex issue or a high-value sales lead, it seamlessly escalates the conversation by creating a detailed email ticket, ensuring your agents have all the context they need.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Code-Free Setup</h3>
                <p className="text-gray-600">
                  Get your AI assistant live in minutes, not months. Simply copy and paste one line of code onto your website to deploy your custom-trained chatbot. No complex configuration or developer time required.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
                <p className="text-gray-600">
                  Understand your customers like never before. See what questions they're asking, identify pain points, and track the leads your AI is generating, all from a simple dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Customer Experience?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of businesses using Mindwise to engage customers smarter and boost conversions.
            </p>
            <Link href="/auth">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Mindwise</h4>
              <p className="text-gray-400">
                AI-powered chatbots for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/#how-it-works" className="text-gray-400 hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/refund" className="text-gray-400 hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 MindWise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}