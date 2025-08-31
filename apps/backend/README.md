# Mindwise Backend

This is the backend API for the Mindwise AI Chatbot Platform, built with Node.js and Express.js.

## Features

- RESTful API architecture
- Job queue system for asynchronous processing
- Multilingual support with language detection
- Website scraping and content processing
- Chat widget serving

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account with pgvector extension
- Google Gemini API key

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```bash
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run backend tests with:
```bash
npm run test
```

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint
- `GET /api/ping` - Simple ping endpoint

### Chat
- `POST /api/chat` - Process chat requests
- `GET /api/chatbot/:botId` - Get chatbot information

### Bot Management
- `POST /api/scrape` - Create a scraping job
- `POST /api/trigger-jobs` - Manually trigger job processing
- `DELETE /api/bot/:botId` - Delete a chatbot

## Deployment

For deployment to Fly.io:
1. Install Fly CLI
2. Authenticate with Fly
3. Create a Fly app
4. Set secrets
5. Deploy with `fly deploy`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run job-processor` - Run job processor

## Project Structure

```
src/              # Source code
  routes/         # API route handlers
  services/       # Business logic
  test/           # Test utilities
  utils/          # Utility functions
```