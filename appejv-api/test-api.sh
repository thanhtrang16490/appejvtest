#!/bin/bash

# APPE JV API Test Script
# Usage: ./test-api.sh

BASE_URL="http://localhost:8080/api/v1"

echo "🧪 Testing APPE JV API"
echo "====================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
curl -s http://localhost:8080/health | jq
echo ""

# Test 2: Get Products (Public)
echo "2️⃣  Testing Get Products (Public)..."
curl -s "$BASE_URL/products?page=1&limit=5" | jq
echo ""

# Test 3: Login
echo "3️⃣  Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sale@demo.com",
    "password": "demo123"
  }')

echo $LOGIN_RESPONSE | jq
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.access_token')
echo ""

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Cannot continue tests."
  exit 1
fi

echo "✅ Login successful. Token: ${TOKEN:0:20}..."
echo ""

# Test 4: Get Current User
echo "4️⃣  Testing Get Current User..."
curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Test 5: Get Customers (Authenticated)
echo "5️⃣  Testing Get Customers (Authenticated)..."
curl -s "$BASE_URL/customers?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Test 6: Get Orders (Authenticated)
echo "6️⃣  Testing Get Orders (Authenticated)..."
curl -s "$BASE_URL/orders?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Test 7: Get Inventory
echo "7️⃣  Testing Get Inventory..."
curl -s "$BASE_URL/inventory" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo ""

# Test 8: Get Low Stock
echo "8️⃣  Testing Get Low Stock..."
curl -s "$BASE_URL/inventory/low-stock?threshold=20" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Test 9: Get Sales Report
echo "9️⃣  Testing Get Sales Report..."
curl -s "$BASE_URL/reports/sales" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Test 10: Rate Limit Test
echo "🔟 Testing Rate Limit (sending 5 rapid requests)..."
for i in {1..5}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/products")
  echo "Request $i: HTTP $STATUS"
done
echo ""

echo "✅ All tests completed!"
