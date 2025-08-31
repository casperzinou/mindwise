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
- Docker (optional, for containerized development)
- Supabase account with pgvector extension enabled
- Google Gemini API key (for embeddings)

## Setup

### Install Dependencies

```bash
cd mindwise
npm install
```

### Environment Variables

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Then update the variables in the `.env` file with your actual values.

### Development with Docker (Recommended)

Start both frontend and backend services:
```bash
docker-compose up
```

Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

### Development without Docker

Start the frontend:
```bash
npm run dev:frontend
```

Start the backend:
```bash
npm run dev:backend
```

## CI/CD

This repository uses GitHub Actions for continuous integration and continuous deployment:

1. **Frontend CI/CD** (`/.github/workflows/frontend.yml`):
   - Runs tests on pull requests
   - Builds and deploys to Cloudflare Pages on main branch pushes

2. **Backend CI/CD** (`/.github/workflows/backend.yml`):
   - Runs tests on pull requests
   - Builds and deploys to Fly.io on main branch pushes

3. **Monorepo CI** (`/.github/workflows/monorepo.yml`):
   - Runs linting and security audits on all code
   - Runs tests for all applications

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

## Deployment

### Frontend Deployment
The frontend is configured for deployment to Cloudflare Pages. Set up the following secrets in your GitHub repository:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Backend Deployment
The backend is configured for deployment to Fly.io. Set up the following secret in your GitHub repository:
- `FLY_API_TOKEN`

## Docker Images

Dockerfiles are provided for both frontend and backend applications:
- `apps/frontend/Dockerfile`
- `apps/backend/Dockerfile`

Build and run with docker-compose:
```bash
docker-compose up --build
```

## License

This project is licensed under the MIT License.