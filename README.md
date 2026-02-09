# APPE JV - Monorepo

Hệ thống quản lý và website cho APPE JV Việt Nam - Thức ăn chăn nuôi và thủy sản chất lượng cao.

## 📦 Projects

### 1. appejv-api (Go Fiber)
Backend API với JWT authentication và role-based authorization.

- **Tech:** Go, Fiber v2, Supabase
- **Port:** 8081
- **Docs:** [appejv-api/README.md](appejv-api/README.md)

### 2. appejv-app (Next.js)
Ứng dụng quản lý nội bộ cho sales và admin.

- **Tech:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Port:** 3000
- **Docs:** [appejv-app/README.md](appejv-app/README.md)

### 3. appejv-web (Astro)
Website công khai giới thiệu sản phẩm.

- **Tech:** Astro, React, TypeScript, Tailwind CSS
- **Port:** 4321
- **Docs:** [appejv-web/README.md](appejv-web/README.md)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Go 1.22+
- Supabase account

### Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd appejv
```

2. **Install dependencies**
```bash
# Root (optional, for shared packages)
npm install

# API
cd appejv-api
go mod download

# App
cd ../appejv-app
npm install

# Web
cd ../appejv-web
npm install
```

3. **Configure environment**
```bash
# Copy example files
cp appejv-api/.env.example appejv-api/.env
cp appejv-app/.env.local.example appejv-app/.env.local
cp appejv-web/.env.example appejv-web/.env

# Edit with your Supabase credentials
```

4. **Run services**

Terminal 1 - API:
```bash
cd appejv-api
PORT=8081 go run cmd/server/main-fiber.go
```

Terminal 2 - App:
```bash
cd appejv-app
npm run dev
```

Terminal 3 - Web:
```bash
cd appejv-web
npm run dev
```

### Access

**Local Development:**
- **API:** http://localhost:8081
- **App:** http://localhost:3000
- **Web:** http://localhost:4321

**Production:**
- **API:** https://api.appejv.app
- **App:** https://app.appejv.app
- **Web:** https://appejv.app

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Users                            │
└──────────────┬──────────────────┬───────────────────┘
               │                  │
        Browser (Web)      Internal Users (App)
               │                  │
               ▼                  ▼
┌──────────────────────┐  ┌──────────────────────┐
│   appejv-web         │  │   appejv-app         │
│   (Astro SSR)        │  │   (Next.js)          │
│   Port: 4321         │  │   Port: 3000         │
│   Public access      │  │   JWT auth required  │
└──────────┬───────────┘  └──────────┬───────────┘
           │                         │
           │ HTTP GET                │ HTTP + JWT
           │ /api/v1/products        │ Authorization: Bearer
           │                         │
           └─────────┬───────────────┘
                     │
                     ▼
           ┌─────────────────────────┐
           │   appejv-api            │
           │   (Go Fiber)            │
           │   Port: 8081            │
           │                         │
           │   - Public endpoints    │
           │   - Protected endpoints │
           │   - JWT verification    │
           │   - Role-based access   │
           └──────────┬──────────────┘
                      │
                      ▼
           ┌─────────────────────────┐
           │      Supabase           │
           │   (PostgreSQL)          │
           └─────────────────────────┘
```

## 🔐 Authentication & Authorization

### Roles
- **customer:** Khách hàng (xem sản phẩm, đặt hàng)
- **sale:** Nhân viên bán hàng (quản lý khách hàng, đơn hàng)
- **admin:** Quản trị viên (toàn quyền)
- **sale_admin:** Quản lý bán hàng (sales + quản lý sản phẩm)

### Flow
1. User đăng nhập qua Supabase Auth
2. Supabase trả về JWT token
3. Client gửi token trong header: `Authorization: Bearer <token>`
4. API verify token và check role từ database
5. API grant/deny access dựa trên role

## 🧪 Testing

### Run all tests
```bash
# Web + API integration
./test-web-api-integration.sh

# App + API integration
./test-fiber-app-integration.sh

# Full auth flow
./test-with-login.sh
```

### Manual testing
```bash
# Check API health
curl http://localhost:8081/health

# Get products (public)
curl http://localhost:8081/api/v1/products

# Get profile (protected, needs JWT)
curl http://localhost:8081/api/v1/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Documentation

### Main Docs
- [Quick Start Guide](docs/QUICK-START.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Testing Guide](docs/TESTING.md)

### Project-Specific
- [API Setup](appejv-api/SETUP.md)
- [App Documentation](appejv-app/README.md)
- [Web Documentation](appejv-web/README.md)

### Archive
- [Migration History](docs/archive/)
- [Old Documentation](docs/archive/)

## 🛠️ Development

### Code Structure
```
appejv/
├── appejv-api/          # Go Fiber API
│   ├── cmd/server/      # Entry points
│   ├── internal/        # Business logic
│   └── pkg/             # Shared packages
├── appejv-app/          # Next.js App
│   ├── app/             # Pages & routes
│   ├── components/      # React components
│   └── lib/             # Utilities
├── appejv-web/          # Astro Website
│   ├── src/pages/       # Pages
│   ├── src/components/  # Components
│   └── src/lib/         # Utilities
├── shared/              # Shared code
└── docs/                # Documentation
```

### Tech Stack

**Backend:**
- Go 1.22+
- Fiber v2 (Web framework)
- Supabase Go Client
- JWT authentication

**Frontend (App):**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Query
- Zustand

**Frontend (Web):**
- Astro
- React (for interactive components)
- TypeScript
- Tailwind CSS

**Database:**
- Supabase (PostgreSQL)
- Row Level Security (RLS)

## 🚢 Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Build all projects
- [ ] Run tests
- [ ] Configure CORS for production domains
- [ ] Set up monitoring
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificates

### Build Commands
```bash
# API
cd appejv-api
go build -o bin/api cmd/server/main-fiber.go

# App
cd appejv-app
npm run build

# Web
cd appejv-web
npm run build
```

## 📝 License

Proprietary - APPE JV Việt Nam

## 👥 Team

- **Development:** Kiro AI
- **Company:** APPE JV Việt Nam
- **Contact:** info@appe.com.vn

## 🔗 Links

**Local Development:**
- API: http://localhost:8081
- App: http://localhost:3000
- Web: http://localhost:4321

**Production:**
- Website: https://appejv.app
- App: https://app.appejv.app
- API: https://api.appejv.app
- Company: https://appe.com.vn

---

**Last Updated:** 9/2/2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
