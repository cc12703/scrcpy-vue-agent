import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],

  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, './packages/index.ts'),
      name: 'scrcpy-vue-agent',
      fileName: 'scrcpy-vue-agent'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
          globals: {
              vue: 'Vue'
          }
      }
    }
  }
})
