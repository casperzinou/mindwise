# Mindwise AI Chatbot Platform - Enhanced Version

Mindwise is an AI-powered chatbot platform that allows users to turn their websites into 24/7 sales and support agents. The platform automatically trains chatbots on website content to answer visitor questions and convert them into customers.

This is an enhanced version of the Mindwise platform with significant performance, security, and user experience improvements. See [ENHANCEMENTS-README.md](ENHANCEMENTS-README.md) for details on all improvements.

## Project Structure

This monorepo contains three main applications:

1. **Frontend** (`apps/frontend`): A Next.js 14+ application with a modern UI built using Tailwind CSS and shadcn/ui components
2. **Backend** (`apps/backend`): A Node.js/TypeScript API built with Express.js
3. **Static Website** (`apps/static-website`): Static HTML/CSS files for simple web pages

## Enhanced Features

- **AI Chatbots**: Automatically trained on website content to answer visitor questions
- **Multilingual Support**: Automatic language detection and translation capabilities
- **Website Scraping**: Intelligent content extraction from websites with automatic language detection
- **Job Queue System**: Asynchronous processing of scraping jobs
- **Dashboard**: User management interface for creating and managing chatbots
- **Chat Widget**: Embeddable chat widget with extensive customization options
- **Smart Human Handoff**: Automatic escalation of complex issues to human agents
- **Redis Caching**: Improved performance with Redis caching layer
- **Input Validation**: Comprehensive input validation for all API endpoints
- **Authentication**: JWT-based authentication with authorization checks
- **Structured Logging**: Enhanced logging with JSON format for production
- **Health Checks**: Comprehensive service health monitoring

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized development)
- Supabase account with pgvector extension enabled
- Google Gemini API key (for embeddings)
- Redis (optional but recommended for production)

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

## Enhanced API Endpoints

All API endpoints now include:

- Input validation
- Authentication where required
- Better error handling
- Structured logging

### Protected Endpoints (require authentication)
- `POST /api/scrape` - Start website scraping job
- `POST /api/trigger-jobs` - Manually trigger job processing
- `DELETE /api/bot/:botId` - Delete a chatbot

### Public Endpoints
- `POST /api/chat` - Process chat messages (optional authentication)
- `GET /api/chatbot/:botId` - Get chatbot information (optional authentication)
- `GET /api/health` - Health check endpoint
- `GET /api/ping` - Simple ping endpoint

## Chat Widget Customization

The chat widget can be customized with the following configuration:

```html
<script>
  window.mindwiseBot = { 
    botId: "YOUR_BOT_ID",
    apiUrl: "http://localhost:3001/api",
    title: "Custom Chat Title",
    position: "bottom-right", // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    theme: "blue", // 'blue', 'green', 'purple', 'custom'
    customTheme: {
      primary: '#FF0000',
      primaryHover: '#CC0000',
      headerBg: '#FF0000'
    },
    width: 400,
    height: 600,
    showBranding: false,
    greetingMessage: "Welcome to our support chat!"
  };
  (function(){var s=document.createElement('script');s.src='http://localhost:3001/mindwise-loader.js';document.head.appendChild(s);})();
</script>
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

## Documentation

- [Developer Guide](DEVELOPER-GUIDE.md) - Comprehensive guide for development and maintenance
- [Enhancements README](ENHANCEMENTS-README.md) - Detailed overview of all improvements
- [Project Overview](PROJECT-OVERVIEW.md) - Original project vision and roadmap
- [Enhancement Overview](PROJECT-ENHANCEMENT-OVERVIEW.md) - Comparison of before/after enhancements

## License

This project is licensed under the MIT License.