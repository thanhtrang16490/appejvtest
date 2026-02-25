#!/bin/bash

# Check audit_logs table and view structure

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

echo "🔍 Checking audit_logs structure..."
echo ""

# Check if audit_logs table exists
echo "📋 Checking if audit_logs table exists:"
psql "$SUPABASE_DB_URL" -c "
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'audit_logs'
  );
"

echo ""
echo "📊 Audit logs table structure:"
psql "$SUPABASE_DB_URL" -c "
  SELECT 
    column_name, 
    data_type, 
    is_nullable
  FROM information_schema.columns
  WHERE table_schema = 'public' 
  AND table_name = 'audit_logs'
  ORDER BY ordinal_position;
"

echo ""
echo "👁️ Checking recent_audit_logs view:"
psql "$SUPABASE_DB_URL" -c "
  SELECT 
    viewname,
    definition
  FROM pg_views 
  WHERE schemaname = 'public'
  AND viewname = 'recent_audit_logs';
"

echo ""
echo "✅ Structure check complete!"
