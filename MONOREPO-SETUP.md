# APPE JV Monorepo Setup Guide

## Architecture Overview

```
appejv/
├── appejv-web/          # Public website (Astro)
├── appejv-app/          # Sales management app (Next.js) - Current project
├── appejv-api/          # Backend API (Go)
├── appejv-ios/          # iOS native app (Swift)
├── appejv-android/      # Android native app (Kotlin)
└── shared/              # Shared resources
    ├── types/           # Shared TypeScript types
    ├── constants/       # Shared constants
    └── assets/          # Shared images, icons
```

---

## Step-by-Step Migration

### Phase 1: Prepare Current Project

1. **Create monorepo root directory**
   ```bash
   cd ..
   mkdir appejv
   cd appejv
   ```

2. **Move current project to appejv-app**
   ```bash
   mv ../appejvtest appejv-app
   ```

3. **Initialize monorepo**
   ```bash
   git init
   echo "# APPE JV Monorepo" > README.md
   ```

---

### Phase 2: Setup appejv-web (Astro)

1. **Create Astro project**
   ```bash
   npm create astro@latest appejv-web
   cd appejv-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure for public website**
   - Homepage
   - Product catalog (read-only)
   - About us
   - Contact
   - Blog/News

4. **Astro config** (`astro.config.mjs`):
   ```js
   import { defineConfig } from 'astro/config'
   import tailwind from '@astrojs/tailwind'
   import react from '@astrojs/react'

   export default defineConfig({
     integrations: [tailwind(), react()],
     output: 'static', // or 'hybrid' for some SSR
     site: 'https://appejv.app',
   })
   ```

---

### Phase 3: Setup appejv-api (Go)

1. **Create Go project**
   ```bash
   mkdir appejv-api
   cd appejv-api
   go mod init github.com/yourusername/appejv-api
   ```

2. **Project structure**
   ```
   appejv-api/
   ├── cmd/
   │   └── server/
   │       └── main.go
   ├── internal/
   │   ├── handlers/
   │   ├── models/
   │   ├── services/
   │   └── middleware/
   ├── pkg/
   │   ├── database/
   │   └── utils/
   ├── config/
   ├── migrations/
   └── go.mod
   ```

3. **Install dependencies**
   ```bash
   go get github.com/gin-gonic/gin
   go get github.com/supabase-community/supabase-go
   go get github.com/joho/godotenv
   ```

4. **Basic server** (`cmd/server/main.go`):
   ```go
   package main

   import (
       "github.com/gin-gonic/gin"
   )

   func main() {
       r := gin.Default()
       
       r.GET("/health", func(c *gin.Context) {
           c.JSON(200, gin.H{
               "status": "ok",
           })
       })
       
       r.Run(":8080")
   }
   ```

---

### Phase 4: Setup appejv-ios (Swift)

1. **Create Xcode project**
   ```bash
   # Open Xcode
   # File > New > Project
   # Choose "App" template
   # Save as "appejv-ios"
   ```

2. **Project structure**
   ```
   appejv-ios/
   ├── appejv-ios/
   │   ├── App/
   │   ├── Features/
   │   │   ├── Auth/
   │   │   ├── Orders/
   │   │   ├── Customers/
   │   │   └── Products/
   │   ├── Services/
   │   │   ├── API/
   │   │   └── Storage/
   │   ├── Models/
   │   ├── Views/
   │   └── Utils/
   ├── appejv-ios.xcodeproj
   └── Podfile (or Package.swift)
   ```

3. **Dependencies** (Package.swift):
   ```swift
   dependencies: [
       .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
       .package(url: "https://github.com/supabase/supabase-swift.git", from: "2.0.0"),
   ]
   ```

---

### Phase 5: Setup appejv-android (Kotlin)

1. **Create Android Studio project**
   ```bash
   # Open Android Studio
   # New Project > Empty Activity
   # Language: Kotlin
   # Save as "appejv-android"
   ```

2. **Project structure**
   ```
   appejv-android/
   ├── app/
   │   ├── src/
   │   │   ├── main/
   │   │   │   ├── java/com/appejv/
   │   │   │   │   ├── ui/
   │   │   │   │   ├── data/
   │   │   │   │   ├── domain/
   │   │   │   │   └── di/
   │   │   │   └── res/
   │   │   └── test/
   │   └── build.gradle.kts
   ├── gradle/
   └── build.gradle.kts
   ```

3. **Dependencies** (build.gradle.kts):
   ```kotlin
   dependencies {
       implementation("androidx.core:core-ktx:1.12.0")
       implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
       implementation("androidx.compose.ui:ui:1.6.0")
       implementation("com.squareup.retrofit2:retrofit:2.9.0")
       implementation("io.github.jan-tennert.supabase:postgrest-kt:2.0.0")
   }
   ```

---

### Phase 6: Setup Shared Resources

1. **Create shared directory**
   ```bash
   mkdir -p shared/{types,constants,assets}
   ```

2. **Shared types** (`shared/types/index.ts`):
   ```typescript
   export interface Order {
     id: number
     customer_id: number
     sale_id: string
     status: 'draft' | 'ordered' | 'shipping' | 'paid' | 'completed'
     total_amount: number
     created_at: string
   }

   export interface Customer {
     id: number
     name: string
     phone: string
     address: string
   }

   export interface Product {
     id: number
     name: string
     code: string
     price: number
     stock: number
   }
   ```

3. **Shared constants** (`shared/constants/index.ts`):
   ```typescript
   export const API_BASE_URL = process.env.API_URL || 'http://localhost:8080'
   export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
   export const BRAND_COLORS = {
     primary: '#175ead',
     secondary: '#2575be',
   }
   ```

---

## Monorepo Root Configuration

### 1. Root package.json

```json
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
```

### 2. Root .gitignore

```gitignore
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
```

### 3. Root README.md

```markdown
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

- [Web App](./appejv-web/README.md)
- [Sales App](./appejv-app/README.md)
- [API](./appejv-api/README.md)
- [iOS App](./appejv-ios/README.md)
- [Android App](./appejv-android/README.md)
```

---

## API Endpoints Structure

### appejv-api Routes

```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /logout
│   └── POST /refresh
├── orders/
│   ├── GET    /orders
│   ├── GET    /orders/:id
│   ├── POST   /orders
│   ├── PUT    /orders/:id
│   └── DELETE /orders/:id
├── customers/
│   ├── GET    /customers
│   ├── GET    /customers/:id
│   ├── POST   /customers
│   ├── PUT    /customers/:id
│   └── DELETE /customers/:id
├── products/
│   ├── GET    /products
│   ├── GET    /products/:id
│   ├── POST   /products
│   ├── PUT    /products/:id
│   └── DELETE /products/:id
└── reports/
    ├── GET /reports/sales
    ├── GET /reports/revenue
    └── GET /reports/inventory
```

---

## Deployment Strategy

### appejv-web (Astro)
- **Platform**: Vercel / Netlify
- **Build**: `npm run build`
- **Output**: Static files
- **Domain**: appejv.app

### appejv-app (Next.js)
- **Platform**: Railway / Vercel
- **Build**: `npm run build`
- **Output**: Standalone
- **Domain**: app.appejv.app

### appejv-api (Go)
- **Platform**: Railway / Fly.io
- **Build**: `go build`
- **Output**: Binary
- **Domain**: api.appejv.app

### appejv-ios
- **Platform**: App Store
- **Build**: Xcode
- **Distribution**: TestFlight → App Store

### appejv-android
- **Platform**: Google Play
- **Build**: Android Studio
- **Distribution**: Internal Testing → Production

---

## Environment Variables

### Shared (.env.example)

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# API
API_URL=http://localhost:8080
API_VERSION=v1

# App URLs
WEB_URL=https://appejv.app
APP_URL=https://app.appejv.app
API_URL=https://api.appejv.app
```

---

## Migration Checklist

- [ ] Create monorepo root directory
- [ ] Move current project to appejv-app
- [ ] Setup appejv-web (Astro)
- [ ] Setup appejv-api (Go)
- [ ] Setup appejv-ios (Swift)
- [ ] Setup appejv-android (Kotlin)
- [ ] Create shared resources
- [ ] Configure root package.json
- [ ] Setup CI/CD for each project
- [ ] Configure domains
- [ ] Update documentation

---

## Benefits of This Structure

1. **Separation of Concerns**: Each project has its own responsibility
2. **Independent Deployment**: Deploy each project separately
3. **Shared Resources**: Reuse types, constants, assets
4. **Scalability**: Easy to add new projects
5. **Team Organization**: Different teams can work on different projects
6. **Technology Flexibility**: Use best tool for each job

---

## Next Steps

1. **Week 1**: Setup monorepo structure
2. **Week 2**: Create appejv-web (Astro)
3. **Week 3**: Create appejv-api (Go)
4. **Week 4**: Start appejv-ios
5. **Week 5**: Start appejv-android
6. **Week 6+**: Feature development

---

**Last Updated**: February 7, 2026  
**Status**: Planning phase  
**Priority**: High
