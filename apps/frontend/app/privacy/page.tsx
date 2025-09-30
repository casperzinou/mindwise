'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: August 29, 2025</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Introduction</h2>
            <p>
              At Mindwise (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              use our AI chatbot platform and related services (collectively, the &quot;Services&quot;).
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address, company details)</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Website URLs you provide for chatbot training</li>
              <li>Support requests and communications</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Information Automatically Collected</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Chatbot interaction data (queries, responses, timestamps)</li>
            </ul>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Website Content</h3>
            <p>
              When you create a chatbot, we scrape and process the content of the websites you provide. 
              This content is used solely to train your chatbot and is not shared with third parties.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Services</li>
              <li>To train and improve your AI chatbots</li>
              <li>To communicate with you about your account and services</li>
              <li>To process transactions and send billing information</li>
              <li>To improve our platform and develop new features</li>
              <li>To comply with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure storage of sensitive information</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication mechanisms</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our Services and comply 
              with legal obligations. You may request deletion of your data at any time through your 
              account settings or by contacting support.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your information</li>
              <li>Object to processing of your information</li>
              <li>Data portability</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:privacy@mindwise-demo.pages.dev" className="text-blue-600 hover:underline">
                privacy@mindwise-demo.pages.dev
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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