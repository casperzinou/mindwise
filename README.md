# Mindwise AI Chatbot Platform

Mindwise is an AI-powered chatbot platform that allows users to turn their websites into 24/7 sales and support agents. The platform automatically trains chatbots on website content to answer visitor questions and convert them into customers.

## Project Structure

This monorepo contains three main applications:

1. **Frontend** (`apps/frontend`): A Next.js 14+ application with a modern UI built using Tailwind CSS and shadcn/ui components
2. **Backend** (`apps/backend`): A Node.js/TypeScript API built with Express.js
3. **Static Website** (`apps/static-website`): Static HTML/CSS files for simple web pages

## Features

- **AI Chatbots**: Automatically trained on website content to answer visitor questions
- **Multilingual Support**: Automatic language detection and translation capabilities
- **Website Scraping**: Intelligent content extraction from websites with automatic language detection
- **Job Queue System**: Asynchronous processing of scraping jobs
- **Dashboard**: User management interface for creating and managing chatbots
- **Chat Widget**: Embeddable chat widget with customizable appearance
- **Smart Human Handoff**: Automatic escalation of complex issues to human agents

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account with pgvector extension enabled
- Google Gemini API key (for embeddings)

## Setup

### Install Dependencies

```bash
cd mindwise
npm install
```

### Environment Variables

Each application requires its own environment variables. See the README files in each app directory for specific setup instructions.

### Development

Start the frontend:
```bash
npm run dev:frontend
```

Start the backend:
```bash
npm run dev:backend
```

## Deployment

See the individual app README files for deployment instructions:

- [Frontend Deployment](./apps/frontend/README.md)
- [Backend Deployment](./apps/backend/README.md)

## Testing

Run tests for all applications:
```bash
npm test
```

Run tests for a specific application:
```bash
npm run test:frontend
npm run test:backend
```

## License

This project is licensed under the MIT License.