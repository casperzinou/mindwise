# Migration Guide: From Old Project to Enhanced Version

This guide helps you migrate from the older, simpler version of Mindwise to the enhanced version with improved features and architecture.

## Key Improvements in Enhanced Version

### Backend (Node.js instead of Python Flask)
- **Better Performance**: Node.js offers better performance for I/O-heavy operations
- **Type Safety**: TypeScript provides better type safety and developer experience
- **Modern Architecture**: Express.js with proper middleware and routing
- **Enhanced Scraping**: Improved website scraping with language detection
- **Job Queue System**: Asynchronous job processing for better scalability
- **Multilingual Support**: Automatic language detection and handling

### Frontend (Next.js 14+ App Router)
- **Modern Framework**: Next.js 14+ with App Router for better performance
- **Server Components**: Improved SEO and initial load performance
- **TypeScript**: Better type safety and developer experience
- **Tailwind CSS**: Consistent, responsive design system
- **shadcn/ui**: Professional, accessible UI components
- **Enhanced Dashboard**: Better bot management and user experience

### Chat Widget
- **Improved Design**: Modern, responsive chat interface
- **Multilingual Support**: Automatic language detection
- **Better UX**: Smooth animations and transitions
- **Customizable**: Easy to customize appearance and behavior

## Migration Steps

### 1. Backup Your Current Project
```bash
# Create a backup of your current project
cp -r /path/to/old/project /path/to/old/project-backup
```

### 2. Replace Backend
1. Remove the old Python Flask backend
2. Copy the new Node.js backend
3. Update environment variables:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```

### 3. Replace Frontend
1. Remove the old frontend (if separate)
2. Copy the new Next.js frontend
3. Update environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

### 4. Update Database Schema
Run the updated schema.sql file to update your database tables:
```sql
-- Add missing columns and constraints
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS configuration_details JSONB;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
```

### 5. Update Supabase Functions
Make sure you have the required Supabase functions:
1. `get-embedding` - For generating text embeddings
2. `match_documents` - For semantic search

### 6. Test the Migration
1. Start the backend server:
   ```bash
   cd mindwise-backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd mindwise-frontend
   npm run dev
   ```

3. Create a new chatbot in the dashboard
4. Train it on a website
5. Test the chat widget on your demo website

## Breaking Changes

### API Endpoints
- `/api/chat` - Same functionality but enhanced with multilingual support
- `/api/scrape` - Now creates jobs instead of processing immediately
- `/api/bot/:botId` - Enhanced with language information

### Database Schema
- Added `configuration_details` column to `chatbots` table
- Enhanced `jobs` table with status tracking
- Improved document storage with proper embedding handling

### Environment Variables
- Renamed some variables for consistency
- Added new variables for enhanced functionality

## Rollback Plan

If you encounter issues after migration:

1. Stop both frontend and backend servers
2. Restore the backup of your old project
3. Revert database schema changes if needed
4. Continue using the old version while troubleshooting

## Support

If you encounter any issues during migration, please check:
1. Environment variables are correctly set
2. Database schema is up to date
3. Supabase functions are deployed
4. Network connectivity between frontend and backend

For additional help, refer to the troubleshooting guides:
- `mindwise-frontend/TROUBLESHOOTING.md`
- `mindwise-backend/TROUBLESHOOTING.md`
- `mindwise-backend/TROUBLESHOOTING-WIDGET.md`