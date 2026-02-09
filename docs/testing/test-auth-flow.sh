#!/bin/bash

echo "🔐 Testing Authentication & Authorization Flow"
echo "=============================================="
echo ""

API_URL="http://localhost:8081"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health check
echo "1️⃣ Health Check"
health=$(curl -s "$API_URL/health")
auth_status=$(echo "$health" | jq -r '.auth')
if [ "$auth_status" = "enabled" ]; then
    echo -e "   ${GREEN}✅ Auth is enabled${NC}"
    echo "$health" | jq '.'
else
    echo -e "   ${RED}❌ Auth not enabled${NC}"
fi
echo ""

# Test 2: Public endpoint (no auth)
echo "2️⃣ Public Endpoint - GET /products (no auth)"
response=$(curl -s "$API_URL/api/v1/products?limit=2")
count=$(echo "$response" | jq '.data | length' 2>/dev/null)
if [ "$count" -gt 0 ]; then
    echo -e "   ${GREEN}✅ Public endpoint works without auth${NC}"
    echo "   Retrieved $count products"
else
    echo -e "   ${RED}❌ Public endpoint failed${NC}"
fi
echo ""

# Test 3: Protected endpoint without token
echo "3️⃣ Protected Endpoint - GET /customers (no auth)"
response=$(curl -s "$API_URL/api/v1/customers")
error=$(echo "$response" | jq -r '.error' 2>/dev/null)
if [ "$error" != "null" ] && [ -n "$error" ]; then
    echo -e "   ${GREEN}✅ Correctly rejected (no token)${NC}"
    echo "   Error: $error"
else
    echo -e "   ${RED}❌ Should have been rejected${NC}"
fi
echo ""

# Test 4: Get token from Supabase (manual step)
echo "4️⃣ Getting JWT Token"
echo -e "   ${YELLOW}⚠️  Manual step required:${NC}"
echo "   1. Login to http://localhost:3000/auth/login"
echo "   2. Open browser DevTools → Application → Cookies"
echo "   3. Find 'sb-*-auth-token' cookie"
echo "   4. Copy the access_token value"
echo "   5. Set TOKEN variable:"
echo ""
echo "   export TOKEN='your-jwt-token-here'"
echo ""

# Check if TOKEN is set
if [ -z "$TOKEN" ]; then
    echo -e "   ${YELLOW}⚠️  TOKEN not set. Skipping authenticated tests.${NC}"
    echo "   Run: export TOKEN='your-token' and run this script again"
    echo ""
    exit 0
fi

echo -e "   ${GREEN}✅ TOKEN is set${NC}"
echo "   Token: ${TOKEN:0:20}..."
echo ""

# Test 5: Protected endpoint with token
echo "5️⃣ Protected Endpoint - GET /profile (with token)"
response=$(curl -s "$API_URL/api/v1/profile" \
    -H "Authorization: Bearer $TOKEN")
error=$(echo "$response" | jq -r '.error' 2>/dev/null)
if [ "$error" = "null" ] || [ -z "$error" ]; then
    echo -e "   ${GREEN}✅ Successfully authenticated${NC}"
    echo "$response" | jq '.data'
else
    echo -e "   ${RED}❌ Authentication failed${NC}"
    echo "   Error: $error"
fi
echo ""

# Test 6: Sales endpoint with token
echo "6️⃣ Sales Endpoint - GET /customers (with token)"
response=$(curl -s "$API_URL/api/v1/customers" \
    -H "Authorization: Bearer $TOKEN")
error=$(echo "$response" | jq -r '.error' 2>/dev/null)
role=$(echo "$response" | jq -r '.user_role' 2>/dev/null)

if [ "$error" = "null" ] || [ -z "$error" ]; then
    echo -e "   ${GREEN}✅ Access granted${NC}"
    echo "$response" | jq '.'
elif [ "$error" = "Insufficient permissions" ]; then
    echo -e "   ${YELLOW}⚠️  Insufficient permissions (role: $role)${NC}"
    echo "   This is correct if you're not a sales user"
else
    echo -e "   ${RED}❌ Unexpected error${NC}"
    echo "   Error: $error"
fi
echo ""

# Test 7: Admin endpoint with token
echo "7️⃣ Admin Endpoint - POST /products (with token)"
response=$(curl -s -X POST "$API_URL/api/v1/products" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Product"}')
error=$(echo "$response" | jq -r '.error' 2>/dev/null)

if [ "$error" = "null" ] || [ -z "$error" ]; then
    echo -e "   ${GREEN}✅ Access granted (admin user)${NC}"
    echo "$response" | jq '.'
elif [ "$error" = "Insufficient permissions" ]; then
    echo -e "   ${YELLOW}⚠️  Insufficient permissions${NC}"
    echo "   This is correct if you're not an admin"
else
    echo -e "   ${RED}❌ Unexpected error${NC}"
    echo "   Error: $error"
fi
echo ""

echo "=============================================="
echo "✨ Auth flow test completed!"
echo ""
echo "Summary:"
echo "  • Public endpoints: No auth required"
echo "  • Protected endpoints: JWT token required"
echo "  • Role-based access: Enforced by API"
echo ""
echo "Next steps:"
echo "  1. Test with different user roles"
echo "  2. Test token expiration"
echo "  3. Test refresh token flow"
