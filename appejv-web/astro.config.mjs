import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import partytown from '@astrojs/partytown'

export default defineConfig({
  integrations: [
    tailwind(), 
    react({
      // Enable SSR for React components but handle Three.js specially
      include: ['**/react/*', '**/components/**/*'],
    }),
    partytown({
      config: {
        forward: ['dataLayer.push', 'fbq', 'clarity'],
      },
    }),
  ],
  output: 'static',
  site: 'https://appejv.app',
  
  // Security Headers - Applied at build time for static hosting
  // For additional security, configure these at your CDN/edge (Cloudflare, Vercel, Nginx)
  compressHTML: true,
  
  // Performance Optimizations
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  
  // Build optimizations
  build: {
    inlineStylesheets: 'auto',
    assets: 'inline',
  },
  
  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
  
  // Vite optimizations
  vite: {
    build: {
      cssMinify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
    },
    ssr: {
      // External packages that should not be server-side rendered
      external: ['three', '@react-three/fiber', '@react-three/drei'],
    },
  },
})
