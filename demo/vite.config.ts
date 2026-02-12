import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    // In CI, add library parent dir to resolve paths
    // This allows 'element-plus-x' imports to work correctly
    ...(process.env.CI ? {
      dedupe: {
        'element-plus-x': resolve(__dirname, '../src')
      }
    } : {
      alias: {
        'element-plus-x': resolve(__dirname, '../src')
      }
    })
  },
  // Base path for GitHub Pages - change 'element-plus-x' to your repo name
  base: process.env.NODE_ENV === 'production' ? '/element-plus-x/' : '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
