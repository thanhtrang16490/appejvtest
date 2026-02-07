# Next.js App Optimization Guide

## Hydration Fix ✅

### Problem
Login pages were showing code instead of UI due to hydration mismatch between server and client rendering.

### Solution
1. **Created separate auth layout** (`app/auth/layout.tsx`)
   - Isolated auth pages from complex root layout logic
   - Prevents server-side user fetching on auth pages

2. **Updated root layout** (`app/layout.tsx`)
   - Added pathname detection using middleware headers
   - Skip user/role fetching for `/auth/*` routes
   - Prevents hydration mismatch

3. **Updated middleware** (`lib/supabase/middleware.ts`)
   - Added `x-pathname` header for layout to check current route
   - Enables conditional rendering based on route

### Result
- Auth pages render cleanly without hydration errors
- No unnecessary database calls on login pages
- Faster page load for authentication

---

## Performance Optimizations

### 1. Image Optimization
- All images use Next.js Image component with proper sizing
- Lazy loading enabled by default
- WebP format support

### 2. Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (automatic with App Router)
- Lazy load modals and dialogs

### 3. Database Query Optimization
- Use `.single()` for single record queries
- Select only needed columns
- Implement pagination for large lists
- Cache frequently accessed data

### 4. Client-Side State Management
- Minimize useState usage
- Use React Query/SWR for server state (future improvement)
- Debounce search inputs

### 5. Bundle Size Optimization
```bash
# Analyze bundle size
npm run build
```

Current optimizations:
- Tree-shaking enabled
- Unused dependencies removed
- CSS modules for component-specific styles

---

## Recommended Future Optimizations

### 1. Implement React Query
```bash
npm install @tanstack/react-query
```

Benefits:
- Automatic caching
- Background refetching
- Optimistic updates
- Reduced prop drilling

### 2. Add Loading States
- Implement Suspense boundaries
- Add skeleton loaders
- Progressive loading for lists

### 3. Optimize Fonts
- Use `next/font` for all fonts (already using Inter)
- Preload critical fonts
- Subset fonts to reduce size

### 4. Implement Service Worker
- Cache static assets
- Offline support
- Background sync for orders

### 5. Database Indexing
Ensure these indexes exist in Supabase:
```sql
-- Orders
CREATE INDEX idx_orders_sale_id ON orders(sale_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_stock ON products(stock);

-- Customers
CREATE INDEX idx_customers_assigned_sale ON customers(assigned_sale);

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_manager_id ON profiles(manager_id);
```

### 6. Implement Edge Caching
- Use Vercel Edge Network
- Cache static pages
- ISR for product pages

### 7. Optimize Images
```bash
# Convert images to WebP
npm install sharp
```

### 8. Add Compression
- Enable gzip/brotli compression
- Minify CSS/JS (automatic in production)

### 9. Monitoring & Analytics
- Add Vercel Analytics
- Implement error tracking (Sentry)
- Monitor Core Web Vitals

### 10. Security Enhancements
- Implement CSP headers (already done)
- Add rate limiting (already done)
- Enable audit logging (already done)

---

## Performance Metrics

### Target Metrics
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### Monitoring
```bash
# Run Lighthouse audit
npm run build
npm start
# Open Chrome DevTools > Lighthouse
```

---

## Build Optimization

### Current Build Settings
- Turbopack enabled for faster builds
- TypeScript strict mode
- ESLint configured
- Automatic code splitting

### Production Build
```bash
npm run build
npm start
```

### Docker Build (Optimized)
```dockerfile
# Multi-stage build for smaller image
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Deployment Checklist

- [x] Build succeeds without errors
- [x] All environment variables set
- [x] Database migrations applied
- [x] RLS policies configured
- [x] Security headers enabled
- [x] Rate limiting configured
- [x] Audit logging enabled
- [x] Error boundaries implemented
- [x] Loading states added
- [x] Hydration issues fixed
- [ ] Performance monitoring setup
- [ ] Error tracking configured
- [ ] Backup strategy implemented

---

## Testing Performance

### Local Testing
```bash
# Build and start production server
npm run build
npm start

# Test with Lighthouse
# Open http://localhost:3000 in Chrome
# DevTools > Lighthouse > Generate Report
```

### Load Testing
```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

---

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review error logs weekly
- Monitor performance metrics daily
- Backup database daily
- Review security advisories weekly

### Performance Review
- Run Lighthouse audit monthly
- Check bundle size after major updates
- Review slow queries in Supabase
- Optimize images as needed

---

Last Updated: February 7, 2026
