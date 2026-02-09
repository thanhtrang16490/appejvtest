#!/bin/bash

# Test Production API
# This script tests the appejv-api on production

API_URL="https://api.appejv.app"
API_V1="${API_URL}/api/v1"

echo "🧪 Testing Production API: ${API_URL}"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    local method=${4:-GET}
    local data=${5:-}
    
    echo -n "Testing ${name}... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${url}")
    else
        response=$(curl -s -w "\n%{http_code}" -X ${method} -H "Content-Type: application/json" -d "${data}" "${url}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP ${http_code})"
        PASSED=$((PASSED + 1))
        if [ ! -z "$body" ]; then
            echo "   Response: ${body}" | head -c 200
            echo ""
        fi
    else
        echo -e "${RED}✗ FAILED${NC} (Expected ${expected_status}, got ${http_code})"
        FAILED=$((FAILED + 1))
        if [ ! -z "$body" ]; then
            echo "   Response: ${body}"
        fi
    fi
    echo ""
}

# 1. Test Health Check
echo "📊 1. Health Check"
echo "-------------------"
test_endpoint "Health endpoint" "${API_URL}/health" 200
sleep 1

# 2. Test Products API (Public)
echo "📦 2. Products API (Public)"
echo "----------------------------"
test_endpoint "Get all products" "${API_V1}/products" 200
test_endpoint "Get products with pagination" "${API_V1}/products?page=1&limit=5" 200
sleep 1

# 3. Test Customers API (Requires Auth)
echo "👥 3. Customers API (Protected)"
echo "--------------------------------"
test_endpoint "Get customers (no auth)" "${API_V1}/customers" 401
sleep 1

# 4. Test Orders API (Requires Auth)
echo "📋 4. Orders API (Protected)"
echo "-----------------------------"
test_endpoint "Get orders (no auth)" "${API_V1}/orders" 401
sleep 1

# 5. Test Password Reset API
echo "🔐 5. Password Reset API"
echo "-------------------------"
test_endpoint "Request password reset (invalid email)" "${API_V1}/password-reset/request" 400 POST '{"email":"invalid"}'
sleep 1

# 6. Test Profile API (Requires Auth)
echo "👤 6. Profile API (Protected)"
echo "------------------------------"
test_endpoint "Get profile (no auth)" "${API_V1}/profile" 401
sleep 1

# 7. Test CORS
echo "🌐 7. CORS Configuration"
echo "-------------------------"
echo -n "Testing CORS headers... "
cors_response=$(curl -s -I -X OPTIONS \
    -H "Origin: https://app.appejv.app" \
    -H "Access-Control-Request-Method: GET" \
    "${API_V1}/products")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PASSED=$((PASSED + 1))
    echo "$cors_response" | grep "Access-Control"
else
    echo -e "${RED}✗ FAILED${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Summary
echo "================================================"
echo "📊 Test Summary"
echo "================================================"
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
    exit 1
fi
