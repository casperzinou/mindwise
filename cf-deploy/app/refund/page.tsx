'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: August 29, 2025</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Commitment to Satisfaction</h2>
            <p>
              At Mindwise, we're committed to providing exceptional value with our AI chatbot platform. 
              Our $1/month pricing reflects our confidence in delivering a service that exceeds expectations. 
              However, if you're not completely satisfied, we offer a straightforward refund policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Trial Period Refunds</h2>
            <p>
              <strong>Full Refund Guarantee:</strong> If you're not satisfied with our service within your 
              first 14 days of using Mindwise, we'll provide a full refund with no questions asked. 
              Simply contact our support team at{' '}
              <a href="mailto:support@mindwise-demo.pages.dev" className="text-blue-600 hover:underline">
                support@mindwise-demo.pages.dev
              </a>{' '}
              with your account details and a brief explanation.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Beyond Trial Period</h2>
            <p>
              After the initial 14-day period, refunds are considered on a case-by-case basis for the 
              current billing period. We evaluate factors such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service downtime or technical issues that prevented usage</li>
              <li>Failure to deliver promised features or functionality</li>
              <li>Significant changes to our service that materially affect your usage</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Non-Refundable Items</h2>
            <p>The following are generally not eligible for refunds:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unused service time after the 14-day trial period</li>
              <li>Custom development or consulting services</li>
              <li>Enterprise or custom plan services (handled separately)</li>
              <li>Third-party services or integrations</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to Request a Refund</h2>
            <p>To request a refund, please:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact us at{' '}
                <a href="mailto:billing@mindwise-demo.pages.dev" className="text-blue-600 hover:underline">
                  billing@mindwise-demo.pages.dev
                </a>
              </li>
              <li>Include your account email and subscription details</li>
              <li>Explain the reason for your refund request</li>
              <li>If within 14 days, refunds are typically processed within 24 hours</li>
              <li>For requests beyond 14 days, we review and respond within 5 business days</li>
            </ol>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Refund Method</h2>
            <p>
              Refunds are processed through the original payment method. For credit card payments, 
              refunds typically appear within 5-10 business days. For other payment methods, 
              processing times may vary.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Subscription Cancellation</h2>
            <p>
              You can cancel your subscription at any time through your account dashboard. 
              Cancellation takes effect at the end of your current billing period. 
              No further charges will be applied after cancellation.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Questions?</h2>
            <p>
              If you have any questions about our refund policy, please contact us at:{' '}
              <a href="mailto:billing@mindwise-demo.pages.dev" className="text-blue-600 hover:underline">
                billing@mindwise-demo.pages.dev
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