# MindWise B2B SaaS Platform

The official repository for the MindWise B2B SaaS platform.

## Overview
MindWise is a customer-support automation platform that embeds an AI chatbot widget on any website.  
The backend is a Python/Flask API that handles user management, document ingestion, and AI-powered Q&A.

## Architecture
- **Backend**: Flask + SQLAlchemy + pgvector (PostgreSQL)  
- **AI**: Google Gemini (text generation + embeddings)  
- **Rate Limiting**: Flask-Limiter backed by **Redis** (with in-memory fallback)  
- **Deployment**: Fly.io (Docker container)  
- **Static Site**: Cloudflare Pages (https://mindwise.pages.dev)

## Environment Variables
| Variable            | Purpose |
|---------------------|---------|
| `SECRET_KEY`        | Flask session encryption |
| `DATABASE_URL`      | PostgreSQL connection string |
| `REDIS_URL`         | **Redis connection string for rate-limiting** (e.g., `redis://default:pwd@host:6379`) |
| `GEMINI_API_KEY`    | Google Generative AI key |
| `WORKER_URL`        | URL of the external worker service |
| `WORKER_AUTH_TOKEN` | Bearer token for worker authentication |

## Redis Integration
Rate-limiting is handled by **Flask-Limiter** and uses **Redis** when the `REDIS_URL` environment variable is provided.  
If `REDIS_URL` is missing, the app gracefully falls back to an in-memory store (not recommended for multi-instance deployments).

### Provisioning Redis on Fly.io
