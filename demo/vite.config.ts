import { Plugin } from 'vite'
import { resolve } from 'path'
import type { Rollup } from 'rollup'

/**
 * Vite plugin to handle element-plus-x library imports
 * Transforms 'element-plus-x' imports to use proper relative paths
 */
export function elementPlusXPlugin(): Plugin {
  return {
    name: 'element-plus-x-imports',
    config() {
      return {
        build: {
          rollupOptions: {
            output: {
              // Inline the library as ESM in the bundle
              manualChunks(id) {
                if (id === 'element-plus-x' || id.startsWith('element-plus-x/')) {
                  return 'element-plus-x'
                }
              }
            }
          }
        }
      }
    },
    transform(code, id) {
      // Transform element-plus-x imports to use proper relative paths
      if (id.endsWith('.vue') || id.endsWith('.ts')) {
        return code
          .replace(
            /from ['"]element-plus-x['"]/g,
            'from "${
              id.startsWith('element-plus-x/')
                ? '../src'
                : id.startsWith('element-plus-x/')
                  ? '../src/'
                  : '../src/'
            }"'
          )
      }
      return code
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    elementPlusXPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
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
    sourcemap: false
  }
})
