#!/bin/bash

# APPE JV Development Environment Starter
# This script starts both API and App for local development

echo "🚀 Starting APPE JV Development Environment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if API is already running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  API is already running on port 8080${NC}"
else
    echo -e "${BLUE}📡 Starting API Server (Fiber)...${NC}"
    cd appejv-api
    go run cmd/server/main-fiber.go &
    API_PID=$!
    echo "API PID: $API_PID"
    cd ..
    sleep 2
fi

# Check if App is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  App is already running on port 3000${NC}"
else
    echo -e "${BLUE}🌐 Starting Next.js App...${NC}"
    cd appejv-app
    npm run dev &
    APP_PID=$!
    echo "App PID: $APP_PID"
    cd ..
    sleep 3
fi

echo ""
echo -e "${GREEN}✅ Development environment is ready!${NC}"
echo ""
echo "📍 Services:"
echo "   API:  http://localhost:8080"
echo "   App:  http://localhost:3000"
echo ""
echo "🔍 API Health: http://localhost:8080/health"
echo "📦 API Products: http://localhost:8080/api/v1/products"
echo ""
echo "💡 To stop all services, run: ./dev-stop.sh"
echo ""
