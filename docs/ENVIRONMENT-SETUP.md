# Environment Setup Guide

Hướng dẫn cấu hình môi trường cho local development và production.

## 🎯 Overview

Dự án sử dụng các file `.env` khác nhau cho từng môi trường:
- **Local Development:** `.env` hoặc `.env.local`
- **Production:** `.env.production`

## 📁 Environment Files Structure

```
appejv/
├── .env.example                          # Root template
├── appejv-api/
│   ├── .env.example                     # Local development template
│   ├── .env.production.example          # Production template
│   └── .env                             # Your local config (gitignored)
├── appejv-app/
│   ├── .env.local.example               # Local development template
│   ├── .env.production.example          # Production template
│   └── .env.local                       # Your local config (gitignored)
└── appejv-web/
    ├── .env.example                     # Local development template
    ├── .env.production.example          # Production template
    └── .env                             # Your local config (gitignored)
```

## 🔧 Local Development Setup

### Step 1: Copy Example Files

```bash
# API
cd appejv-api
cp .env.example .env

# App
cd ../appejv-app
cp .env.local.example .env.local

# Web
cd ../appejv-web
cp .env.example .env
```

### Step 2: Configure API (.env)

```bash
# appejv-api/.env
NODE_ENV=development
PORT=8081
HOST=0.0.0.0

# Supabase
SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CORS - Local Development
CORS_ORIGINS=http://localhost:3000,http://localhost:4321

# JWT
JWT_SECRET=local-dev-secret-change-in-production
JWT_EXPIRY=24h

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### Step 3: Configure App (.env.local)

```bash
# appejv-app/.env.local
NODE_ENV=development

# API URL - Local
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URLs - Local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:4321

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=false
```

### Step 4: Configure Web (.env)

```bash
# appejv-web/.env
# API URL - Local
PUBLIC_API_URL=http://localhost:8081/api/v1

# URLs - Local
PUBLIC_APP_URL=http://localhost:3000
PUBLIC_SITE_URL=http://localhost:4321

# Site Info
PUBLIC_SITE_NAME=APPE JV Việt Nam
PUBLIC_CONTACT_EMAIL=info@appe.com.vn
PUBLIC_CONTACT_PHONE=+84 3513 595 202

# Feature Flags
PUBLIC_ENABLE_3D=true
PUBLIC_ENABLE_SEARCH=true
```

## 🚀 Production Setup

### Step 1: Copy Production Templates

```bash
# API
cd appejv-api
cp .env.production.example .env.production

# App
cd ../appejv-app
cp .env.production.example .env.production

# Web
cd ../appejv-web
cp .env.production.example .env.production
```

### Step 2: Configure API (.env.production)

```bash
# appejv-api/.env.production
NODE_ENV=production
PORT=8081
HOST=0.0.0.0

# Supabase - Production Keys
SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key

# CORS - Production Domains
CORS_ORIGINS=https://app.appejv.app,https://appejv.app

# JWT - Strong Secret
JWT_SECRET=your-very-strong-production-secret-min-32-chars
JWT_EXPIRY=24h

# Database
DB_MAX_CONNECTIONS=50
DB_TIMEOUT=30s

# Logging
LOG_LEVEL=warn
LOG_FORMAT=json

# Security
ENABLE_HTTPS=true
ENABLE_HSTS=true
HSTS_MAX_AGE=31536000

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=1m
```

### Step 3: Configure App (.env.production)

```bash
# appejv-app/.env.production
NODE_ENV=production

# API URL - Production
NEXT_PUBLIC_API_URL=https://api.appejv.app/api/v1

# Supabase - Production Keys
NEXT_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# URLs - Production
NEXT_PUBLIC_APP_URL=https://app.appejv.app
NEXT_PUBLIC_WEB_URL=https://appejv.app

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Security
NEXT_PUBLIC_ENABLE_HTTPS=true
```

### Step 4: Configure Web (.env.production)

```bash
# appejv-web/.env.production
# API URL - Production
PUBLIC_API_URL=https://api.appejv.app/api/v1

# URLs - Production
PUBLIC_APP_URL=https://app.appejv.app
PUBLIC_SITE_URL=https://appejv.app

# Site Info
PUBLIC_SITE_NAME=APPE JV Việt Nam
PUBLIC_CONTACT_EMAIL=info@appe.com.vn
PUBLIC_CONTACT_PHONE=+84 3513 595 202

# Analytics
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_GTM_ID=GTM-XXXXXXX

# Feature Flags
PUBLIC_ENABLE_3D=true
PUBLIC_ENABLE_SEARCH=true

# CDN (optional)
PUBLIC_CDN_URL=https://cdn.appejv.app

# SEO
PUBLIC_CANONICAL_URL=https://appejv.app
```

## 🔄 Switching Between Environments

### Method 1: Environment Variables (Recommended)

```bash
# Development
export NODE_ENV=development
npm run dev

# Production
export NODE_ENV=production
npm run build
npm run start
```

### Method 2: Different .env Files

```bash
# Development (uses .env or .env.local)
npm run dev

# Production (uses .env.production)
npm run build
npm run start
```

### Method 3: Command Line Override

```bash
# Override specific variables
NEXT_PUBLIC_API_URL=https://api.appejv.app npm run build
```

## 📋 Environment Variables Reference

### API Variables

| Variable | Local | Production | Description |
|----------|-------|------------|-------------|
| `NODE_ENV` | development | production | Environment mode |
| `PORT` | 8081 | 8081 | Server port |
| `SUPABASE_URL` | Same | Same | Supabase project URL |
| `SUPABASE_ANON_KEY` | Dev key | Prod key | Supabase anon key |
| `CORS_ORIGINS` | localhost | Production domains | Allowed origins |
| `JWT_SECRET` | Simple | Strong | JWT signing secret |
| `LOG_LEVEL` | info | warn | Logging level |
| `ENABLE_HTTPS` | false | true | HTTPS enforcement |

### App Variables

| Variable | Local | Production | Description |
|----------|-------|------------|-------------|
| `NEXT_PUBLIC_API_URL` | localhost:8081 | api.appejv.app | API endpoint |
| `NEXT_PUBLIC_APP_URL` | localhost:3000 | app.appejv.app | App URL |
| `NEXT_PUBLIC_WEB_URL` | localhost:4321 | appejv.app | Web URL |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | false | true | Analytics toggle |
| `NEXT_PUBLIC_GA_ID` | - | G-XXXXXXXXXX | Google Analytics ID |

### Web Variables

| Variable | Local | Production | Description |
|----------|-------|------------|-------------|
| `PUBLIC_API_URL` | localhost:8081 | api.appejv.app | API endpoint |
| `PUBLIC_APP_URL` | localhost:3000 | app.appejv.app | App URL |
| `PUBLIC_SITE_URL` | localhost:4321 | appejv.app | Site URL |
| `PUBLIC_ENABLE_3D` | true | true | 3D visualization |
| `PUBLIC_GA_ID` | - | G-XXXXXXXXXX | Google Analytics ID |

## 🔐 Security Best Practices

### 1. Never Commit Secrets
```bash
# .gitignore already includes:
.env
.env.local
.env.production
.env.*.local
```

### 2. Use Strong Secrets in Production
```bash
# Generate strong JWT secret
openssl rand -base64 32

# Or use
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Rotate Keys Regularly
- Change JWT secrets every 3-6 months
- Update Supabase keys if compromised
- Use different keys for dev/staging/prod

### 4. Environment-Specific Keys
- Never use production keys in development
- Use separate Supabase projects for dev/prod
- Keep production keys in secure vault

## 🧪 Testing Configuration

### Verify Local Setup
```bash
# Check API
curl http://localhost:8081/health

# Check App
curl http://localhost:3000

# Check Web
curl http://localhost:4321
```

### Verify Production Setup
```bash
# Check API
curl https://api.appejv.app/health

# Check App
curl https://app.appejv.app

# Check Web
curl https://appejv.app
```

## 🆘 Troubleshooting

### Issue: Environment variables not loading

**Solution:**
```bash
# Restart dev server
# For Next.js, restart is required for .env changes

# Check if file exists
ls -la .env*

# Check file permissions
chmod 600 .env
```

### Issue: CORS error in production

**Solution:**
```bash
# Check CORS_ORIGINS in API .env.production
# Should include: https://app.appejv.app,https://appejv.app

# Verify in API logs
grep CORS /var/log/api.log
```

### Issue: Wrong API URL

**Solution:**
```bash
# Check environment variable
echo $NEXT_PUBLIC_API_URL

# Rebuild app
npm run build
```

## 📚 Related Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Quick Start](QUICK-START.md)
- [Testing Guide](TESTING.md)

---

**Last Updated:** 9/2/2026
