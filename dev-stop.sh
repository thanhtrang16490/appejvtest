#!/bin/bash

# APPE JV Development Environment Stopper
# This script stops both API and App

echo "🛑 Stopping APPE JV Development Environment..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Stop API (port 8080)
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Stopping API Server (port 8080)...${NC}"
    kill $(lsof -t -i:8080)
    echo "✓ API stopped"
else
    echo "API is not running"
fi

# Stop App (port 3000)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Stopping Next.js App (port 3000)...${NC}"
    kill $(lsof -t -i:3000)
    echo "✓ App stopped"
else
    echo "App is not running"
fi

echo ""
echo -e "${GREEN}✅ All services stopped${NC}"
echo ""
