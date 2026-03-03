#!/bin/bash

# Script to run customer self-registration migration
# This allows customer users to create their own customer records

set -e

echo "🚀 Running customer self-registration migration..."

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if required env vars are set
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "❌ Error: SUPABASE_DB_URL not set"
  echo "Please set it in .env file or export it"
  exit 1
fi

echo "📝 Applying migration 19_allow_customer_self_registration.sql..."

psql "$SUPABASE_DB_URL" -f migrations/19_allow_customer_self_registration.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo ""
  echo "📋 Verifying policies..."
  psql "$SUPABASE_DB_URL" -c "SELECT policyname, cmd FROM pg_policies WHERE tablename = 'customers' ORDER BY policyname;"
else
  echo "❌ Migration failed!"
  exit 1
fi
