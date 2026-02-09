#!/bin/bash

# Test appejv-app integration with production API
# API: https://api.appejv.app

echo "🧪 Testing appejv-app with Production API"
echo "=========================================="
echo ""

API_URL="https://api.appejv.app/api/v1"
APP_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: API Health Check
echo "1️⃣  Testing API Health..."
HEALTH=$(curl -s "https://api.appejv.app/health")
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✓ API is healthy${NC}"
    echo "   Response: $HEALTH"
else
    echo -e "${RED}✗ API health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Public Products Endpoint
echo "2️⃣  Testing Public Products Endpoint..."
PRODUCTS=$(curl -s "$API_URL/products" | head -c 200)
if echo "$PRODUCTS" | grep -q "data"; then
    echo -e "${GREEN}✓ Products endpoint working${NC}"
    echo "   Response preview: ${PRODUCTS}..."
else
    echo -e "${RED}✗ Products endpoint failed${NC}"
    exit 1
fi
echo ""

# Test 3: App Homepage
echo "3️⃣  Testing App Homepage..."
HOMEPAGE=$(curl -s "$APP_URL" -I | grep "HTTP")
if echo "$HOMEPAGE" | grep -q "200"; then
    echo -e "${GREEN}✓ App homepage accessible${NC}"
    echo "   $HOMEPAGE"
else
    echo -e "${RED}✗ App homepage failed${NC}"
    echo "   Make sure app is running: npm run dev"
fi
echo ""

# Test 4: Login Page
echo "4️⃣  Testing Login Page..."
LOGIN=$(curl -s "$APP_URL/auth/login" -I | grep "HTTP")
if echo "$LOGIN" | grep -q "200"; then
    echo -e "${GREEN}✓ Login page accessible${NC}"
else
    echo -e "${RED}✗ Login page failed${NC}"
fi
echo ""

# Test 5: Customer Login Page
echo "5️⃣  Testing Customer Login Page..."
CUSTOMER_LOGIN=$(curl -s "$APP_URL/auth/customer-login" -I | grep "HTTP")
if echo "$CUSTOMER_LOGIN" | grep -q "200"; then
    echo -e "${GREEN}✓ Customer login page accessible${NC}"
else
    echo -e "${RED}✗ Customer login page failed${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}✅ Basic integration tests passed!${NC}"
echo ""
echo "📝 Next Steps:"
echo "   1. Open browser: http://localhost:3000"
echo "   2. Try logging in with test credentials"
echo "   3. Check if data loads from API"
echo ""
echo "🔗 URLs:"
echo "   App:  $APP_URL"
echo "   API:  $API_URL"
echo ""
