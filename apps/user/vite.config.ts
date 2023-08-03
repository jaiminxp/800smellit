/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { resolve } from 'path'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/user',

  server: {
    port: 3001,
    host: 'localhost',
  },

  preview: {
    port: 3001,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths()],

  resolve: {
    alias: {
      '@': resolve(__dirname, '/src'),
      '@config': resolve(__dirname, '/src/config'),
      '@scenes': resolve(__dirname, '/src/scenes'),
    },
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  define: {
    'import.meta.vitest': undefined,
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
