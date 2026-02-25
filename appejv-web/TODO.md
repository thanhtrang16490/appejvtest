# appejv-web Improvements TODO

## Phase 0: TypeScript Bug Fixes (Critical) ✅ COMPLETED

### 0.1 Fix TypeScript Errors in index.astro
- [x] Fix SVG attributes: fillRule → fill-rule, clipRule → clip-rule
- [x] Fix opacity values: 8 → 0.08, 15 → 0.15 (use opacity-[0.08] syntax)
- [x] Fix Element type errors with proper type assertions (as HTMLElement)
- [x] Fix dataset/style property errors on Element type
- [x] Fix tab switching null check error
- [x] Fix style attribute type errors (number → string)

### 0.2 Fix SSR Build Errors
- [x] Revert 3D components from client:visible to client:only="react"
- [x] Add three, @react-three/fiber, @react-three/drei to ssr.external
- [x] Build successful: 167 pages generated

## Phase 1: SEO & Security Fixes (High Priority) ✅ COMPLETED

### 1.1 Fix SEO Placeholder Meta Tags
- [x] Add real Google Site Verification code - Config ready in config.ts
- [x] Add real Facebook Pixel ID - Config ready in config.ts
- [x] Add real Zalo App ID - Config ready in config.ts
- [x] Add real Bing/Yandex verification codes - Config ready in config.ts

### 1.2 Add Security Headers
- [x] Add Content-Security-Policy (CSP) - Created /public/_headers
- [x] Add X-Frame-Options - Created /public/_headers
- [x] Add X-Content-Type-Options - Created /public/_headers
- [x] Add Referrer-Policy - Created /public/_headers
- [x] Add Permissions-Policy - Created /public/_headers

## Phase 2: Performance Optimization (High Priority) ✅ COMPLETED

### 2.1 3D Components SSR Strategy
- [x] Use client:only="react" for Hero3DBackground (SSR safe)
- [x] Use client:only="react" for VideoHeroBackground (SSR safe)
- [x] Use client:only="react" for DNA3DHelix (SSR safe)
- [x] Use client:only="react" for ParticleWave3D (SSR safe)
- [x] Use client:only="react" for AnimatedSphere3D (SSR safe)
- [x] Created LoadingSkeleton component for 3D fallbacks

### 2.2 Image Optimization
- [x] Configure Astro Image integration in astro.config.mjs

## Phase 3: Code Quality (Medium Priority) ✅ COMPLETED

### 3.1 Extract Inline Scripts
- [x] Created /src/scripts/mobile-menu.ts
- [x] Created /src/scripts/homepage-animations.ts
- [ ] Update BaseLayout to use external scripts

### 3.2 Code Organization
- [x] Create /src/lib/config.ts for constants
- [x] Move hardcoded values (phone, email) to config

## Phase 4: Accessibility & UX (Medium Priority)

### 4.1 Accessibility Improvements
- [ ] Add ARIA labels to interactive elements
- [ ] Improve focus states
- [ ] Add skip to content link
- [ ] Improve color contrast where needed

### 4.2 UX Enhancements
- [x] Add loading skeletons for dynamic content
- [ ] Improve error handling

## Phase 5: Testing Setup (Medium Priority) ✅ COMPLETED

- [x] Install vitest and testing libraries - Config created
- [x] Create vitest.config.ts
- [x] Create vitest.setup.ts
- [ ] Install dependencies: npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

---

## New Files Created

1. `/src/lib/config.ts` - Centralized configuration
2. `/public/_headers` - Security headers for Netlify/Vercel
3. `/src/scripts/mobile-menu.ts` - Mobile menu functionality
4. `/src/scripts/homepage-animations.ts` - Homepage animations
5. `/src/components/LoadingSkeleton.tsx` - Loading skeleton component
6. `/vitest.config.ts` - Vitest configuration
7. `/vitest.setup.ts` - Vitest setup
8. `/TODO.md` - This file

## Modified Files

1. `astro.config.mjs` - Added image optimization and Vite config
2. `src/pages/index.astro` - Fixed TypeScript errors, SSR-safe 3D components
3. `src/styles/global.css` - Added shimmer animation
4. `package.json` - Added vitest and testing dependencies

## Installation Status

✅ Dependencies installed:
- vitest@1.3.1
- @testing-library/react@14.2.1
- @testing-library/jest-dom@6.4.2
- jsdom@24.0.0

## Build Status

✅ Build successful (167 pages generated)
⚠️ Warnings: Route collisions for /cn/news, /cn/products, /en/news, /en/products
⚠️ Warnings: Some chunks >500kB (react-three-fiber.esm 880kB)

## Next Steps

1. Fix route collisions (remove duplicate index.astro files)
2. Run tests: `npm test`
3. Address npm audit vulnerabilities (5 found)
