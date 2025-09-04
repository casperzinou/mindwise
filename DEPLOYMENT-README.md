# Mindwise Backend Deployment Guide

This guide outlines the steps needed to deploy and configure the Mindwise backend properly.

## Current Status

The backend has been successfully deployed to Fly.io, but there are issues with database connectivity that need to be resolved.

## Required Steps to Fix Database Connectivity

1. **Enable PostgreSQL Extensions in Supabase**:
   - Log in to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the following SQL commands:
     ```sql
     CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE EXTENSION IF NOT EXISTS "vector";
     ```

2. **Apply Database Schema**:
   - In the Supabase SQL Editor, run the contents of the `schema.sql` file from the backend directory
   - This will create all necessary tables and indexes

3. **Deploy Supabase Functions**:
   - From the backend directory, deploy the functions using:
     ```bash
     supabase functions deploy
     ```

## Environment Variables

Ensure the following environment variables are set in your Fly.io application:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your Supabase service key
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `GEMINI_API_KEY` - Your Google Gemini API key

You can set these using:
```bash
fly secrets set SUPABASE_URL=your_supabase_project_url
fly secrets set SUPABASE_SERVICE_KEY=your_supabase_service_key
fly secrets set SUPABASE_ANON_KEY=your_supabase_anon_key
fly secrets set GEMINI_API_KEY=your_gemini_api_key
```

## Restart the Application

After making these changes, restart the Fly.io application:
```bash
fly machine restart 3287e559c33218
```

## Verification

Once the application is restarted, verify it's working by accessing:
- Health check: https://mindwise-backend.fly.dev/api/health
- Ping endpoint: https://mindwise-backend.fly.dev/api/ping

## Troubleshooting

If you continue to experience issues:

1. Check the application logs:
   ```bash
   fly logs
   ```

2. Verify database connectivity by testing the Supabase connection directly

3. Ensure all required environment variables are set correctly

4. Check that the Supabase project has the pgvector extension enabled