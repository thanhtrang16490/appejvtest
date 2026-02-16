#!/bin/bash

# Load environment variables
source .env

echo "Querying all profiles..."

curl -X GET "${SUPABASE_URL}/rest/v1/profiles?select=*" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"

echo -e "\n"
