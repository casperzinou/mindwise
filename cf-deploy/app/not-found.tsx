'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Mindwise
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                Log In
              </Link>
              <Link href="/auth">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-9xl font-bold text-blue-600 mb-6">404</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-10">
              Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/">
                <button className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </button>
              </Link>
              <Link href="/support">
                <button className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 font-medium">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Contact Support
                </button>
              </Link>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Need Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                  <p className="text-gray-600 mb-4">Find answers in our comprehensive documentation.</p>
                  <Link href="/docs" className="text-blue-600 hover:underline font-medium">
                    Browse Docs
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600 mb-4">Connect with other users in our community forum.</p>
                  <Link href="/community" className="text-blue-600 hover:underline font-medium">
                    Join Community
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-gray-600 mb-4">Get help from our support team.</p>
                  <Link href="/support" className="text-blue-600 hover:underline font-medium">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 MindWise. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-white">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}