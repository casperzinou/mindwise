#!/bin/bash
# Mindwise Migration Script
# This script helps migrate from the old Python Flask version to the new enhanced Node.js version

echo "=== Mindwise Migration Script ==="
echo "This script will help you migrate from the old Python Flask version to the new enhanced Node.js version"
echo ""

# Check if we're in the right directory
if [ ! -d "mindwise-backend" ] || [ ! -d "mindwise-frontend" ]; then
  echo "Error: This script must be run from the root directory containing mindwise-backend and mindwise-frontend folders"
  exit 1
fi

echo "Found project directories:"
echo "- mindwise-backend"
echo "- mindwise-frontend"
echo ""

# Backup the old project
echo "Creating backup of the old project..."
cp -r mindwise-backend mindwise-backend-backup
cp -r mindwise-frontend mindwise-frontend-backup
echo "✓ Backup created successfully"
echo ""

# Show what will be replaced
echo "The following will be replaced:"
echo "- mindwise-backend (Python Flask → Node.js/TypeScript)"
echo "- mindwise-frontend (Simple HTML → Next.js/Tailwind CSS)"
echo ""

# Confirm migration
read -p "Do you want to proceed with the migration? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Migration cancelled"
  exit 0
fi

# Perform migration
echo "Starting migration..."

# Replace backend
echo "Replacing backend..."
rm -rf mindwise-backend
cp -r ../botsonic-clone-enhanced/mindwise-backend .
echo "✓ Backend replaced successfully"

# Replace frontend
echo "Replacing frontend..."
rm -rf mindwise-frontend
cp -r ../botsonic-clone-enhanced/mindwise-frontend .
echo "✓ Frontend replaced successfully"

# Show next steps
echo ""
echo "=== Migration Complete ==="
echo ""
echo "Next steps:"
echo "1. Update environment variables in both frontend and backend"
echo "2. Run 'npm install' in both directories"
echo "3. Build both projects with 'npm run build'"
echo "4. Start both servers:"
echo "   - Backend: cd mindwise-backend && npm run dev"
echo "   - Frontend: cd mindwise-frontend && npm run dev"
echo ""
echo "Note: Make sure to update your Supabase configuration and API keys in the .env files"
echo ""