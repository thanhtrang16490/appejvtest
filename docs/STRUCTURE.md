# Project Structure

Cấu trúc tổ chức dự án APPE JV Monorepo.

## 📁 Root Structure

```
appejv/
├── README.md                    # Project overview
├── SUMMARY.md                   # Project summary
├── REORGANIZATION.md            # Documentation reorganization log
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package config
│
├── docs/                        # 📚 All documentation
│   ├── README.md               # Docs overview
│   ├── INDEX.md                # Full documentation index
│   ├── QUICK-START.md          # Quick start guide
│   ├── TESTING.md              # Testing guide
│   ├── STRUCTURE.md            # This file
│   ├── guides/                 # Detailed guides
│   ├── testing/                # Test scripts
│   └── archive/                # Old documentation
│
├── appejv-api/                  # 🔧 Backend API (Go Fiber)
│   ├── cmd/server/             # Entry points
│   ├── internal/               # Business logic
│   ├── pkg/                    # Shared packages
│   ├── .env                    # API environment
│   ├── go.mod                  # Go dependencies
│   └── README.md               # API documentation
│
├── appejv-app/                  # 💼 Internal App (Next.js)
│   ├── app/                    # Pages & routes
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   ├── public/                 # Static assets
│   ├── .env.local              # App environment
│   ├── package.json            # App dependencies
│   └── README.md               # App documentation
│
├── appejv-web/                  # 🌐 Public Website (Astro)
│   ├── src/                    # Source code
│   │   ├── pages/              # Pages
│   │   ├── components/         # Components
│   │   ├── layouts/            # Layouts
│   │   └── lib/                # Utilities
│   ├── public/                 # Static assets
│   ├── .env                    # Web environment
│   ├── package.json            # Web dependencies
│   └── README.md               # Web documentation
│
├── shared/                      # 🔄 Shared code (future)
│   ├── types/                  # TypeScript types
│   ├── constants/              # Constants
│   └── assets/                 # Shared assets
│
└── test-*.sh                    # 🔗 Symlinks to test scripts
```

## 📚 Documentation Structure

```
docs/
├── README.md                    # Docs overview
├── INDEX.md                     # Full index
├── QUICK-START.md              # Quick start
├── TESTING.md                  # Testing guide
├── STRUCTURE.md                # This file
│
├── guides/                      # 📖 Detailed guides
│   ├── FIBER-MIGRATION-COMPLETE.md
│   ├── WEB-API-INTEGRATION-COMPLETE.md
│   └── FIBER-APP-TEST-RESULTS.md
│
├── testing/                     # 🧪 Test scripts
│   ├── test-web-api-integration.sh
│   ├── test-fiber-app-integration.sh
│   ├── test-with-login.sh
│   └── test-auth-flow.sh
│
└── archive/                     # 📦 Old documentation
    ├── API-APP-INTEGRATION-TEST.md
    ├── MIGRATION-SUMMARY.md
    ├── MONOREPO-*.md
    └── ...
```

## 🔧 API Structure (appejv-api)

```
appejv-api/
├── cmd/
│   └── server/                  # Entry points
│       ├── main-fiber.go       # Main server (current)
│       ├── main-test.go        # Test server
│       └── main-*.go           # Other variants
│
├── internal/                    # Private code
│   ├── config/                 # Configuration
│   ├── fiber/                  # Fiber-specific
│   │   ├── handlers/           # HTTP handlers
│   │   └── middleware/         # Middleware
│   ├── handlers/               # Legacy handlers
│   ├── middleware/             # Legacy middleware
│   └── models/                 # Data models
│
├── pkg/                         # Public packages
│   └── database/               # Database client
│       └── supabase.go
│
├── .env                         # Environment config
├── go.mod                       # Go dependencies
├── go.sum                       # Dependency checksums
├── Makefile                     # Build commands
├── Dockerfile                   # Docker config
├── README.md                    # API docs
└── SETUP.md                     # Setup guide
```

## 💼 App Structure (appejv-app)

```
appejv-app/
├── app/                         # Next.js App Router
│   ├── auth/                   # Auth pages
│   │   ├── login/
│   │   └── customer-login/
│   ├── customer/               # Customer pages
│   │   ├── dashboard/
│   │   ├── orders/
│   │   └── profile/
│   ├── sales/                  # Sales pages
│   │   ├── customers/
│   │   ├── orders/
│   │   ├── inventory/
│   │   ├── reports/
│   │   └── users/
│   ├── api/                    # API routes
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── layout/                 # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── ConditionalBottomNav.tsx
│   ├── sales/                  # Sales components
│   ├── customer/               # Customer components
│   ├── cart/                   # Cart components
│   └── ui/                     # UI components (shadcn)
│
├── lib/                         # Utilities
│   ├── api/                    # API clients
│   ├── auth/                   # Auth helpers
│   ├── hooks/                  # React hooks
│   ├── providers/              # Context providers
│   ├── queries/                # React Query
│   ├── security/               # Security utilities
│   ├── store/                  # State management
│   └── supabase/               # Supabase clients
│
├── public/                      # Static assets
├── types/                       # TypeScript types
├── .env.local                   # Environment config
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## 🌐 Web Structure (appejv-web)

```
appejv-web/
├── src/
│   ├── pages/                   # Pages (file-based routing)
│   │   ├── index.astro         # Homepage
│   │   ├── gioi-thieu.astro    # About
│   │   ├── lien-he.astro       # Contact
│   │   └── san-pham/           # Products
│   │       ├── index.astro     # Product list
│   │       └── [slug].astro    # Product detail
│   │
│   ├── components/              # Components
│   │   ├── EcosystemOrbit3D.tsx
│   │   ├── EcosystemOrbit3DWrapper.tsx
│   │   └── YouTubePlayer.astro
│   │
│   ├── layouts/                 # Layouts
│   │   └── BaseLayout.astro
│   │
│   ├── lib/                     # Utilities
│   │   ├── api.ts              # API client
│   │   └── supabase.ts         # Supabase client (legacy)
│   │
│   └── styles/                  # Styles
│       └── global.css
│
├── public/                      # Static assets
│   ├── *.png                   # Images
│   ├── *.svg                   # SVG files
│   └── manifest.json           # PWA manifest
│
├── .env                         # Environment config
├── astro.config.mjs             # Astro config
├── tailwind.config.mjs          # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## 🔄 Shared Structure (Future)

```
shared/
├── types/                       # Shared TypeScript types
│   └── index.ts
├── constants/                   # Shared constants
│   └── index.ts
└── assets/                      # Shared assets
```

## 🧪 Test Scripts

Located in `docs/testing/` with symlinks in root:

```
docs/testing/
├── test-web-api-integration.sh      # Web + API tests
├── test-fiber-app-integration.sh    # App + API tests
├── test-with-login.sh               # Auth flow tests
└── test-auth-flow.sh                # Auth tests

Root symlinks:
├── test-web-api-integration.sh → docs/testing/
├── test-fiber-app-integration.sh → docs/testing/
└── test-with-login.sh → docs/testing/
```

## 📝 Configuration Files

### Root Level
- `.env.example` - Environment template
- `.gitignore` - Git ignore rules
- `package.json` - Root package config
- `package-lock.json` - Dependency lock

### API Level
- `appejv-api/.env` - API environment
- `appejv-api/go.mod` - Go dependencies
- `appejv-api/Makefile` - Build commands
- `appejv-api/Dockerfile` - Docker config

### App Level
- `appejv-app/.env.local` - App environment
- `appejv-app/next.config.ts` - Next.js config
- `appejv-app/tailwind.config.ts` - Tailwind config
- `appejv-app/tsconfig.json` - TypeScript config

### Web Level
- `appejv-web/.env` - Web environment
- `appejv-web/astro.config.mjs` - Astro config
- `appejv-web/tailwind.config.mjs` - Tailwind config
- `appejv-web/tsconfig.json` - TypeScript config

## 🎯 Key Principles

### 1. Separation of Concerns
- API: Business logic & data access
- App: Internal management UI
- Web: Public-facing website

### 2. Documentation Organization
- Current docs in `docs/guides/`
- Test scripts in `docs/testing/`
- Old docs in `docs/archive/`

### 3. Environment Configuration
- Each project has its own `.env`
- Template in `.env.example`
- Never commit actual `.env` files

### 4. Code Organization
- `internal/` for private code
- `pkg/` for public packages
- `lib/` for utilities
- `components/` for UI components

## 🔗 Related Documentation

- [README.md](../README.md) - Project overview
- [SUMMARY.md](../SUMMARY.md) - Project summary
- [docs/INDEX.md](INDEX.md) - Full documentation index
- [docs/QUICK-START.md](QUICK-START.md) - Quick start guide

---

**Last Updated:** 9/2/2026
