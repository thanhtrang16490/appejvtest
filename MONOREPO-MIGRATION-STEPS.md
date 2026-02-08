# Monorepo Migration - Step by Step Instructions

## Current Status
You are in the `appejvtest` directory. This will become `appejv-app` in the monorepo.

---

## Phase 1: Create Monorepo Structure (Manual Steps)

### Step 1: Navigate to parent directory
```bash
cd ..
```

### Step 2: Create monorepo root
```bash
mkdir appejv
cd appejv
```

### Step 3: Move current project
```bash
mv ../appejvtest appejv-app
```

### Step 4: Initialize Git (if not already)
```bash
git init
```

### Step 5: Create root package.json
```bash
cat > package.json << 'EOF'
{
  "name": "appejv-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "appejv-web",
    "appejv-app"
  ],
  "scripts": {
    "dev:web": "cd appejv-web && npm run dev",
    "dev:app": "cd appejv-app && npm run dev",
    "dev:api": "cd appejv-api && go run cmd/server/main.go",
    "build:web": "cd appejv-web && npm run build",
    "build:app": "cd appejv-app && npm run build",
    "build:api": "cd appejv-api && go build -o bin/server cmd/server/main.go",
    "dev:all": "concurrently \"npm run dev:web\" \"npm run dev:app\" \"npm run dev:api\"",
    "lint": "npm run lint --workspaces",
    "test": "npm run test --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF
```

### Step 6: Create root .gitignore
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/

# Build outputs
.next/
dist/
build/
bin/

# Environment
.env
.env.local
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Mobile
appejv-ios/Pods/
appejv-ios/*.xcworkspace
appejv-android/.gradle/
appejv-android/local.properties

# Testing
coverage/
.nyc_output/

# Misc
*.pem
EOF
```

### Step 7: Create root README.md
```bash
cat > README.md << 'EOF'
# APPE JV Monorepo

Multi-platform sales management system for APPE JV Vietnam.

## Projects

- **appejv-web**: Public website (Astro)
- **appejv-app**: Sales management web app (Next.js)
- **appejv-api**: Backend API (Go)
- **appejv-ios**: iOS mobile app (Swift)
- **appejv-android**: Android mobile app (Kotlin)

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run all projects
npm run dev:all

# Or run individually
npm run dev:web    # Public website
npm run dev:app    # Sales app
npm run dev:api    # API server
\`\`\`

## Documentation

See [MONOREPO-SETUP.md](./MONOREPO-SETUP.md) for detailed setup instructions.
EOF
```

### Step 8: Create .env.example
```bash
cat > .env.example << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# API Configuration
API_URL=http://localhost:8080
API_VERSION=v1

# App URLs
WEB_URL=https://appejv.app
APP_URL=https://app.appejv.app
API_URL_PROD=https://api.appejv.app

# Brand Configuration
BRAND_PRIMARY_COLOR=#175ead
BRAND_SECONDARY_COLOR=#2575be
EOF
```

### Step 9: Install root dependencies
```bash
npm install
```

---

## Phase 2: Create appejv-web (Astro)

### Step 1: Create Astro project
```bash
npm create astro@latest appejv-web -- --template minimal --install --git --typescript strict
```

### Step 2: Navigate to appejv-web
```bash
cd appejv-web
```

### Step 3: Install additional dependencies
```bash
npm install @astrojs/tailwind tailwindcss
```

### Step 4: Configure Astro
Create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://appejv.app',
})
```

### Step 5: Create basic pages
```bash
# Homepage
cat > src/pages/index.astro << 'EOF'
---
import Layout from '../layouts/Layout.astro'
---

<Layout title="APPE JV - Trang chủ">
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-5xl font-bold text-[#175ead] mb-4">
        Chào mừng đến APPE JV
      </h1>
      <p class="text-xl text-gray-700 mb-8">
        Hệ thống quản lý bán hàng chuyên nghiệp
      </p>
      <a 
        href="/san-pham" 
        class="inline-block bg-[#175ead] text-white px-8 py-3 rounded-lg hover:bg-[#2575be] transition"
      >
        Xem sản phẩm
      </a>
    </div>
  </main>
</Layout>
EOF

# Products page
mkdir -p src/pages/san-pham
cat > src/pages/san-pham/index.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro'
---

<Layout title="Sản phẩm - APPE JV">
  <main class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-[#175ead] mb-8">
        Sản phẩm
      </h1>
      <p class="text-gray-600">
        Danh sách sản phẩm sẽ được hiển thị ở đây
      </p>
    </div>
  </main>
</Layout>
EOF
```

### Step 6: Return to root
```bash
cd ..
```

---

## Phase 3: Create appejv-api (Go)

### Step 1: Create API directory
```bash
mkdir -p appejv-api/cmd/server
mkdir -p appejv-api/internal/{handlers,models,services,middleware}
mkdir -p appejv-api/pkg/{database,utils}
mkdir -p appejv-api/config
```

### Step 2: Initialize Go module
```bash
cd appejv-api
go mod init github.com/yourusername/appejv-api
```

### Step 3: Install dependencies
```bash
go get github.com/gin-gonic/gin
go get github.com/supabase-community/supabase-go
go get github.com/joho/godotenv
```

### Step 4: Create main server file
```bash
cat > cmd/server/main.go << 'EOF'
package main

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }

    // Create Gin router
    r := gin.Default()

    // CORS middleware
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        
        c.Next()
    })

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status": "ok",
            "message": "APPE JV API is running",
        })
    })

    // API v1 routes
    v1 := r.Group("/api/v1")
    {
        v1.GET("/orders", func(c *gin.Context) {
            c.JSON(200, gin.H{"message": "Orders endpoint"})
        })
        
        v1.GET("/customers", func(c *gin.Context) {
            c.JSON(200, gin.H{"message": "Customers endpoint"})
        })
        
        v1.GET("/products", func(c *gin.Context) {
            c.JSON(200, gin.H{"message": "Products endpoint"})
        })
    }

    // Start server
    log.Println("Starting server on :8080")
    if err := r.Run(":8080"); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}
EOF
```

### Step 5: Create .env file
```bash
cat > .env << 'EOF'
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
EOF
```

### Step 6: Create README
```bash
cat > README.md << 'EOF'
# APPE JV API

Backend API server built with Go and Gin framework.

## Development

\`\`\`bash
# Run server
go run cmd/server/main.go

# Build
go build -o bin/server cmd/server/main.go

# Run binary
./bin/server
\`\`\`

## API Endpoints

- GET /health - Health check
- GET /api/v1/orders - List orders
- GET /api/v1/customers - List customers
- GET /api/v1/products - List products
EOF
```

### Step 7: Return to root
```bash
cd ..
```

---

## Phase 4: Create Shared Resources

### Step 1: Create shared directory structure
```bash
mkdir -p shared/{types,constants,assets}
```

### Step 2: Create shared types
```bash
cat > shared/types/index.ts << 'EOF'
export interface Order {
  id: number
  customer_id: number
  sale_id: string
  status: 'draft' | 'ordered' | 'shipping' | 'paid' | 'completed'
  total_amount: number
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  name: string
  phone: string
  address: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  code: string
  price: number
  stock: number
  category_id: number
  image_url?: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'sale' | 'sale_admin'
}
EOF
```

### Step 3: Create shared constants
```bash
cat > shared/constants/index.ts << 'EOF'
export const BRAND_COLORS = {
  primary: '#175ead',
  secondary: '#2575be',
}

export const ORDER_STATUSES = {
  DRAFT: 'draft',
  ORDERED: 'ordered',
  SHIPPING: 'shipping',
  PAID: 'paid',
  COMPLETED: 'completed',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  SALE: 'sale',
  SALE_ADMIN: 'sale_admin',
} as const

export const API_BASE_URL = process.env.API_URL || 'http://localhost:8080'
EOF
```

---

## Phase 5: Update appejv-app Configuration

### Step 1: Navigate to appejv-app
```bash
cd appejv-app
```

### Step 2: Update package.json name
Edit `package.json` and change:
```json
{
  "name": "appejv-app",
  ...
}
```

### Step 3: Create README if not exists
```bash
cat > README.md << 'EOF'
# APPE JV App

Sales management web application built with Next.js 16.

## Features

- Order management (Draft → Ordered → Shipping → Paid → Completed)
- Customer management
- Product inventory
- Sales reports
- User management (Admin, Sale, Sale Admin)

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Environment Variables

See `.env.local` for configuration.
EOF
```

### Step 4: Return to root
```bash
cd ..
```

---

## Phase 6: Final Setup

### Step 1: Install all dependencies
```bash
npm install
```

### Step 2: Test each project

```bash
# Test web
npm run dev:web
# Visit http://localhost:4321

# Test app (in new terminal)
npm run dev:app
# Visit http://localhost:3000

# Test API (in new terminal)
npm run dev:api
# Visit http://localhost:8080/health
```

### Step 3: Commit to Git
```bash
git add .
git commit -m "feat: restructure project into monorepo

- Move Next.js app to appejv-app
- Add Astro public website (appejv-web)
- Add Go API server (appejv-api)
- Create shared resources directory
- Setup npm workspaces
- Add root-level configuration"
```

---

## Verification Checklist

- [ ] Monorepo root created
- [ ] appejv-app (Next.js) working
- [ ] appejv-web (Astro) created and running
- [ ] appejv-api (Go) created and running
- [ ] Shared resources directory created
- [ ] Root package.json with workspaces
- [ ] All projects can run simultaneously
- [ ] Git repository initialized
- [ ] Environment variables configured

---

## Next Steps

1. **Mobile Apps**: Create iOS and Android projects
2. **API Development**: Implement full REST API endpoints
3. **Web Development**: Build out public website pages
4. **Integration**: Connect all projects together
5. **Deployment**: Setup CI/CD for each project

---

## Troubleshooting

### Issue: npm workspaces not working
**Solution**: Make sure you're using npm >= 7.0.0

### Issue: Go dependencies not installing
**Solution**: Make sure Go >= 1.21 is installed

### Issue: Astro not starting
**Solution**: Delete node_modules and run `npm install` again

---

**Created**: February 8, 2026  
**Status**: Ready to execute
