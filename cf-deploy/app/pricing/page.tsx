'use client';

import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$1',
      period: 'per month',
      description: 'Perfect for individuals and small teams getting started with automation.',
      features: [
        '500 Conversations/mo',
        'Automatic Knowledge Sync',
        'Standard Email Support',
        'Basic Analytics',
        '1 Chatbot',
        'Community Support'
      ],
      buttonText: 'Start Your $1 Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'per month',
      description: 'For growing businesses looking to automate core processes.',
      features: [
        '50,000 Conversations/mo',
        'Automatic Knowledge Sync',
        'Priority Email & Chat Support',
        'Advanced Analytics',
        '5 Chatbots',
        'Role-Based Access Control',
        'Smart Human Handoff'
      ],
      buttonText: 'Start Professional Plan',
      popular: true
    },
    {
      name: 'Business',
      price: '$99',
      period: 'per month',
      description: 'For large organizations with advanced security and scale needs.',
      features: [
        'Unlimited Conversations',
        'Automatic Knowledge Sync',
        'Dedicated Account Manager',
        'Premium Analytics & Insights',
        'Unlimited Chatbots',
        'Role-Based Access Control',
        'Smart Human Handoff',
        'Remove "Powered By" Branding',
        'Single Sign-On (SSO)',
        'Audit Logs',
        'VPC/On-Premise Deployment'
      ],
      buttonText: 'Start Business Plan',
      popular: false
    }
  ];

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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start for $1. Upgrade, downgrade, or cancel anytime. No questions asked.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-sm border ${
                plan.popular 
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50 relative' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                
                <Link href="/auth" className="block w-full">
                  <button 
                    className={`w-full py-3 px-4 rounded-md font-medium ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens after my $1 trial month?</h3>
              <p className="text-gray-600">
                After your first 30 days, your subscription will automatically continue at the standard rate 
                of the plan you selected. You'll receive a reminder before your trial ends.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, absolutely. You can cancel your subscription at any time from your account dashboard 
                with a single click. No questions asked, and no hidden fees.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What kind of support is included?</h3>
              <p className="text-gray-600">
                All plans include email support from our team. The Professional and Business plans come with 
                priority support, ensuring you get faster response times.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the "Automatic Knowledge Base Sync" work?</h3>
              <p className="text-gray-600">
                Our AI continuously monitors your website for new content or changes. When it detects updates, 
                it automatically relearns and updates its knowledge base, ensuring your chatbot always has 
                the latest information.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I install the chatbot on my website?</h3>
              <p className="text-gray-600">
                It's incredibly simple! Once your account is set up and your website is scanned, we'll provide 
                you with a single line of JavaScript code. Just copy and paste this code into your website's 
                HTML before the closing {'</body>'} tag, and your chatbot will appear.
              </p>
            </div>
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