#!/bin/bash

# Script to switch between local and production API

MODE=$1

if [ -z "$MODE" ]; then
    echo "Usage: ./switch-api.sh [local|production]"
    echo ""
    echo "Examples:"
    echo "  ./switch-api.sh local       - Use local API (http://localhost:8080)"
    echo "  ./switch-api.sh production  - Use production API (https://api.appejv.app)"
    exit 1
fi

case $MODE in
    local)
        echo "🔄 Switching to LOCAL API..."
        cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# API Configuration - LOCAL DEVELOPMENT
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Production Mode
NEXT_PUBLIC_SKIP_AUTH=false
EOF
        echo "✅ Switched to LOCAL API: http://localhost:8080"
        echo "⚠️  Make sure local API is running!"
        echo "⚠️  Update SUPABASE keys in .env.local"
        ;;
        
    production)
        echo "🔄 Switching to PRODUCTION API..."
        cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# API Configuration - PRODUCTION API
NEXT_PUBLIC_API_URL=https://api.appejv.app/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# App URL (Local)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production Mode
NEXT_PUBLIC_SKIP_AUTH=false
EOF
        echo "✅ Switched to PRODUCTION API: https://api.appejv.app"
        echo "🌐 You can now test with live API!"
        echo "⚠️  Update SUPABASE keys in .env.local"
        ;;
        
    *)
        echo "❌ Invalid mode: $MODE"
        echo "Use 'local' or 'production'"
        exit 1
        ;;
esac

echo ""
echo "📝 Next steps:"
echo "1. Restart Next.js dev server (Ctrl+C and npm run dev)"
echo "2. Test the app at http://localhost:3000"
