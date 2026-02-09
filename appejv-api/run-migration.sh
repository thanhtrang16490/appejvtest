#!/bin/bash

# Script to run Supabase migration
# Usage: ./run-migration.sh <migration-file>

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

MIGRATION_FILE=${1:-"migrations/fix_profiles_rls_recursion.sql"}

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo "🔄 Running migration: $MIGRATION_FILE"
echo "📊 Supabase URL: $SUPABASE_URL"
echo ""

# Read the SQL file
SQL_CONTENT=$(cat "$MIGRATION_FILE")

# Execute via Supabase REST API (requires service role key)
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}"

echo ""
echo "✅ Migration completed!"
echo ""
echo "⚠️  Note: If you see an error, please run this SQL manually in Supabase Dashboard > SQL Editor"
