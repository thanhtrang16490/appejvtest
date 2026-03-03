#!/bin/bash

# Script to fix orders.customer_id foreign key constraint
# This changes the FK from profiles to customers table

set -e

echo "🚀 Running orders customer_id foreign key fix..."

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

echo "📝 Checking current foreign key constraints..."
psql "$SUPABASE_DB_URL" -c "SELECT conname, confrelid::regclass AS referenced_table FROM pg_constraint WHERE conrelid = 'orders'::regclass AND contype = 'f' AND conname LIKE '%customer%';"

echo ""
echo "📝 Applying migration 21_fix_orders_customer_fk.sql..."

psql "$SUPABASE_DB_URL" -f migrations/21_fix_orders_customer_fk.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo ""
  echo "📋 Verifying new foreign key..."
  psql "$SUPABASE_DB_URL" -c "SELECT conname, confrelid::regclass AS referenced_table FROM pg_constraint WHERE conrelid = 'orders'::regclass AND contype = 'f' AND conname LIKE '%customer%';"
else
  echo "❌ Migration failed!"
  exit 1
fi
