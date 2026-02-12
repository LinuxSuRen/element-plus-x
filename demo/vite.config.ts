import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    // Add library parent dir to resolve paths
    paths: {
      'element-plus-x': [resolve(__dirname, '../src')]
    }
  },
  // Base path for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/element-plus-x/' : '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Preserve module structure for element-plus-x
        manualChunks(id) {
          if (id === 'element-plus-x' || id.startsWith('element-plus-x/')) {
            return 'element-plus-x'
          }
        }
      }
    }
  }
})
