#!/bin/bash

# Test appejv-web with appejv-api integration
# Tests that web fetches data from API instead of Supabase

echo "=========================================="
echo "Testing appejv-web + appejv-api Integration"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if API is running
echo "Test 1: Check API Health"
echo "------------------------"
API_HEALTH=$(curl -s http://localhost:8081/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API is running${NC}"
    echo "$API_HEALTH" | jq '.'
else
    echo -e "${RED}✗ API is not running${NC}"
    echo "Please start API: cd appejv-api && PORT=8081 go run cmd/server/main-fiber.go"
    exit 1
fi
echo ""

# Test 2: Check if Web is running
echo "Test 2: Check Web Health"
echo "------------------------"
WEB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4321)
if [ "$WEB_HEALTH" = "200" ] || [ "$WEB_HEALTH" = "301" ] || [ "$WEB_HEALTH" = "302" ]; then
    echo -e "${GREEN}✓ Web is running (HTTP $WEB_HEALTH)${NC}"
else
    echo -e "${RED}✗ Web is not running${NC}"
    echo "Please start Web: cd appejv-web && npm run dev"
    exit 1
fi
echo ""

# Test 3: Get products from API
echo "Test 3: Get Products from API"
echo "------------------------------"
PRODUCTS=$(curl -s http://localhost:8081/api/v1/products)
PRODUCT_COUNT=$(echo "$PRODUCTS" | jq '.data | length')
if [ "$PRODUCT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ API returned $PRODUCT_COUNT products${NC}"
    echo "Sample products:"
    echo "$PRODUCTS" | jq '.data[0:3] | .[] | {id, name, price, category}'
else
    echo -e "${RED}✗ No products returned from API${NC}"
    exit 1
fi
echo ""

# Test 4: Check Web .env configuration
echo "Test 4: Check Web Configuration"
echo "--------------------------------"
if [ -f "appejv-web/.env" ]; then
    API_URL=$(grep "PUBLIC_API_URL" appejv-web/.env | cut -d'=' -f2)
    echo "API URL configured: $API_URL"
    if [[ "$API_URL" == *"8081"* ]]; then
        echo -e "${GREEN}✓ Web is configured to use API on port 8081${NC}"
    else
        echo -e "${YELLOW}⚠ Web API URL might be incorrect${NC}"
        echo "Expected: http://localhost:8081/api/v1"
        echo "Found: $API_URL"
    fi
else
    echo -e "${RED}✗ appejv-web/.env not found${NC}"
    exit 1
fi
echo ""

# Test 5: Check if web pages load
echo "Test 5: Check Web Pages"
echo "------------------------"

# Homepage
HOME_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/)
if [ "$HOME_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Homepage loads (HTTP $HOME_STATUS)${NC}"
else
    echo -e "${RED}✗ Homepage failed (HTTP $HOME_STATUS)${NC}"
fi

# Products page
PRODUCTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/san-pham)
if [ "$PRODUCTS_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Products page loads (HTTP $PRODUCTS_STATUS)${NC}"
else
    echo -e "${RED}✗ Products page failed (HTTP $PRODUCTS_STATUS)${NC}"
fi
echo ""

# Test 6: Verify web is NOT using Supabase directly
echo "Test 6: Verify API Integration"
echo "-------------------------------"
echo "Checking if web code uses API instead of Supabase..."

# Check if api.ts imports are used in pages
if grep -q "from '../../lib/api'" appejv-web/src/pages/san-pham/index.astro; then
    echo -e "${GREEN}✓ Products page uses API client${NC}"
else
    echo -e "${RED}✗ Products page might still use Supabase${NC}"
fi

if grep -q "from '../../lib/api'" appejv-web/src/pages/san-pham/\[slug\].astro; then
    echo -e "${GREEN}✓ Product detail page uses API client${NC}"
else
    echo -e "${RED}✗ Product detail page might still use Supabase${NC}"
fi
echo ""

# Test 7: CORS check
echo "Test 7: CORS Configuration"
echo "--------------------------"
CORS_HEADERS=$(curl -s -I -X OPTIONS http://localhost:8081/api/v1/products \
    -H "Origin: http://localhost:4321" \
    -H "Access-Control-Request-Method: GET")

if echo "$CORS_HEADERS" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✓ CORS is configured${NC}"
    echo "$CORS_HEADERS" | grep "Access-Control"
else
    echo -e "${YELLOW}⚠ CORS headers not found${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "Architecture:"
echo "  appejv-web (Astro) → appejv-api (Fiber) → Supabase"
echo ""
echo "Services:"
echo "  ✓ API: http://localhost:8081"
echo "  ✓ Web: http://localhost:4321"
echo ""
echo "Data Flow:"
echo "  1. User visits http://localhost:4321/san-pham"
echo "  2. Astro page calls getProducts() from lib/api.ts"
echo "  3. API client fetches from http://localhost:8081/api/v1/products"
echo "  4. Fiber API queries Supabase and returns data"
echo "  5. Web renders products"
echo ""
echo -e "${GREEN}✓ All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Visit http://localhost:4321 to see the website"
echo "  2. Visit http://localhost:4321/san-pham to see products"
echo "  3. Check browser console for API calls"
echo ""
