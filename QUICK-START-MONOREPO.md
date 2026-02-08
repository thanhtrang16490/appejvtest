# Quick Start: Monorepo Migration

This guide will help you quickly migrate your current Next.js project into a monorepo structure.

---

## 🎯 Goal

Transform the current `appejvtest` project into a monorepo with:
- **appejv-app**: Current Next.js sales management app
- **appejv-web**: New Astro public website
- **appejv-api**: New Go backend API
- **shared**: Shared resources (types, constants, assets)

---

## ⚡ Quick Migration (5 minutes)

### Option 1: Automated Script

```bash
# Make script executable
chmod +x migrate-to-monorepo.sh

# Run migration script
./migrate-to-monorepo.sh
```

This will:
1. Create `appejv/` monorepo root
2. Move current project to `appejv/appejv-app`
3. Setup root configuration files
4. Create shared resources directory
5. Install dependencies

### Option 2: Manual Steps

Follow the detailed instructions in `MONOREPO-MIGRATION-STEPS.md`

---

## 📦 After Migration

Your directory structure will look like:

```
appejv/                          # Monorepo root
├── appejv-app/                  # ✅ Your current Next.js project
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── shared/                      # ✅ Shared resources
│   ├── types/
│   ├── constants/
│   └── assets/
├── package.json                 # ✅ Root package.json with workspaces
├── .gitignore                   # ✅ Root gitignore
└── README.md                    # ✅ Root README
```

---

## 🚀 Next Steps

### 1. Setup Astro Web (5 minutes)

```bash
# From monorepo root (appejv/)
chmod +x setup-astro-web.sh
./setup-astro-web.sh
```

This creates a public website at `appejv-web/` with:
- Homepage
- Products page
- About page
- Contact page
- Tailwind CSS configured
- Brand colors applied

### 2. Setup Go API (5 minutes)

```bash
# From monorepo root (appejv/)
chmod +x setup-go-api.sh
./setup-go-api.sh
```

This creates a REST API at `appejv-api/` with:
- Health check endpoint
- Orders CRUD endpoints
- Customers CRUD endpoints
- Products CRUD endpoints
- Reports endpoints
- CORS configured

### 3. Test Everything

```bash
# Install all dependencies
npm install

# Run all projects simultaneously
npm run dev:all
```

Visit:
- **Web**: http://localhost:4321
- **App**: http://localhost:3000
- **API**: http://localhost:8080/health

---

## 📋 Available Commands

From the monorepo root (`appejv/`):

```bash
# Development
npm run dev:web      # Start Astro website (port 4321)
npm run dev:app      # Start Next.js app (port 3000)
npm run dev:api      # Start Go API (port 8080)
npm run dev:all      # Start all projects simultaneously

# Build
npm run build:web    # Build Astro website
npm run build:app    # Build Next.js app
npm run build:api    # Build Go API binary

# Lint & Test
npm run lint         # Lint all workspaces
npm run test         # Test all workspaces
```

---

## 🔧 Configuration

### Environment Variables

Each project needs its own `.env.local`:

**appejv-app/.env.local** (Next.js):
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_service_key
```

**appejv-api/.env** (Go):
```env
PORT=8080
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

### Update Git Remote (if needed)

```bash
cd appejv
git remote set-url origin https://github.com/yourusername/appejv.git
```

---

## 📚 Documentation

- **MONOREPO-SETUP.md**: Complete monorepo architecture guide
- **MONOREPO-MIGRATION-STEPS.md**: Detailed step-by-step migration
- **appejv-app/README.md**: Next.js app documentation
- **appejv-web/README.md**: Astro website documentation
- **appejv-api/README.md**: Go API documentation

---

## 🎨 Shared Resources

### Using Shared Types

```typescript
// In appejv-app or appejv-web
import { Order, Customer, Product } from '../../shared/types'

const order: Order = {
  id: 1,
  customer_id: 1,
  sale_id: 'user-123',
  status: 'draft',
  total_amount: 1000000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}
```

### Using Shared Constants

```typescript
// In appejv-app or appejv-web
import { BRAND_COLORS, ORDER_STATUSES } from '../../shared/constants'

const primaryColor = BRAND_COLORS.primary // '#175ead'
const draftStatus = ORDER_STATUSES.DRAFT  // 'draft'
```

---

## 🚢 Deployment

### appejv-web (Astro)
```bash
cd appejv-web
npm run build
# Deploy dist/ to Vercel/Netlify
```

### appejv-app (Next.js)
```bash
cd appejv-app
npm run build
# Deploy to Railway/Vercel
```

### appejv-api (Go)
```bash
cd appejv-api
go build -o bin/server cmd/server/main.go
# Deploy binary to Railway/Fly.io
```

---

## 🐛 Troubleshooting

### Issue: "npm workspaces not working"
**Solution**: Ensure npm >= 7.0.0
```bash
npm --version
npm install -g npm@latest
```

### Issue: "Go not found"
**Solution**: Install Go >= 1.21
```bash
# macOS
brew install go

# Or download from https://go.dev/doc/install
```

### Issue: "Port already in use"
**Solution**: Kill the process or change port
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in package.json
```

### Issue: "Module not found in shared/"
**Solution**: Use relative imports
```typescript
// ✅ Correct
import { Order } from '../../shared/types'

// ❌ Wrong
import { Order } from 'shared/types'
```

---

## ✅ Migration Checklist

- [ ] Run `migrate-to-monorepo.sh` or follow manual steps
- [ ] Verify `appejv-app` still works: `npm run dev:app`
- [ ] Run `setup-astro-web.sh` to create website
- [ ] Run `setup-go-api.sh` to create API
- [ ] Test all projects: `npm run dev:all`
- [ ] Update environment variables
- [ ] Commit to Git
- [ ] Update deployment configurations

---

## 🎯 Success Criteria

You'll know the migration is successful when:

1. ✅ All three projects run simultaneously with `npm run dev:all`
2. ✅ appejv-app works at http://localhost:3000
3. ✅ appejv-web works at http://localhost:4321
4. ✅ appejv-api works at http://localhost:8080/health
5. ✅ Shared types/constants are accessible from all projects
6. ✅ Git repository is properly configured

---

## 📞 Need Help?

1. Check `MONOREPO-SETUP.md` for detailed architecture
2. Check `MONOREPO-MIGRATION-STEPS.md` for step-by-step guide
3. Check individual project READMEs for specific issues

---

## 🎉 What's Next?

After successful migration:

1. **Week 1**: Develop appejv-web pages
2. **Week 2**: Implement appejv-api endpoints
3. **Week 3**: Integrate API with appejv-app
4. **Week 4**: Start mobile apps (iOS/Android)
5. **Week 5+**: Feature development

---

**Created**: February 8, 2026  
**Last Updated**: February 8, 2026  
**Status**: Ready to use  
**Estimated Time**: 15-20 minutes total
