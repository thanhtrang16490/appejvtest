# Deployment Guide

This guide covers deploying the APPE JV Sales Order Management System to various platforms.

## Prerequisites

- Node.js >= 20.9.0
- npm >= 10.0.0
- Supabase account and project
- Git repository

## Environment Variables

Required environment variables for all deployments:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional environment variables:

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables
   - Click "Deploy"

4. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

#### Vercel Configuration

The project includes automatic configuration. No additional setup needed.

**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm ci`  
**Node Version:** 20.x (auto-detected)

---

### 2. Railway

Railway provides easy deployment with automatic HTTPS and custom domains.

#### Steps:

1. **Install Railway CLI** (optional)
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy via GitHub**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway will detect the `nixpacks.toml` configuration
   - Add environment variables in the Variables tab
   - Deploy automatically starts

4. **Custom Domain**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records

#### Railway Configuration

The project includes `nixpacks.toml` for automatic configuration:
- Node.js 20.x
- Automatic dependency installation
- Build and start commands

---

### 3. Docker Deployment

For self-hosted or cloud platforms supporting Docker.

#### Build Docker Image

```bash
# Build the image
docker build -t appejv-sales:latest .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  appejv-sales:latest
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

### 4. AWS (EC2 or ECS)

#### EC2 Deployment

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.small or larger
   - Open ports 80, 443, 22

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/thanhtrang16490/appejvtest.git
   cd appejvtest
   
   # Install dependencies
   npm ci
   
   # Build
   npm run build
   
   # Start with PM2
   pm2 start npm --name "appejv" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx (Optional)**
   ```bash
   sudo apt install nginx
   ```

   Create `/etc/nginx/sites-available/appejv`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
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

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/appejv /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### 5. Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Import from Git

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 20

3. **Add Environment Variables**
   - Site settings → Environment variables
   - Add all required variables

---

### 6. Render

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect repository

2. **Configure**
   - Environment: Node
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Add environment variables

---

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled
- [ ] Custom domain is configured (if applicable)
- [ ] Database connection is working
- [ ] Authentication is working
- [ ] All routes are accessible
- [ ] Security headers are applied
- [ ] Rate limiting is working
- [ ] Error tracking is configured
- [ ] Monitoring is set up
- [ ] Backup strategy is in place

## Troubleshooting

### Node Version Error

**Error:** `Node.js version ">=20.9.0" is required`

**Solution:**
- Ensure `.node-version` file exists with `20.11.0`
- Check `package.json` has correct engines field
- For Railway: `nixpacks.toml` specifies Node 20
- For Docker: Dockerfile uses `node:20-alpine`

### Build Fails

**Common Issues:**
1. Missing environment variables
2. Incorrect Node version
3. Dependency conflicts

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Database Connection Issues

**Check:**
1. Supabase URL is correct
2. Anon key is valid
3. Database is accessible from deployment platform
4. RLS policies are configured

### Performance Issues

**Optimize:**
1. Enable caching in CDN
2. Use image optimization
3. Enable compression
4. Monitor with analytics

## Monitoring & Maintenance

### Recommended Tools

- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Vercel Analytics, Google Analytics
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Lighthouse, WebPageTest

### Regular Maintenance

- Update dependencies monthly
- Review security advisories
- Monitor error logs
- Check performance metrics
- Backup database regularly

## Support

For deployment issues:
- Email: support@appejv.com
- GitHub Issues: [Create an issue](https://github.com/thanhtrang16490/appejvtest/issues)

---

Last Updated: February 6, 2024
