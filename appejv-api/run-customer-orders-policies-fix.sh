#!/bin/bash

# Script to fix customer orders RLS policies
# This updates policies to work with the new customers table structure

set -e

echo "🚀 Running customer orders policies fix migration..."

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

echo "📝 Applying migration 20_fix_customer_orders_policies.sql..."

psql "$SUPABASE_DB_URL" -f migrations/20_fix_customer_orders_policies.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo ""
  echo "📋 Verifying customer order policies..."
  psql "$SUPABASE_DB_URL" -c "SELECT policyname, cmd FROM pg_policies WHERE tablename = 'orders' AND policyname LIKE 'customers_%' ORDER BY policyname;"
else
  echo "❌ Migration failed!"
  exit 1
fi
