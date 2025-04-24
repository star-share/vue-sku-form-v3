import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 从环境变量获取基本URL或使用默认值
const base = process.env.BASE_URL || '/'

export default defineConfig({
  plugins: [vue()],
  base, // 设置基本公共路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`
      }
    }
  }
}) 