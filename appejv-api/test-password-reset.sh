#!/bin/bash

# Test Password Reset Flow
# Usage: ./test-password-reset.sh <email>

API_URL="https://api.appejv.app/api/v1"
EMAIL="${1:-admin@appejv.app}"

echo "🔐 Testing Password Reset Flow"
echo "================================"
echo ""

# Step 1: Request password reset
echo "📧 Step 1: Requesting password reset for $EMAIL..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}")

echo "Response: $RESPONSE"
echo ""

# Extract token (only available in dev mode)
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ No token returned. Check if email exists or if API is in production mode."
    echo "In production, check your email for the reset link."
    exit 1
fi

echo "✅ Token received: ${TOKEN:0:20}..."
echo ""

# Step 2: Verify token
echo "🔍 Step 2: Verifying reset token..."
VERIFY_RESPONSE=$(curl -s -X POST "$API_URL/auth/verify-reset-token" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\"}")

echo "Response: $VERIFY_RESPONSE"
echo ""

if echo "$VERIFY_RESPONSE" | grep -q '"valid":true'; then
    echo "✅ Token is valid"
else
    echo "❌ Token is invalid"
    exit 1
fi

echo ""

# Step 3: Reset password
NEW_PASSWORD="Admin123"
echo "🔑 Step 3: Resetting password to '$NEW_PASSWORD'..."
RESET_RESPONSE=$(curl -s -X POST "$API_URL/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$TOKEN\",\"password\":\"$NEW_PASSWORD\"}")

echo "Response: $RESET_RESPONSE"
echo ""

if echo "$RESET_RESPONSE" | grep -q '"message":"Mật khẩu đã được đặt lại thành công"'; then
    echo "✅ Password reset successful!"
    echo ""
    echo "🎉 You can now login with:"
    echo "   Email: $EMAIL"
    echo "   Password: $NEW_PASSWORD"
else
    echo "❌ Password reset failed"
    exit 1
fi

echo ""
echo "================================"
echo "✅ All tests passed!"
