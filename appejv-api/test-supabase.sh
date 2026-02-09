#!/bin/bash

echo "🧪 Testing Supabase Connection for appejv-api"
echo "=============================================="
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "📋 Configuration:"
echo "  SUPABASE_URL: $SUPABASE_URL"
echo "  ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
echo ""

# Test 1: Check Supabase REST API
echo "1️⃣ Testing Supabase REST API..."
response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/")

if [ "$response" = "200" ]; then
    echo "   ✅ REST API connection successful (HTTP $response)"
else
    echo "   ❌ REST API connection failed (HTTP $response)"
fi
echo ""

# Test 2: List tables
echo "2️⃣ Checking available tables..."
tables=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/" | jq -r 'keys[]' 2>/dev/null)

if [ -n "$tables" ]; then
    echo "   ✅ Found tables:"
    echo "$tables" | while read table; do
        echo "      - $table"
    done
else
    echo "   ⚠️  No tables found or unable to list"
fi
echo ""

# Test 3: Check products table
echo "3️⃣ Testing products table..."
products=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/products?select=count" \
  -H "Prefer: count=exact")

if echo "$products" | grep -q "count"; then
    count=$(echo "$products" | jq -r '.[0].count' 2>/dev/null || echo "0")
    echo "   ✅ Products table accessible (count: $count)"
else
    echo "   ❌ Products table not accessible"
    echo "   Response: $products"
fi
echo ""

# Test 4: Check customers table
echo "4️⃣ Testing customers table..."
customers=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/customers?select=count" \
  -H "Prefer: count=exact")

if echo "$customers" | grep -q "count"; then
    count=$(echo "$customers" | jq -r '.[0].count' 2>/dev/null || echo "0")
    echo "   ✅ Customers table accessible (count: $count)"
else
    echo "   ❌ Customers table not accessible"
    echo "   Response: $customers"
fi
echo ""

# Test 5: Check orders table
echo "5️⃣ Testing orders table..."
orders=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/orders?select=count" \
  -H "Prefer: count=exact")

if echo "$orders" | grep -q "count"; then
    count=$(echo "$orders" | jq -r '.[0].count' 2>/dev/null || echo "0")
    echo "   ✅ Orders table accessible (count: $count)"
else
    echo "   ❌ Orders table not accessible"
    echo "   Response: $orders"
fi
echo ""

echo "=============================================="
echo "✨ Supabase connection test completed!"
