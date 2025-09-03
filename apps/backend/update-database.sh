#!/bin/bash

# Database Update Script
# This script applies the database updates to improve performance

echo "Applying database updates..."

# Check if psql is available
if ! command -v psql &> /dev/null
then
    echo "psql could not be found. Please install PostgreSQL client tools."
    exit 1
fi

# Check if database connection parameters are set
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL environment variable is not set."
    echo "Please set it to your Supabase database URL."
    echo "Example: export DATABASE_URL=postgresql://user:password@host:port/database"
    exit 1
fi

# Apply the database updates
psql $DATABASE_URL -f database-updates.sql

if [ $? -eq 0 ]; then
    echo "Database updates applied successfully!"
else
    echo "Failed to apply database updates."
    exit 1
fi