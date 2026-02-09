# Quick Start Guide

Hướng dẫn nhanh để chạy toàn bộ hệ thống APPE JV.

## Prerequisites

- Node.js 20+
- Go 1.22+
- Supabase account

## Step 1: Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd appejv

# Install API dependencies
cd appejv-api
go mod download

# Install App dependencies
cd ../appejv-app
npm install

# Install Web dependencies
cd ../appejv-web
npm install
```

## Step 2: Configure Environment

### API (.env)
```bash
cd appejv-api
cp .env.example .env
```

Edit `appejv-api/.env`:
```env
PORT=8081
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### App (.env.local)
```bash
cd appejv-app
cp .env.local.example .env.local
```

Edit `appejv-app/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Web (.env)
```bash
cd appejv-web
cp .env.example .env
```

Edit `appejv-web/.env`:
```env
PUBLIC_API_URL=http://localhost:8081/api/v1
```

## Step 3: Run Services

Open 3 terminals:

### Terminal 1: API
```bash
cd appejv-api
PORT=8081 go run cmd/server/main-fiber.go
```

Expected output:
```
✓ Connected to Supabase
🚀 Server starting on port 8081
📊 Database: Supabase
🔐 Auth: JWT-based (stateless)
⚡ Framework: Fiber v2
```

### Terminal 2: App
```bash
cd appejv-app
npm run dev
```

Expected output:
```
▲ Next.js 16.1.6
- Local:   http://localhost:3000
✓ Ready in 2s
```

### Terminal 3: Web
```bash
cd appejv-web
npm run dev
```

Expected output:
```
astro v5.17.1 ready in 320 ms
┃ Local    http://localhost:4321/
```

## Step 4: Verify

### Check API
```bash
curl http://localhost:8081/health
```

Expected:
```json
{
  "status": "ok",
  "service": "appejv-api",
  "version": "1.0.0",
  "database": "supabase",
  "auth": "jwt",
  "framework": "fiber"
}
```

### Check Web
Open browser: http://localhost:4321

### Check App
Open browser: http://localhost:3000

## Step 5: Login

### Default Users

Create real user accounts through Supabase Dashboard or Authentication UI.

**Roles:**
- **admin** - Full access to all features
- **sale** - Access to sales features
- **customer** - Access to customer portal

## Troubleshooting

### Port already in use
```bash
# Find process
lsof -ti:8081  # or 3000, 4321

# Kill process
kill -9 <PID>
```

### API connection error
- Check Supabase URL and keys
- Verify network connection
- Check firewall settings

### CORS error
- Verify API CORS config includes your frontend URLs
- Check browser console for details

## Next Steps

- Read [Architecture Overview](ARCHITECTURE.md)
- Check [API Documentation](API.md)
- Run [Testing Guide](TESTING.md)
