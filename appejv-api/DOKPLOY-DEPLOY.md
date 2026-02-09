# Dokploy Deployment Guide

Hướng dẫn deploy appejv-api lên Dokploy.

## 🎯 Khuyến nghị: Nixpacks

**Nixpacks** là lựa chọn tốt nhất vì:
- ✅ Tự động detect Go project
- ✅ Không cần config
- ✅ Build nhanh
- ✅ Tối ưu cho production

## 📋 Deployment Steps

### 1. Tạo Application trong Dokploy

1. Login vào Dokploy dashboard
2. Click **Create Application**
3. Chọn **Git Repository**
4. Nhập repository URL: `https://github.com/thanhtrang16490/appejvtest`

### 2. Cấu hình Build

#### Option A: Nixpacks (Recommended) ⭐

**Build Type:** Nixpacks

**Settings:**
```
Repository: https://github.com/thanhtrang16490/appejvtest
Branch: main
Build Path: appejv-api
Port: 8081
```

**Build Command:** (để trống, Nixpacks tự động)

**Start Command:** (để trống, Nixpacks tự động)

#### Option B: Dockerfile

**Build Type:** Dockerfile

**Settings:**
```
Repository: https://github.com/thanhtrang16490/appejvtest
Branch: main
Build Path: appejv-api
Dockerfile Path: Dockerfile
Port: 8081
```

### 3. Environment Variables

Thêm các biến môi trường sau:

```bash
# Environment
NODE_ENV=production

# Server
PORT=8081
HOST=0.0.0.0

# Supabase
SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key

# CORS (Production domains)
CORS_ORIGINS=https://app.appejv.app,https://appejv.app

# JWT
JWT_SECRET=your-strong-production-secret-min-32-chars
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

### 4. Domain Configuration

**Custom Domain:**
```
api.appejv.app
```

**SSL:** Enable automatic SSL (Let's Encrypt)

### 5. Health Check

**Path:** `/health`
**Port:** `8081`
**Interval:** `30s`

### 6. Deploy

Click **Deploy** button!

## 🔍 Verify Deployment

### Check Health
```bash
curl https://api.appejv.app/health
```

Expected response:
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

### Test API
```bash
# Get products (public endpoint)
curl https://api.appejv.app/api/v1/products
```

## 📊 Comparison: Nixpacks vs Dockerfile

| Feature | Nixpacks | Dockerfile |
|---------|----------|------------|
| Setup | Zero config | Need Dockerfile |
| Build Speed | Fast | Fast |
| Auto-detect | ✅ Yes | ❌ No |
| Customization | Limited | Full control |
| Maintenance | Easy | Manual |
| **Recommendation** | ⭐ **Best for most cases** | Advanced users |

## 🔧 Nixpacks Configuration (Optional)

Nếu cần customize Nixpacks, tạo file `nixpacks.toml`:

```toml
# appejv-api/nixpacks.toml
[phases.setup]
nixPkgs = ["go_1_22"]

[phases.build]
cmds = ["go build -o server cmd/server/main-fiber.go"]

[start]
cmd = "./server"
```

## 🐳 Dockerfile Details

Dockerfile đã được tối ưu với:
- ✅ Multi-stage build (giảm image size)
- ✅ Non-root user (security)
- ✅ Health check
- ✅ Optimized binary (ldflags)
- ✅ Timezone support
- ✅ CA certificates

**Image size:** ~15MB (vs ~800MB với full Go image)

## 🚀 CI/CD with Dokploy

Dokploy tự động deploy khi:
1. Push code lên GitHub
2. Webhook trigger
3. Auto-deploy enabled

**Enable Auto-Deploy:**
1. Go to Application Settings
2. Enable "Auto Deploy"
3. Select branch: `main`

## 📝 Post-Deployment Checklist

- [ ] Health check returns 200
- [ ] API endpoints work
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Domain points to server
- [ ] SSL certificate active
- [ ] Logs show no errors

## 🔄 Update Deployment

### Method 1: Git Push (Auto-deploy)
```bash
git add .
git commit -m "update: your changes"
git push origin main
```

Dokploy will auto-deploy if enabled.

### Method 2: Manual Deploy
1. Go to Dokploy dashboard
2. Click application
3. Click "Redeploy"

## 📊 Monitoring

### View Logs
```bash
# In Dokploy dashboard
Application → Logs → Real-time logs
```

### Metrics
- CPU usage
- Memory usage
- Request count
- Response time

## 🆘 Troubleshooting

### Issue: Build fails

**Check:**
1. Go version (should be 1.22+)
2. Dependencies in go.mod
3. Build path is correct

**Solution:**
```bash
# Test build locally
cd appejv-api
go build cmd/server/main-fiber.go
```

### Issue: Container crashes

**Check logs:**
```bash
# In Dokploy dashboard
Application → Logs
```

**Common causes:**
- Missing environment variables
- Port already in use
- Database connection failed

### Issue: Health check fails

**Verify:**
```bash
# Inside container
curl http://localhost:8081/health
```

**Check:**
- Port is 8081
- Server is running
- Health endpoint exists

### Issue: CORS error

**Check environment:**
```bash
CORS_ORIGINS=https://app.appejv.app,https://appejv.app
```

**Verify in logs:**
```
grep CORS /var/log/app.log
```

## 💡 Tips

1. **Use Nixpacks** for simplicity
2. **Enable auto-deploy** for CI/CD
3. **Monitor logs** regularly
4. **Set up alerts** for errors
5. **Use health checks** for reliability

## 🔗 Related Documentation

- [Deployment Guide](../../docs/DEPLOYMENT.md)
- [Environment Setup](../../docs/ENVIRONMENT-SETUP.md)
- [Domain Configuration](../../docs/DOMAINS.md)

---

**Last Updated:** 9/2/2026  
**Recommended:** Nixpacks ⭐
