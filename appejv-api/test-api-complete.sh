#!/bin/bash

API_URL="http://localhost:8081"

echo "🧪 Testing appejv-api with Supabase"
echo "===================================="
echo ""

# Test 1: Health check
echo "1️⃣ Health Check"
response=$(curl -s "$API_URL/health")
status=$(echo "$response" | jq -r '.status')
if [ "$status" = "ok" ]; then
    echo "   ✅ Health check passed"
    echo "$response" | jq '.'
else
    echo "   ❌ Health check failed"
fi
echo ""

# Test 2: Get all products
echo "2️⃣ Get All Products (limit 3)"
response=$(curl -s "$API_URL/api/v1/products?limit=3")
count=$(echo "$response" | jq '.data | length')
if [ "$count" -gt 0 ]; then
    echo "   ✅ Retrieved $count products"
    echo "$response" | jq '.data[] | {id, name, category, price}'
else
    echo "   ❌ No products found"
fi
echo ""

# Test 3: Filter by category
echo "3️⃣ Filter Products by Category (Coffee)"
response=$(curl -s "$API_URL/api/v1/products?category=Coffee&limit=2")
count=$(echo "$response" | jq '.data | length')
if [ "$count" -gt 0 ]; then
    echo "   ✅ Found $count coffee products"
    echo "$response" | jq '.data[] | {id, name, category, price}'
else
    echo "   ❌ No coffee products found"
fi
echo ""

# Test 4: Search products
echo "4️⃣ Search Products (search=tea)"
response=$(curl -s "$API_URL/api/v1/products?search=tea")
count=$(echo "$response" | jq '.data | length')
if [ "$count" -gt 0 ]; then
    echo "   ✅ Found $count products matching 'tea'"
    echo "$response" | jq '.data[] | {id, name, category}'
else
    echo "   ❌ No products found"
fi
echo ""

# Test 5: Get single product
echo "5️⃣ Get Single Product (ID: 112)"
response=$(curl -s "$API_URL/api/v1/products/112")
name=$(echo "$response" | jq -r '.data.name')
if [ "$name" != "null" ] && [ -n "$name" ]; then
    echo "   ✅ Product found: $name"
    echo "$response" | jq '.data | {id, name, category, price, stock}'
else
    echo "   ❌ Product not found"
fi
echo ""

# Test 6: Pagination
echo "6️⃣ Test Pagination (page 2, limit 5)"
response=$(curl -s "$API_URL/api/v1/products?page=2&limit=5")
page=$(echo "$response" | jq -r '.pagination.page')
limit=$(echo "$response" | jq -r '.pagination.limit')
if [ "$page" = "2" ] && [ "$limit" = "5" ]; then
    echo "   ✅ Pagination working correctly"
    echo "$response" | jq '.pagination'
else
    echo "   ❌ Pagination not working"
fi
echo ""

# Test 7: CORS headers
echo "7️⃣ Test CORS Headers"
headers=$(curl -s -I -X OPTIONS "$API_URL/api/v1/products" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET")
if echo "$headers" | grep -q "Access-Control-Allow-Origin"; then
    echo "   ✅ CORS headers present"
else
    echo "   ❌ CORS headers missing"
fi
echo ""

echo "===================================="
echo "✨ API testing completed!"
echo ""
echo "📊 Summary:"
echo "   API URL: $API_URL"
echo "   Database: Supabase"
echo "   Status: Running"
