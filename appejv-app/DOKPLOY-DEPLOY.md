# Dokploy Deployment Guide - appejv-app

Hướng dẫn deploy appejv-app (Next.js) lên Dokploy.

## 🎯 Build Type: Nixpacks

Next.js app với Nixpacks.

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
Build Path: appejv-app
Port: 3000
```

### 3. Environment Variables

Thêm các biến môi trường sau:

```bash
# Next.js
NODE_ENV=production
PORT=3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API
NEXT_PUBLIC_API_URL=https://api.appejv.app/api/v1

# App URLs
NEXT_PUBLIC_APP_URL=https://app.appejv.app
NEXT_PUBLIC_WEB_URL=https://appejv.app

# Auth
NEXTAUTH_URL=https://app.appejv.app
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### 4. Domain Configuration

**Custom Domain:**
```
app.appejv.app
```

**SSL:** Enable automatic SSL (Let's Encrypt)

### 5. Deploy

Click **Deploy** button!

## 🔍 Verify Deployment

### Check Homepage
```bash
curl https://app.appejv.app
```

### Check API Integration
```bash
# Should redirect to login
curl -I https://app.appejv.app/sales
```

## 📊 Next.js Build Output

Next.js builds with:
- Server-side rendering (SSR)
- API routes
- Static optimization
- Image optimization

## 🚀 Performance

**Next.js Benefits:**
- ✅ Server-side rendering
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Fast refresh
- ✅ API routes

## 🔧 Nixpacks Configuration

File `nixpacks.toml` đã được tạo với:
- Node.js 20
- npm ci (uses package-lock.json)
- npm run build
- npm start (production server)

## 📝 Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Login page works
- [ ] API integration working
- [ ] Supabase connection OK
- [ ] Images load correctly
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
2. package-lock.json exists
3. Build path is correct

**Solution:**
```bash
# Test build locally
cd appejv-app
npm install
npm run build
```

### Issue: Server doesn't start

**Check logs:**
```bash
# In Dokploy dashboard
Application → Logs
```

**Verify start command:**
```bash
npm start
```

### Issue: Environment variables not working

**Check:**
1. All NEXT_PUBLIC_* variables set
2. NEXTAUTH_SECRET is set
3. Supabase keys are correct

**Verify:**
```bash
# Check in browser console
console.log(process.env.NEXT_PUBLIC_API_URL)
```

### Issue: API calls fail

**Check environment:**
```bash
NEXT_PUBLIC_API_URL=https://api.appejv.app/api/v1
```

**Verify API is running:**
```bash
curl https://api.appejv.app/health
```

### Issue: Supabase connection fails

**Check:**
1. NEXT_PUBLIC_SUPABASE_URL is correct
2. NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
3. SUPABASE_SERVICE_ROLE_KEY is correct (for server-side)

## 💡 Tips

1. **Use Nixpacks** for automatic detection
2. **Enable auto-deploy** for CI/CD
3. **Monitor build times** (should be < 3 min)
4. **Check bundle size** (should be optimized)
5. **Test on mobile** devices

## 🔗 Related Documentation

- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Environment Setup](../docs/ENVIRONMENT-SETUP.md)
- [Domain Configuration](../docs/DOMAINS.md)

---

**Last Updated:** 9/2/2026  
**Build Type:** Nixpacks  
**Framework:** Next.js 16
