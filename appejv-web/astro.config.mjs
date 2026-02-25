import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import partytown from '@astrojs/partytown'

export default defineConfig({
  integrations: [
    tailwind(), 
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push', 'fbq', 'clarity'],
      },
    }),
  ],
  output: 'static',
  site: 'https://appejv.app',
  
  // Performance Optimizations
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport', // Prefetch links when they enter viewport
  },
  
  // Build optimizations
  build: {
    inlineStylesheets: 'auto', // Inline small CSS files
  },
  
  // Vite optimizations
  vite: {
    build: {
      cssMinify: 'esbuild', // Fast CSS minification
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          },
        },
      },
    },
  },
})
