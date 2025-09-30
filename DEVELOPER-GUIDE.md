# Mindwise AI Chatbot Platform - Developer Guide

This guide provides an overview of the enhanced Mindwise AI Chatbot Platform and instructions for development, deployment, and maintenance.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Enhancements](#backend-enhancements)
3. [Frontend Enhancements](#frontend-enhancements)
4. [Chat Widget Customization](#chat-widget-customization)
5. [Deployment](#deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Mindwise platform follows a modern microservices architecture with:

- **Frontend**: Next.js 14+ with React Server Components
- **Backend**: Node.js/Express with TypeScript
- **Database**: Supabase (PostgreSQL with pgvector)
- **Caching**: Redis for performance optimization
- **Authentication**: Supabase Auth with JWT
- **Deployment**: Docker containers with docker-compose

## Backend Enhancements

### Performance Optimizations

#### Caching Layer
The backend now includes Redis caching for improved performance:

```javascript
// Example usage in services
import { getFromCache, setInCache } from '../services/cacheService';

async function getChatbotInfo(botId) {
  // Try to get from cache first
  const cached = await getFromCache(`chatbot:${botId}`);
  if (cached) return cached;
  
  // Fetch from database if not in cache
  const data = await fetchFromDatabase(botId);
  
  // Store in cache for 5 minutes
  await setInCache(`chatbot:${botId}`, data, 300);
  
  return data;
}
```

#### Database Connection Management
Enhanced connection handling with retry logic:

```javascript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    db: {
      retry: {
        attempts: MAX_RETRIES,
        backoff: (attempt) => Math.pow(2, attempt) * RETRY_DELAY
      }
    }
  });
}
```

### Security Enhancements

#### Input Validation
All API endpoints now include comprehensive input validation:

```javascript
import { validate, validationSchemas } from './middleware/validation';

app.post('/api/chat', validate(validationSchemas.chat), async (req, res) => {
  // Request is automatically validated
  const { botId, query } = req.body;
  // Process request...
});
```

#### Authentication Middleware
JWT-based authentication with authorization checks:

```javascript
import { authenticate } from './middleware/auth';

app.delete('/api/bot/:botId', authenticate, async (req, res) => {
  // User is authenticated and authorized
  const user = req.user;
  // Process request...
});
```

### Monitoring and Observability

#### Structured Logging
Enhanced logging with structured data:

```javascript
import logger from '../utils/logger';

logger.info('Processing chat request', { 
  botId, 
  userId: user?.id,
  queryLength: query.length 
});
```

#### Health Checks
Comprehensive health check endpoint:

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Service is healthy",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Frontend Enhancements

### Data Fetching with React Query
Efficient data fetching with automatic caching:

```javascript
import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  const { data: chatbots, isLoading, isError } = useQuery({
    queryKey: ['chatbots'],
    queryFn: fetchChatbots,
    staleTime: 30 * 1000, // 30 seconds
  });
  
  // Render UI...
}
```

### Performance Optimizations

#### Code Splitting
Dynamic imports for better bundle splitting:

```javascript
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(
  () => import('../components/ChatWidget'),
  { ssr: false }
);
```

## Chat Widget Customization

The chat widget can be fully customized with the following configuration:

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

## Deployment

### Environment Variables

Required environment variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Frontend Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Redis Configuration (optional but recommended)
REDIS_URL=redis://localhost:6379

# Service Configuration
SERVICE_NAME=mindwise-backend
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_MESSAGE=Too many requests from this IP, please try again later.
```

### Docker Deployment

Using docker-compose:

```bash
docker-compose up --build
```

### Manual Deployment

1. Install dependencies:
```bash
cd apps/backend && npm install
cd apps/frontend && npm install
```

2. Build applications:
```bash
cd apps/backend && npm run build
cd apps/frontend && npm run build
```

3. Start applications:
```bash
cd apps/backend && npm start
cd apps/frontend && npm start
```

## Monitoring and Maintenance

### Log Management

Logs are stored in the `logs/` directory with daily rotation:

```bash
# View today's logs
tail -f logs/$(date +%Y-%m-%d).log

# Search for errors
grep "ERROR" logs/*.log
```

### Database Maintenance

Apply database updates:
```bash
cd apps/backend
./update-database.sh
```

### Cache Management

Clear Redis cache:
```javascript
import { flushCache } from './services/cacheService';

await flushCache();
```

## Troubleshooting

### Common Issues

#### Authentication Errors
- Verify Supabase credentials in environment variables
- Check JWT token validity
- Ensure user exists in database

#### Database Connection Issues
- Verify Supabase URL and service key
- Check network connectivity
- Ensure pgvector extension is enabled

#### Redis Connection Issues
- Verify Redis URL in environment variables
- Check Redis server status
- Ensure firewall allows connections

#### Performance Issues
- Check Redis connectivity
- Review database query performance
- Monitor system resources

### Debugging

Enable debug logging:
```env
LOG_LEVEL=debug
```

Monitor real-time logs:
```bash
tail -f logs/latest.log
```

Check health endpoint:
```bash
curl http://localhost:3001/api/health
```

## Support

For issues with the enhanced version, please:

1. Check the logs for error messages
2. Verify environment variable configuration
3. Ensure all services are running
4. Review the troubleshooting section above
5. Contact support with detailed error information and logs