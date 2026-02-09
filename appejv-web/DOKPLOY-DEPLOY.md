# Dokploy Deployment Guide - appejv-web

Hướng dẫn deploy appejv-web (Astro) lên Dokploy.

## 🎯 Build Type: Nixpacks

Astro static site với Nixpacks.

## 📋 Deployment Steps

### 1. Tạo Application trong Dokploy

1. Login vào Dokploy dashboard
2. Click **Create Application**
3. Chọn **Git Repository**
4. Nhập repository URL: `https://github.com/thanhtrang16490/appejvtest`

### 2. Cấu hình Build

**Build Type:** Nixpacks

**Settings:**
```
Repository: https://github.com/thanhtrang16490/appejvtest
Branch: main
Build Path: appejv-web
Port: 4321
```

### 3. Environment Variables

Thêm các biến môi trường sau:

```bash
# API URL (Production)
PUBLIC_API_URL=https://api.appejv.app/api/v1

# App URL (Production)
PUBLIC_APP_URL=https://app.appejv.app

# Site Configuration
PUBLIC_SITE_NAME=APPE JV Việt Nam
PUBLIC_SITE_URL=https://appejv.app

# Contact Information
PUBLIC_CONTACT_EMAIL=info@appe.com.vn
PUBLIC_CONTACT_PHONE=+84 3513 595 202

# Feature Flags
PUBLIC_ENABLE_3D=true
PUBLIC_ENABLE_SEARCH=true

# Analytics (optional)
PUBLIC_GA_ID=
PUBLIC_GTM_ID=

# Node Environment
NODE_ENV=production
PORT=4321
```

### 4. Domain Configuration

**Custom Domain:**
```
appejv.app
```

**SSL:** Enable automatic SSL (Let's Encrypt)

### 5. Deploy

Click **Deploy** button!

## 🔍 Verify Deployment

### Check Homepage
```bash
curl https://appejv.app
```

### Check Products Page
```bash
curl https://appejv.app/san-pham
```

## 📊 Astro Build Output

Astro builds to `dist/` folder with:
- Static HTML files
- Optimized assets
- Pre-rendered pages

## 🚀 Performance

**Astro Benefits:**
- ✅ Static Site Generation (SSG)
- ✅ Zero JavaScript by default
- ✅ Fast page loads
- ✅ SEO optimized
- ✅ Small bundle size

## 🔧 Nixpacks Configuration

File `nixpacks.toml` đã được tạo với:
- Node.js 20
- npm install --legacy-peer-deps (fix React dependency conflict)
- npm run build (build static site to dist/)
- serve dist (serve static files with serve package)

## 📝 Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Products page shows data from API
- [ ] Images load correctly
- [ ] 3D visualization works
- [ ] SEO meta tags present
- [ ] SSL certificate active
- [ ] Domain resolves correctly

## 🔄 Update Deployment

### Method 1: Git Push (Auto-deploy)
```bash
git add .
git commit -m "update: your changes"
git push origin main
```

### Method 2: Manual Deploy
1. Go to Dokploy dashboard
2. Click application
3. Click "Redeploy"

## 🆘 Troubleshooting

### Issue: Build fails

**Check:**
1. Node version (should be 20+)
2. Dependencies in package.json
3. Build path is correct

**Solution:**
```bash
# Test build locally
cd appejv-web
npm install
npm run build
```

### Issue: Preview server doesn't start or blocked host error

**Error:** "This host is not allowed"

**Solution:** Use static file server instead of preview server.

**Updated start command:**
```bash
serve dist -l $PORT
```

This serves the built static files from `dist/` folder.

### Issue: API calls fail

**Check environment:**
```bash
PUBLIC_API_URL=https://api.appejv.app/api/v1
```

**Verify API is running:**
```bash
curl https://api.appejv.app/health
```

### Issue: 3D visualization not working

**Check:**
1. PUBLIC_ENABLE_3D=true
2. React dependencies installed
3. Three.js loaded correctly

## 💡 Tips

1. **Use Nixpacks** for automatic detection
2. **Enable auto-deploy** for CI/CD
3. **Monitor build times** (should be < 2 min)
4. **Check bundle size** (should be < 1MB)
5. **Test on mobile** devices

## 🔗 Related Documentation

- [Deployment Guide](../../docs/DEPLOYMENT.md)
- [Environment Setup](../../docs/ENVIRONMENT-SETUP.md)
- [Domain Configuration](../../docs/DOMAINS.md)

---

**Last Updated:** 9/2/2026  
**Build Type:** Nixpacks  
**Framework:** Astro 5
