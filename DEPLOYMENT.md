# Deployment Guide - APPE JV App

## Quick Deploy to Railway

Railway is the recommended platform for this app (already configured with `nixpacks.toml`).

### Prerequisites
- GitHub account
- Railway account (free tier available)
- Supabase project

### Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect configuration

3. **Set Environment Variables**
   Go to your project → Variables tab and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NODE_ENV=production
   ```

4. **Apply Database Migrations**
   In Supabase SQL Editor, run these in order:
   - `supabase-migrations.sql` (if not already done)
   - `supabase-add-categories-table.sql`
   - `supabase-add-order-items-simple.sql`
   - `supabase-add-payment-status.sql`
   - `supabase-add-indexes-optimization.sql` ⭐ **Important for performance**
   - `supabase-add-manager-hierarchy.sql` (optional)

5. **Configure Custom Domain** (Optional)
   - Go to Settings → Domains
   - Add your domain
   - Update DNS records as instructed

6. **Verify Deployment**
   - Test login pages (no hydration errors)
   - Check all routes work
   - Verify database queries are fast
   - Test on mobile devices

---

## Alternative: Vercel Deployment

### Steps

1. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Vercel auto-detects Next.js

2. **Configure Environment Variables**
   Project Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Apply database migrations (see above)

---

## Post-Deployment Checklist

### Required
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Database indexes created ⭐ **Critical**
- [ ] Login pages work (no hydration errors)
- [ ] All routes accessible
- [ ] Mobile responsive

### Recommended
- [ ] Custom domain configured
- [ ] HTTPS enabled (automatic on Railway/Vercel)
- [ ] Error monitoring setup
- [ ] Performance monitoring
- [ ] Backup strategy

---

## Performance Optimization

### Database Indexes (CRITICAL)
Run `supabase-add-indexes-optimization.sql` for 50-70% query performance improvement.

### Verify Performance
1. Run Lighthouse audit
2. Check Core Web Vitals
3. Monitor query performance in Supabase Dashboard

---

## Troubleshooting

### Build Fails
```bash
# Locally test build
npm run build

# If fails, check:
# - All dependencies installed
# - Environment variables set
# - No TypeScript errors
```

### Hydration Errors
- Verify `app/auth/layout.tsx` exists
- Check middleware has `x-pathname` header
- Clear browser cache

### Slow Queries
- Apply database indexes
- Check Supabase Dashboard → Query Performance
- Run ANALYZE on tables

---

## Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot (free)
- **Errors**: Sentry (free tier)
- **Analytics**: Vercel Analytics or Google Analytics
- **Performance**: Lighthouse CI

---

## Support

For deployment issues:
- Check OPTIMIZATION-CHECKLIST.md
- Review Railway/Vercel logs
- Test locally first

---

**Last Updated**: February 7, 2026  
**Status**: Ready for production deployment
