import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // 生产环境移除console
    minify: 'esbuild',
    target: 'esnext'
  },
  esbuild: {
    // 生产环境移除console和debugger
    drop: ['console', 'debugger']
  }
})
