# APPE JV - Development Guide

## 🚀 Quick Start

### Start Development Environment

```bash
./dev-start.sh
```

Lệnh này sẽ:
- Khởi động API Server (Go Fiber) trên port 8080
- Khởi động Next.js App trên port 3000

### Stop Development Environment

```bash
./dev-stop.sh
```

## 📍 Services

| Service | URL | Description |
|---------|-----|-------------|
| **API** | http://localhost:8080 | Go Fiber API Server |
| **App** | http://localhost:3000 | Next.js Frontend App |
| **API Health** | http://localhost:8080/health | Health check endpoint |
| **API Products** | http://localhost:8080/api/v1/products | Products API |

## 🔧 Manual Setup

### 1. Start API Server

```bash
cd appejv-api
go run cmd/server/main-fiber.go
```

### 2. Start Next.js App

```bash
cd appejv-app
npm run dev
```

## 📝 Environment Configuration

### API (.env)
```env
SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
SUPABASE_ANON_KEY=your-key
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000
JWT_SECRET=your-secret
```

### App (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 🧪 Testing API

### Health Check
```bash
curl http://localhost:8080/health
```

### Get Products
```bash
curl http://localhost:8080/api/v1/products
```

### Login (Get JWT Token)
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## 🔑 Test Accounts

### Admin Account
- Email: `admin@appejv.app`
- Password: `admin123`
- Role: `admin`

### Sales Account
- Email: `sale@appejv.app`
- Password: `sale123`
- Role: `sale`

### Customer Account
- Phone: `0961566633`
- Password: `customer123`
- Role: `customer`

## 📦 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/products` - List products

### Protected Endpoints (Require JWT)
- `GET /api/v1/customers` - List customers
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/inventory` - Inventory management
- `GET /api/v1/reports` - Sales reports

## 🐛 Troubleshooting

### Port Already in Use

**API (8080):**
```bash
lsof -ti:8080 | xargs kill -9
```

**App (3000):**
```bash
lsof -ti:3000 | xargs kill -9
```

### API Not Connecting to Supabase
1. Check `.env` file in `appejv-api/`
2. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Test connection: `curl http://localhost:8080/health`

### App Not Connecting to API
1. Check `.env.local` file in `appejv-app/`
2. Verify `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
3. Clear Next.js cache: `rm -rf appejv-app/.next`

## 📚 Development Workflow

1. **Start services**: `./dev-start.sh`
2. **Make changes** to code
3. **Test changes** in browser (http://localhost:3000)
4. **Check API logs** in terminal
5. **Stop services**: `./dev-stop.sh`

## 🔄 Hot Reload

- **API**: Automatically reloads on file changes (Go)
- **App**: Automatically reloads on file changes (Next.js)

## 📖 Documentation

- [API Documentation](./appejv-api/README.md)
- [App Documentation](./appejv-app/README.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 💡 Tips

- Use Chrome DevTools Network tab to debug API calls
- Check browser console for frontend errors
- Check terminal for API errors
- Use Postman or curl to test API endpoints directly
