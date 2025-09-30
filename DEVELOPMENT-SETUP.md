# Development Setup Guide

This guide will help you set up the Mindwise AI Chatbot Platform for local development.

## Prerequisites

Before you begin, ensure you have the following installed:
- Git
- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (optional but recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/casperzinou/mindwise.git
cd mindwise
```

### 2. Set Up Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the variables in the `.env` file with your actual values:
- Supabase credentials
- Google Gemini API key

### 3. Install Dependencies

```bash
make install
```

Or manually:
```bash
npm install
cd apps/frontend && npm install
cd ../backend && npm install
```

## Development Options

### Option 1: Using Docker (Recommended)

Start the development environment with Docker Compose:

```bash
make docker
```

Or manually:
```bash
docker-compose up
```

This will start both the frontend (on port 3000) and backend (on port 3001).

### Option 2: Without Docker

Start the frontend:
```bash
make dev-frontend
```

Or manually:
```bash
cd apps/frontend
npm run dev
```

In a separate terminal, start the backend:
```bash
make dev-backend
```

Or manually:
```bash
cd apps/backend
npm run dev
```

## Accessing the Applications

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

## Running Tests

Run all tests:
```bash
make test
```

Or run tests for specific applications:
```bash
make test-frontend
make test-backend
```

## Building for Production

Build all applications:
```bash
make build
```

Or build specific applications:
```bash
make build-frontend
make build-backend
```

## Project Structure

```
mindwise/
├── apps/
│   ├── frontend/        # Next.js frontend application
│   ├── backend/         # Node.js backend API
│   └── static-website/  # Static HTML/CSS files
├── .github/workflows/   # CI/CD workflows
├── .env.example         # Environment variables template
├── docker-compose.yml   # Docker Compose configuration
├── Makefile             # Development commands
└── package.json         # Root package.json for monorepo
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If ports 3000 or 3001 are already in use, you can modify the ports in `docker-compose.yml` or set environment variables.

2. **Dependency Issues**: If you encounter dependency issues, try:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Docker Issues**: If you encounter Docker issues, ensure Docker is running and try:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Environment Variables

Ensure all required environment variables are set in your `.env` file:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

## Additional Resources

- [Frontend README](./apps/frontend/README.md)
- [Backend README](./apps/backend/README.md)
- [Static Website README](./apps/static-website/README.md)