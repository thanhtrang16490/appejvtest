# Domain Configuration

Cấu hình domain cho hệ thống APPE JV.

## 🌐 Production Domains

### Main Domains
- **Web (Public):** https://appejv.app
- **App (Internal):** https://app.appejv.app
- **API (Backend):** https://api.appejv.app

### DNS Configuration

#### A Records
```
appejv.app          A    YOUR_SERVER_IP
api.appejv.app      A    YOUR_SERVER_IP
app.appejv.app      A    YOUR_SERVER_IP
```

#### CNAME Records (Alternative)
```
www.appejv.app      CNAME    appejv.app
```

## 🔧 Local Development

### URLs
- **Web:** http://localhost:4321
- **App:** http://localhost:3000
- **API:** http://localhost:8081

### Hosts File (Optional)
```bash
# /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1    local.appejv.app
127.0.0.1    local-app.appejv.app
127.0.0.1    local-api.appejv.app
```

## 📋 Environment Variables by Domain

### API (api.appejv.app)

**Local:**
```bash
PORT=8081
CORS_ORIGINS=http://localhost:3000,http://localhost:4321
```

**Production:**
```bash
PORT=8081
CORS_ORIGINS=https://app.appejv.app,https://appejv.app
```

### App (app.appejv.app)

**Local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:4321
```

**Production:**
```bash
NEXT_PUBLIC_API_URL=https://api.appejv.app/api/v1
NEXT_PUBLIC_APP_URL=https://app.appejv.app
NEXT_PUBLIC_WEB_URL=https://appejv.app
```

### Web (appejv.app)

**Local:**
```bash
PUBLIC_API_URL=http://localhost:8081/api/v1
PUBLIC_APP_URL=http://localhost:3000
PUBLIC_SITE_URL=http://localhost:4321
```

**Production:**
```bash
PUBLIC_API_URL=https://api.appejv.app/api/v1
PUBLIC_APP_URL=https://app.appejv.app
PUBLIC_SITE_URL=https://appejv.app
```

## 🔒 SSL/TLS Configuration

### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates for all domains
sudo certbot --nginx -d appejv.app -d www.appejv.app
sudo certbot --nginx -d app.appejv.app
sudo certbot --nginx -d api.appejv.app

# Auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

### Certificate Locations
```
/etc/letsencrypt/live/appejv.app/fullchain.pem
/etc/letsencrypt/live/appejv.app/privkey.pem
/etc/letsencrypt/live/app.appejv.app/fullchain.pem
/etc/letsencrypt/live/app.appejv.app/privkey.pem
/etc/letsencrypt/live/api.appejv.app/fullchain.pem
/etc/letsencrypt/live/api.appejv.app/privkey.pem
```

## 🌍 CDN Configuration (Optional)

### Cloudflare Setup

1. **Add Domain to Cloudflare**
   - Add appejv.app
   - Update nameservers at domain registrar

2. **DNS Records**
   ```
   Type    Name    Content              Proxy
   A       @       YOUR_SERVER_IP       ✓ Proxied
   A       app     YOUR_SERVER_IP       ✓ Proxied
   A       api     YOUR_SERVER_IP       ✓ Proxied
   CNAME   www     appejv.app           ✓ Proxied
   ```

3. **SSL/TLS Settings**
   - SSL/TLS encryption mode: Full (strict)
   - Always Use HTTPS: On
   - Automatic HTTPS Rewrites: On
   - Minimum TLS Version: 1.2

4. **Page Rules**
   ```
   appejv.app/*
   - Cache Level: Standard
   - Browser Cache TTL: 4 hours
   
   api.appejv.app/*
   - Cache Level: Bypass
   ```

## 🔄 Subdomain Strategy

### Current Subdomains
- `app.appejv.app` - Internal management app
- `api.appejv.app` - Backend API

### Future Subdomains (Optional)
- `cdn.appejv.app` - CDN for static assets
- `admin.appejv.app` - Admin panel (if separate)
- `staging.appejv.app` - Staging environment
- `dev.appejv.app` - Development environment

## 📊 Domain Monitoring

### Health Checks
```bash
# Check all domains
curl -I https://appejv.app
curl -I https://app.appejv.app
curl -I https://api.appejv.app/health
```

### SSL Certificate Expiry
```bash
# Check certificate expiry
echo | openssl s_client -servername appejv.app -connect appejv.app:443 2>/dev/null | openssl x509 -noout -dates
```

### Uptime Monitoring Services
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://www.pingdom.com
- StatusCake: https://www.statuscake.com

## 🔐 Security Headers

### Nginx Configuration
```nginx
# Security headers for all domains
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# HSTS (only for HTTPS)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# CSP (Content Security Policy)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

## 🧪 Testing Domains

### Local Testing
```bash
# Test API
curl http://localhost:8081/health

# Test App
curl http://localhost:3000

# Test Web
curl http://localhost:4321
```

### Production Testing
```bash
# Test API
curl https://api.appejv.app/health

# Test App
curl https://app.appejv.app

# Test Web
curl https://appejv.app

# Test SSL
curl -vI https://appejv.app 2>&1 | grep -i ssl
```

## 🆘 Troubleshooting

### Issue: Domain not resolving

**Check DNS:**
```bash
# Check DNS propagation
nslookup appejv.app
dig appejv.app

# Check from different locations
# Use: https://www.whatsmydns.net
```

### Issue: SSL certificate error

**Solutions:**
```bash
# Renew certificate
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# Check certificate
sudo certbot certificates
```

### Issue: CORS error

**Check CORS configuration:**
```bash
# API .env should include all domains
CORS_ORIGINS=https://app.appejv.app,https://appejv.app

# Test CORS
curl -H "Origin: https://app.appejv.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.appejv.app/api/v1/products
```

## 📚 Related Documentation

- [Environment Setup](ENVIRONMENT-SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Quick Start](QUICK-START.md)

---

**Last Updated:** 9/2/2026
