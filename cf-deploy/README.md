# Mindwise Frontend

This is the frontend application for the Mindwise AI Chatbot Platform, built with Next.js 14+.

## Features

- Modern UI built with Tailwind CSS and shadcn/ui components
- User authentication with Supabase Auth
- Dashboard for bot management
- Responsive design for all devices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with the following variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run frontend tests with:
```bash
npm run test
```

## Deployment

For deployment to Cloudflare Pages:
1. Push code to GitHub
2. Connect Cloudflare Pages to your repository
3. Set the environment variables in Cloudflare Pages dashboard

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
app/          # Next.js app router pages
components/   # React components
lib/          # Utility functions and configurations
public/       # Static assets
```