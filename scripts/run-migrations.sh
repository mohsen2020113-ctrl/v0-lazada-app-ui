#!/bin/bash

# 4LEEE Supabase Migration Quick Start Script
# This script helps run the SQL migrations

echo "================================"
echo "4LEEE Supabase SQL Migration Tool"
echo "================================"
echo ""

# Check if migration files exist
if [ ! -f "supabase/migrations/001_create_schema.sql" ]; then
  echo "❌ Error: Migration files not found"
  echo "Please ensure you're in the project root directory"
  exit 1
fi

echo "✅ Found migration files:"
echo "  - supabase/migrations/001_create_schema.sql"
echo "  - supabase/migrations/002_insert_initial_data.sql"
echo ""

echo "Choose how to run migrations:"
echo ""
echo "1) Copy-paste to Supabase Dashboard SQL Editor (Recommended)"
echo "   - Visit: https://supabase.com/dashboard"
echo "   - Click: SQL Editor → New Query"
echo "   - Paste content from migration files"
echo ""
echo "2) Run with psql (requires PostgreSQL client)"
echo "   - Get connection string from Supabase Dashboard"
echo "   - Run: psql [CONNECTION_STRING] -f supabase/migrations/001_create_schema.sql"
echo ""
echo "3) Run with Supabase CLI"
echo "   - Install: npm install -g supabase"
echo "   - Setup: supabase link --project-ref [PROJECT_REF]"
echo "   - Run: supabase db push"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "To run migrations via Supabase Dashboard:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Select your project"
    echo "3. Click 'SQL Editor' in the left sidebar"
    echo "4. Click 'New Query'"
    echo "5. Copy and paste the content of supabase/migrations/001_create_schema.sql"
    echo "6. Click 'Run' and wait for completion"
    echo "7. Repeat steps 4-6 for supabase/migrations/002_insert_initial_data.sql"
    echo ""
    echo "Then verify with:"
    echo "  SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='public';"
    ;;
  2)
    read -p "Enter your Supabase connection string: " connection_string
    if [ -z "$connection_string" ]; then
      echo "❌ No connection string provided"
      exit 1
    fi
    echo "Running schema migration..."
    psql "$connection_string" -f supabase/migrations/001_create_schema.sql
    if [ $? -eq 0 ]; then
      echo "✅ Schema migration completed"
      echo "Running data migration..."
      psql "$connection_string" -f supabase/migrations/002_insert_initial_data.sql
      if [ $? -eq 0 ]; then
        echo "✅ Data migration completed"
      fi
    fi
    ;;
  3)
    echo "Running Supabase migrations..."
    if command -v supabase &> /dev/null; then
      supabase db push
      echo "✅ Migrations completed"
    else
      echo "❌ Supabase CLI not installed"
      echo "Install with: npm install -g supabase"
    fi
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ Migration setup complete!"
echo ""
echo "Next steps:"
echo "1. Add Supabase environment variables to .env.local"
echo "2. Configure authentication in Supabase Dashboard"
echo "3. Test database connection from your app"
