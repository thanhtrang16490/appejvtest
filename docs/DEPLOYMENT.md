# Deployment Guide

Hướng dẫn deploy hệ thống APPE JV lên production.

## 🌐 Domain Configuration

### Production Domains
- **Web (Public):** https://appejv.app
- **App (Internal):** https://app.appejv.app
- **API (Backend):** https://api.appejv.app

### Local Development
- **Web:** http://localhost:4321
- **App:** http://localhost:3000
- **API:** http://localhost:8081

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Copy `.env.example` files to `.env` or `.env.production`
- [ ] Update all environment variables with production values
- [ ] Set correct domain URLs
- [ ] Configure Supabase production keys
- [ ] Set strong JWT secrets
- [ ] Configure CORS origins

### 2. Security
- [ ] Enable HTTPS
- [ ] Enable HSTS
- [ ] Configure rate limiting
- [ ] Set up firewall rules
- [ ] Review security headers
- [ ] Enable audit logging

### 3. Performance
- [ ] Configure CDN for static assets
- [ ] Set up Redis caching (optional)
- [ ] Optimize database connections
- [ ] Enable compression
- [ ] Configure load balancing (if needed)

### 4. Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts

## 🔧 Configuration by Service

### API (api.appejv.app)

#### Environment Variables
```bash
# appejv-api/.env.production
NODE_ENV=production
PORT=8081
HOST=0.0.0.0

SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
SUPABASE_ANON_KEY=your-production-key

CORS_ORIGINS=https://app.appejv.app,https://appejv.app

JWT_SECRET=your-strong-secret
JWT_EXPIRY=24h

LOG_LEVEL=warn
ENABLE_HTTPS=true
ENABLE_HSTS=true
```

#### Build & Deploy
```bash
# Build
cd appejv-api
go build -o bin/api cmd/server/main-fiber.go

# Run
PORT=8081 ./bin/api

# Or with Docker
docker build -t appejv-api .
docker run -p 8081:8081 --env-file .env.production appejv-api
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.appejv.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.appejv.app;

    ssl_certificate /etc/ssl/certs/appejv.app.crt;
    ssl_certificate_key /etc/ssl/private/appejv.app.key;

    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### App (app.appejv.app)

#### Environment Variables
```bash
# appejv-app/.env.production
NODE_ENV=production

NEXT_PUBLIC_API_URL=https://api.appejv.app/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key

NEXT_PUBLIC_APP_URL=https://app.appejv.app
NEXT_PUBLIC_WEB_URL=https://appejv.app

NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Build & Deploy
```bash
# Build
cd appejv-app
npm run build

# Run
npm run start

# Or with Docker
docker build -t appejv-app .
docker run -p 3000:3000 appejv-app
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name app.appejv.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.appejv.app;

    ssl_certificate /etc/ssl/certs/appejv.app.crt;
    ssl_certificate_key /etc/ssl/private/appejv.app.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Web (appejv.app)

#### Environment Variables
```bash
# appejv-web/.env.production
PUBLIC_API_URL=https://api.appejv.app/api/v1
PUBLIC_APP_URL=https://app.appejv.app
PUBLIC_SITE_URL=https://appejv.app

PUBLIC_ENABLE_3D=true
PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Build & Deploy
```bash
# Build
cd appejv-web
npm run build

# Preview
npm run preview

# Or deploy to Vercel/Netlify
# The dist/ folder contains static files
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name appejv.app www.appejv.app;
    return 301 https://appejv.app$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.appejv.app;
    return 301 https://appejv.app$request_uri;
}

server {
    listen 443 ssl http2;
    server_name appejv.app;

    ssl_certificate /etc/ssl/certs/appejv.app.crt;
    ssl_certificate_key /etc/ssl/private/appejv.app.key;

    root /var/www/appejv-web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🐳 Docker Deployment

### Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: ./appejv-api
    ports:
      - "8081:8081"
    env_file:
      - ./appejv-api/.env.production
    restart: unless-stopped

  app:
    build: ./appejv-app
    ports:
      - "3000:3000"
    env_file:
      - ./appejv-app/.env.production
    depends_on:
      - api
    restart: unless-stopped

  web:
    build: ./appejv-web
    ports:
      - "4321:4321"
    env_file:
      - ./appejv-web/.env.production
    depends_on:
      - api
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - api
      - app
      - web
    restart: unless-stopped
```

### Run with Docker Compose
```bash
docker-compose up -d
```

## ☁️ Cloud Deployment Options

### Option 1: VPS (DigitalOcean, Linode, etc.)
1. Set up Ubuntu 22.04 server
2. Install Docker & Docker Compose
3. Clone repository
4. Configure environment variables
5. Run with Docker Compose
6. Set up Nginx reverse proxy
7. Configure SSL with Let's Encrypt

### Option 2: Vercel (Web + App)
```bash
# Deploy Web
cd appejv-web
vercel --prod

# Deploy App
cd appejv-app
vercel --prod
```

### Option 3: Railway (API)
```bash
# Deploy API
cd appejv-api
railway up
```

### Option 4: AWS
- **API:** EC2 or ECS
- **App:** Amplify or EC2
- **Web:** S3 + CloudFront
- **Database:** RDS (if not using Supabase)

## 🔒 SSL Certificate

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d appejv.app -d www.appejv.app
sudo certbot --nginx -d app.appejv.app
sudo certbot --nginx -d api.appejv.app

# Auto-renewal
sudo certbot renew --dry-run
```

## 📊 Monitoring

### Health Checks
```bash
# API
curl https://api.appejv.app/health

# App
curl https://app.appejv.app

# Web
curl https://appejv.app
```

### Uptime Monitoring
- UptimeRobot
- Pingdom
- StatusCake

### Error Tracking
- Sentry
- Rollbar
- Bugsnag

### Analytics
- Google Analytics
- Plausible
- Umami

## 🔄 CI/CD

### GitHub Actions Example
```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy API
        run: |
          # Your deployment script
          
  deploy-app:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy App
        run: |
          # Your deployment script
          
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Web
        run: |
          # Your deployment script
```

## 🧪 Post-Deployment Testing

```bash
# Run production tests
./test-web-api-integration.sh
./test-fiber-app-integration.sh

# Check all services
curl https://api.appejv.app/health
curl https://app.appejv.app
curl https://appejv.app
```

## 📝 Rollback Plan

### Quick Rollback
```bash
# Revert to previous version
git revert HEAD
git push

# Or use Docker tags
docker pull appejv-api:previous
docker-compose up -d
```

## 🆘 Troubleshooting

### Issue: CORS Error
- Check CORS_ORIGINS in API .env
- Verify domain names are correct
- Check SSL certificates

### Issue: 502 Bad Gateway
- Check if services are running
- Verify port configurations
- Check Nginx logs

### Issue: SSL Certificate Error
- Verify certificate is valid
- Check certificate paths in Nginx
- Renew certificate if expired

---

**Last Updated:** 9/2/2026
