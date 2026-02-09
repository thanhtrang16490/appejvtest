#!/bin/bash

echo "🧪 Testing Fiber API + Next.js App Integration"
echo "=============================================="
echo ""

API_URL="http://localhost:8081"
APP_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Check API Server
echo "1️⃣ Checking Fiber API Server"
api_health=$(curl -s "$API_URL/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    framework=$(echo "$api_health" | jq -r '.framework')
    auth=$(echo "$api_health" | jq -r '.auth')
    if [ "$framework" = "fiber" ] && [ "$auth" = "jwt" ]; then
        echo -e "   ${GREEN}✅ Fiber API is running${NC}"
        echo "   Framework: $framework"
        echo "   Auth: $auth"
    else
        echo -e "   ${RED}❌ API not properly configured${NC}"
    fi
else
    echo -e "   ${RED}❌ API Server not responding${NC}"
    echo "   Please start: cd appejv-api && PORT=8081 go run cmd/server/main-fiber.go"
fi
echo ""

# Test 2: Check Next.js App
echo "2️⃣ Checking Next.js App"
app_response=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null)
if [ "$app_response" = "200" ] || [ "$app_response" = "307" ]; then
    echo -e "   ${GREEN}✅ Next.js App is running${NC}"
    echo "   URL: $APP_URL"
else
    echo -e "   ${RED}❌ Next.js App not responding (HTTP $app_response)${NC}"
    echo "   Please start: cd appejv-app && npm run dev"
fi
echo ""

# Test 3: Public API Endpoint
echo "3️⃣ Testing Public API Endpoint"
products=$(curl -s "$API_URL/api/v1/products?limit=2" 2>/dev/null)
if [ $? -eq 0 ]; then
    count=$(echo "$products" | jq '.data | length' 2>/dev/null)
    if [ "$count" -gt 0 ]; then
        echo -e "   ${GREEN}✅ Public endpoint working${NC}"
        echo "   Retrieved $count products"
        echo "$products" | jq -r '.data[] | "      - \(.name) (\(.category))"' 2>/dev/null
    else
        echo -e "   ${YELLOW}⚠️  No products found${NC}"
    fi
else
    echo -e "   ${RED}❌ Public endpoint failed${NC}"
fi
echo ""

# Test 4: Protected Endpoint (should fail without token)
echo "4️⃣ Testing Protected Endpoint (no token)"
response=$(curl -s "$API_URL/api/v1/profile" 2>/dev/null)
error=$(echo "$response" | jq -r '.error' 2>/dev/null)
if [ "$error" = "Authorization header required" ]; then
    echo -e "   ${GREEN}✅ Correctly rejected (no token)${NC}"
    echo "   Error: $error"
else
    echo -e "   ${RED}❌ Should have been rejected${NC}"
fi
echo ""

# Test 5: CORS Check
echo "5️⃣ Testing CORS Configuration"
cors=$(curl -s -I -X OPTIONS "$API_URL/api/v1/products" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" 2>/dev/null)
if echo "$cors" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "   ${GREEN}✅ CORS headers configured${NC}"
    echo "   App can communicate with API"
else
    echo -e "   ${RED}❌ CORS headers missing${NC}"
fi
echo ""

# Test 6: Check App Pages
echo "6️⃣ Testing App Pages"
pages=("/" "/auth/login" "/auth/customer-login")
for page in "${pages[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL$page" 2>/dev/null)
    if [ "$response" = "200" ] || [ "$response" = "307" ]; then
        echo -e "   ${GREEN}✅${NC} $page (HTTP $response)"
    else
        echo -e "   ${RED}❌${NC} $page (HTTP $response)"
    fi
done
echo ""

# Test 7: Manual Token Test Instructions
echo "7️⃣ Testing with JWT Token"
echo -e "   ${BLUE}📝 Manual steps required:${NC}"
echo ""
echo "   Step 1: Login to get token"
echo "   -------------------------"
echo "   1. Open: $APP_URL/auth/login"
echo "   2. Login with credentials"
echo "   3. Open DevTools → Application → Cookies"
echo "   4. Find 'sb-*-auth-token' cookie"
echo "   5. Copy the 'access_token' value"
echo ""
echo "   Step 2: Test with token"
echo "   ----------------------"
echo "   export TOKEN='your-access-token-here'"
echo "   curl $API_URL/api/v1/profile \\"
echo "     -H \"Authorization: Bearer \$TOKEN\" | jq ."
echo ""
echo "   Expected: User profile data"
echo ""

# Test 8: Check if TOKEN is set
if [ -n "$TOKEN" ]; then
    echo "8️⃣ Testing with Provided Token"
    echo -e "   ${GREEN}✅ TOKEN is set${NC}"
    echo "   Token: ${TOKEN:0:20}..."
    echo ""
    
    # Test profile endpoint
    echo "   Testing /profile endpoint..."
    profile=$(curl -s "$API_URL/api/v1/profile" \
        -H "Authorization: Bearer $TOKEN")
    error=$(echo "$profile" | jq -r '.error' 2>/dev/null)
    
    if [ "$error" = "null" ] || [ -z "$error" ]; then
        echo -e "   ${GREEN}✅ Authentication successful${NC}"
        echo "$profile" | jq '.data'
    else
        echo -e "   ${RED}❌ Authentication failed${NC}"
        echo "   Error: $error"
    fi
    echo ""
    
    # Test sales endpoint
    echo "   Testing /customers endpoint..."
    customers=$(curl -s "$API_URL/api/v1/customers" \
        -H "Authorization: Bearer $TOKEN")
    error=$(echo "$customers" | jq -r '.error' 2>/dev/null)
    
    if [ "$error" = "null" ] || [ -z "$error" ]; then
        echo -e "   ${GREEN}✅ Sales endpoint accessible${NC}"
    elif [ "$error" = "Insufficient permissions" ]; then
        echo -e "   ${YELLOW}⚠️  Insufficient permissions${NC}"
        echo "   This is correct if you're not a sales user"
    else
        echo -e "   ${RED}❌ Unexpected error${NC}"
        echo "   Error: $error"
    fi
else
    echo "8️⃣ Token Test Skipped"
    echo -e "   ${YELLOW}⚠️  TOKEN not set${NC}"
    echo "   Set TOKEN variable to test authenticated endpoints"
fi
echo ""

# Summary
echo "=============================================="
echo "📊 Integration Test Summary"
echo "=============================================="
echo ""
echo "Services Status:"
api_status=$(curl -s "$API_URL/health" &>/dev/null && echo -e "${GREEN}Running${NC}" || echo -e "${RED}Stopped${NC}")
app_status=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null | grep -q "200\|307" && echo -e "${GREEN}Running${NC}" || echo -e "${RED}Stopped${NC}")
echo -e "  • Fiber API (8081): $api_status"
echo -e "  • Next.js App (3000): $app_status"
echo ""
echo "Architecture:"
echo "  • Backend: Go Fiber v2 (stateless)"
echo "  • Auth: JWT-based"
echo "  • Authorization: Role-based"
echo "  • Database: Supabase"
echo ""
echo "API Endpoints:"
echo "  • Public: GET /products"
echo "  • Protected: GET /profile (auth required)"
echo "  • Sales: GET /customers (role: sale, admin)"
echo "  • Admin: POST /products (role: admin)"
echo ""
echo "Client Integration:"
echo "  • Token helper: lib/auth/token.ts"
echo "  • API client: lib/api/*.ts"
echo "  • Auto token injection: ✅"
echo ""
echo "✨ Integration test completed!"
echo ""
echo "Next steps:"
echo "  1. Login to app: $APP_URL/auth/login"
echo "  2. Get JWT token from cookies"
echo "  3. Test with: export TOKEN='...' && ./test-fiber-app-integration.sh"
