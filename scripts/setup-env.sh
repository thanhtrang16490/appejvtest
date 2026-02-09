#!/bin/bash

# Environment Setup Helper Script
# Usage: ./scripts/setup-env.sh [local|production]

set -e

ENV=${1:-local}
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Environment Setup: $ENV"
echo "=========================================="
echo ""

if [ "$ENV" = "local" ]; then
    echo -e "${GREEN}Setting up LOCAL development environment${NC}"
    echo ""
    
    # API
    echo "📦 Setting up API..."
    if [ ! -f "appejv-api/.env" ]; then
        cp appejv-api/.env.example appejv-api/.env
        echo -e "${GREEN}✓ Created appejv-api/.env${NC}"
    else
        echo -e "${YELLOW}⚠ appejv-api/.env already exists${NC}"
    fi
    
    # App
    echo "📦 Setting up App..."
    if [ ! -f "appejv-app/.env.local" ]; then
        cp appejv-app/.env.local.example appejv-app/.env.local
        echo -e "${GREEN}✓ Created appejv-app/.env.local${NC}"
    else
        echo -e "${YELLOW}⚠ appejv-app/.env.local already exists${NC}"
    fi
    
    # Web
    echo "📦 Setting up Web..."
    if [ ! -f "appejv-web/.env" ]; then
        cp appejv-web/.env.example appejv-web/.env
        echo -e "${GREEN}✓ Created appejv-web/.env${NC}"
    else
        echo -e "${YELLOW}⚠ appejv-web/.env already exists${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Local environment setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env files with your Supabase credentials"
    echo "2. Run: npm install (in each project)"
    echo "3. Start services:"
    echo "   - API: cd appejv-api && PORT=8081 go run cmd/server/main-fiber.go"
    echo "   - App: cd appejv-app && npm run dev"
    echo "   - Web: cd appejv-web && npm run dev"
    
elif [ "$ENV" = "production" ]; then
    echo -e "${GREEN}Setting up PRODUCTION environment${NC}"
    echo ""
    
    # API
    echo "📦 Setting up API..."
    if [ ! -f "appejv-api/.env.production" ]; then
        cp appejv-api/.env.production.example appejv-api/.env.production
        echo -e "${GREEN}✓ Created appejv-api/.env.production${NC}"
    else
        echo -e "${YELLOW}⚠ appejv-api/.env.production already exists${NC}"
    fi
    
    # App
    echo "📦 Setting up App..."
    if [ ! -f "appejv-app/.env.production" ]; then
        cp appejv-app/.env.production.example appejv-app/.env.production
        echo -e "${GREEN}✓ Created appejv-app/.env.production${NC}"
    else
        echo -e "${YELLOW}⚠ appejv-app/.env.production already exists${NC}"
    fi
    
    # Web
    echo "📦 Setting up Web..."
    if [ ! -f "appejv-web/.env.production" ]; then
        cp appejv-web/.env.production.example appejv-web/.env.production
        echo -e "${GREEN}✓ Created appejv-web/.env.production${NC}"
    else
        echo -e "${YELLOW}⚠ appejv-web/.env.production already exists${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✓ Production environment setup complete!${NC}"
    echo ""
    echo -e "${RED}⚠ IMPORTANT:${NC}"
    echo "1. Edit .env.production files with PRODUCTION credentials"
    echo "2. Use STRONG JWT secrets (min 32 characters)"
    echo "3. Update domain URLs:"
    echo "   - API: https://api.appejv.app"
    echo "   - App: https://app.appejv.app"
    echo "   - Web: https://appejv.app"
    echo "4. Enable HTTPS and security features"
    echo "5. Configure monitoring and analytics"
    echo ""
    echo "Build commands:"
    echo "   - API: cd appejv-api && go build -o bin/api cmd/server/main-fiber.go"
    echo "   - App: cd appejv-app && npm run build"
    echo "   - Web: cd appejv-web && npm run build"
    
else
    echo -e "${RED}✗ Invalid environment: $ENV${NC}"
    echo "Usage: ./scripts/setup-env.sh [local|production]"
    exit 1
fi

echo ""
echo "=========================================="
echo "For more information, see:"
echo "  - docs/ENVIRONMENT-SETUP.md"
echo "  - docs/DEPLOYMENT.md"
echo "=========================================="
