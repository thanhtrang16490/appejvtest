#!/bin/bash

# Test Temporary Password Flow
# Usage: ./test-temp-password.sh <email>

API_URL="https://api.appejv.app/api/v1"
EMAIL="${1:-admin@appejv.app}"

echo "🔐 Testing Temporary Password Flow"
echo "===================================="
echo ""

# Request temporary password
echo "📧 Requesting temporary password for $EMAIL..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}")

echo "Response: $RESPONSE"
echo ""

# Extract temporary password (only available in dev mode)
TEMP_PASSWORD=$(echo $RESPONSE | grep -o '"temporary_password":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TEMP_PASSWORD" ]; then
    echo "❌ No temporary password returned."
    echo "In production, check your email for the temporary password."
    exit 1
fi

echo "✅ Temporary password generated: $TEMP_PASSWORD"
echo ""
echo "🎉 Success! You can now login with:"
echo "   Email: $EMAIL"
echo "   Password: $TEMP_PASSWORD"
echo ""
echo "⚠️  Remember to change your password after login!"
echo ""
echo "===================================="
echo "✅ Test completed!"
