/// <reference types="vitest/globals" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,tsx,jsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.astro'],
    },
  },
})

