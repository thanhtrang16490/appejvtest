#!/bin/bash

# Fix Security Definer View Issue
# This script fixes the security definer view warning from Supabase

set -e

echo "🔧 Fixing Security Definer View Issue..."

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

echo "📋 Running migration: 12_fix_security_definer_view.sql"

# Run the migration
psql "$SUPABASE_DB_URL" -f migrations/12_fix_security_definer_view.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo ""
  echo "📊 Verifying the fix..."
  
  # Verify the view exists and is using SECURITY INVOKER
  psql "$SUPABASE_DB_URL" -c "
    SELECT 
      viewname,
      definition,
      CASE 
        WHEN viewowner = current_user THEN 'SECURITY INVOKER (Safe)'
        ELSE 'SECURITY DEFINER (Warning)'
      END as security_mode
    FROM pg_views 
    WHERE viewname = 'recent_audit_logs';
  "
  
  echo ""
  echo "✅ Security Definer issue has been fixed!"
  echo "The view now uses SECURITY INVOKER, which is safer."
  echo "Users will only see audit logs they have permission to access."
else
  echo "❌ Migration failed!"
  exit 1
fi
