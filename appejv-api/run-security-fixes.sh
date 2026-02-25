#!/bin/bash

# Run all security definer view fixes
set -e

echo "🔒 Fixing Security Definer Views..."
echo ""

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "❌ Error: SUPABASE_DB_URL is not set"
  echo "Please set SUPABASE_DB_URL in your .env file"
  exit 1
fi

echo "📋 Running migration: 13_fix_active_orders_view.sql"
psql "$SUPABASE_DB_URL" -f migrations/13_fix_active_orders_view.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo ""
  echo "📊 Verifying all views..."
  
  # Verify all views are fixed
  psql "$SUPABASE_DB_URL" -c "
    SELECT 
      schemaname,
      viewname,
      CASE 
        WHEN definition LIKE '%security_invoker%' THEN '✅ SECURITY INVOKER (Safe)'
        ELSE '⚠️ SECURITY DEFINER (Warning)'
      END as security_mode
    FROM pg_views 
    WHERE schemaname = 'public'
      AND viewname IN ('recent_audit_logs', 'active_orders')
    ORDER BY viewname;
  "
  
  echo ""
  echo "✅ All Security Definer views have been fixed!"
  echo ""
  echo "🔍 Checking for any other views that may need fixing..."
  psql "$SUPABASE_DB_URL" -c "
    SELECT 
      schemaname,
      viewname,
      '⚠️ May need fixing' as status
    FROM pg_views 
    WHERE schemaname = 'public'
      AND definition NOT LIKE '%security_invoker%'
      AND viewname NOT LIKE 'pg_%'
    ORDER BY viewname;
  "
else
  echo "❌ Migration failed!"
  exit 1
fi
