# Production Deployment Guide

This guide explains how to deploy the Mindwise AI Chatbot Platform to production using Cloudflare Pages for the frontend and Fly.io for the backend.

## Prerequisites

1. GitHub account
2. Cloudflare account
3. Fly.io account
4. Supabase account with pgvector extension enabled
5. Google Gemini API key
6. Domain name (optional but recommended)

## Deployment Architecture

```
[Users] → [Cloudflare Pages (Frontend)] 
              ↓
       [Fly.io (Backend API)]
              ↓
      [Supabase (Database)]
```

## Frontend Deployment (Cloudflare Pages)

### 1. Prepare Repository
1. Push your frontend code to a GitHub repository
2. Ensure the frontend directory is at the root of the repository

### 2. Connect to Cloudflare Pages
1. Go to the Cloudflare dashboard
2. Navigate to Pages > Create a project
3. Connect to your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/` (if frontend is at root) or `/mindwise-frontend`

### 3. Set Environment Variables
In Cloudflare Pages dashboard, set the following environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=https://your-fly-app.fly.dev/api
```

### 4. Deploy
1. Click "Save and Deploy"
2. Wait for deployment to complete
3. Note the deployed URL

## Backend Deployment (Fly.io)

### 1. Install Fly CLI
```bash
# Windows
iwr https://fly.io/install.ps1 -useb | iex

# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh
```

### 2. Authenticate
```bash
fly auth login
```

### 3. Prepare Backend for Deployment
1. Navigate to your backend directory
2. Ensure `fly.toml` exists (create one if needed)
3. Update environment variables in `.env.production`:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```

### 4. Create Fly.io App
```bash
fly launch
```
Follow the prompts:
- Choose app name (or let Fly generate one)
- Select region closest to your users
- Don't deploy yet (we'll do that after configuration)

### 5. Set Secrets
```bash
fly secrets set SUPABASE_URL=your_supabase_project_url
fly secrets set SUPABASE_SERVICE_KEY=your_supabase_service_key
fly secrets set SUPABASE_ANON_KEY=your_supabase_anon_key
fly secrets set GEMINI_API_KEY=your_gemini_api_key
```

### 6. Configure fly.toml
Ensure your `fly.toml` includes:
```toml
app = "your-app-name"
primary_region = "iad"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "3001"

[[services]]
  http_checks = []
  internal_port = 3001
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

### 7. Deploy Backend
```bash
fly deploy
```

### 8. Scale Resources (if needed)
```bash
# For initial deployment, 256MB should be sufficient
fly scale memory 256

# As you grow, you can increase resources
fly scale memory 512
fly scale vm shared-cpu-2x
```

## Database Configuration (Supabase)

### 1. Enable pgvector Extension
In Supabase SQL Editor, run:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
```

### 2. Create Tables
Run the `schema.sql` file from your backend to create all required tables.

### 3. Deploy Functions
Deploy the required Supabase functions:
1. `get-embedding`
2. `match_documents`

## Post-Deployment Configuration

### 1. Update Frontend Environment Variables
In Cloudflare Pages, update:
```
NEXT_PUBLIC_API_BASE_URL=https://your-fly-app.fly.dev/api
```

### 2. Update Chat Widget Configuration
When embedding the chat widget, update the `apiUrl`:
```html
<!-- Mindwise Chatbot -->
<script>
  window.mindwiseBot = { 
    botId: "YOUR_BOT_ID",
    apiUrl: "https://your-fly-app.fly.dev/api"
  };
  (function(){var s=document.createElement('script');s.src='https://your-fly-app.fly.dev/mindwise-chat.js';document.head.appendChild(s);})();
</script>
<!-- Powered by Mindwise -->
```

## Monitoring and Maintenance

### 1. Monitor Backend
```bash
# View logs
fly logs

# Check app status
fly status

# View metrics
fly metrics
```

### 2. Monitor Frontend
- Use Cloudflare Analytics dashboard
- Monitor page load times
- Check for JavaScript errors

### 3. Database Monitoring
- Use Supabase Dashboard
- Monitor query performance
- Check storage usage

## Scaling Considerations

### Initial Scale (Free Tier)
- Cloudflare Pages: Free tier
- Fly.io: Free tier (3 shared-CPU-1x 256MB)
- Supabase: Free tier

### Growth Scale
- Cloudflare Pages: No changes needed
- Fly.io: Upgrade to paid plan ($5-10/month)
- Supabase: Upgrade to Pro plan ($25/month)

### High Traffic Scale
- Cloudflare Pages: No changes needed
- Fly.io: Multiple instances with load balancing
- Supabase: Upgrade to larger plan with more resources

## Cost Estimation

| Service | Free Tier | Initial Cost | Growth Cost |
|---------|-----------|--------------|-------------|
| Cloudflare Pages | Yes | $0 | $0 |
| Fly.io | Yes | $0 | $5-10/month |
| Supabase | Yes | $0 | $25/month |
| Domain | No | $10-15/year | $10-15/year |

**Total Monthly Cost**: $0 (Free) to $35-40/month (Growth)

## Troubleshooting Common Issues

### Widget Not Loading
1. Check browser console for JavaScript errors
2. Verify widget files are accessible:
   ```bash
   curl -I https://your-fly-app.fly.dev/mindwise-chat.js
   ```
3. Ensure CORS is configured correctly in backend

### Chat Not Working
1. Check network tab for failed API requests
2. Verify bot exists and is trained:
   ```sql
   SELECT * FROM chatbots WHERE id = 'YOUR_BOT_ID';
   SELECT * FROM jobs WHERE bot_id = 'YOUR_BOT_ID' ORDER BY created_at DESC LIMIT 1;
   ```
3. Check that documents exist for the bot:
   ```sql
   SELECT COUNT(*) FROM documents WHERE metadata->>'bot_id' = 'YOUR_BOT_ID';
   ```

### Scraping Issues
1. Check job processor logs:
   ```bash
   fly logs
   ```
2. Verify website is accessible:
   ```bash
   curl -I YOUR_WEBSITE_URL
   ```
3. Check that the website content is in a supported language

## Conclusion

This deployment setup provides:
- High performance with global CDN (Cloudflare)
- Scalable backend (Fly.io)
- Reliable database (Supabase)
- Low cost for initial launch
- Easy scaling as you grow

The architecture is production-ready and can handle thousands of users with proper scaling.