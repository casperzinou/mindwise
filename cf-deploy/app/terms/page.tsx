'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: August 29, 2025</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Acceptance of Terms</h2>
            <p>
              By accessing or using the Mindwise platform (&quot;Services&quot;), you agree to be bound by these 
              Terms of Service (&quot;Terms&quot;) and all applicable laws and regulations. If you do not agree 
              with any of these terms, you are prohibited from using or accessing the Services.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Description of Services</h2>
            <p>
              Mindwise provides an AI-powered chatbot platform that enables users to create intelligent 
              chatbots trained on their website content. Our Services include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Website content scraping and processing</li>
              <li>AI chatbot training and deployment</li>
              <li>Chat widget integration</li>
              <li>Analytics and performance tracking</li>
              <li>Customer support and human handoff features</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">User Accounts</h2>
            <p>
              You must create an account to use certain features of our Services. You are responsible for 
              maintaining the confidentiality of your account credentials and for all activities that occur 
              under your account.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Services for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Scrape or collect content from websites you don't own or have permission to access</li>
              <li>Distribute spam or malicious content through chatbots</li>
              <li>Attempt to reverse engineer or hack the Services</li>
              <li>Share your account credentials with others</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Intellectual Property</h2>
            <p>
              The Services and all content, features, and functionality are owned by Mindwise and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property laws. You retain ownership of your website content and chatbot data.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Subscription and Payment</h2>
            <p>
              Our Services are offered on a subscription basis. You agree to pay all fees associated with 
              your chosen plan. All payments are non-refundable except as expressly provided in our 
              Refund Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data and Privacy</h2>
            <p>
              Our Privacy Policy explains how we collect, use, and protect your information. By using our 
              Services, you consent to the collection and use of information in accordance with our Privacy Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for any reason 
              whatsoever, including without limitation if you breach the Terms. Upon termination, your right 
              to use the Services will immediately cease.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Disclaimer of Warranties</h2>
            <p>
              The Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, 
              either express or implied. We do not warrant that the Services will be uninterrupted, 
              timely, secure, or error-free.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Limitation of Liability</h2>
            <p>
              In no event shall Mindwise be liable for any indirect, incidental, special, consequential 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your access to or use of the Services.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will notify you of 
              any changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:legal@mindwise-demo.pages.dev" className="text-blue-600 hover:underline">
                legal@mindwise-demo.pages.dev
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