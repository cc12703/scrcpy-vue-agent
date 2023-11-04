import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: 'dist_lib',
    lib: {
      entry: resolve(__dirname, './packages/index.ts'),
      name: 'scrcpy-agent',
      fileName: 'scrcpy-agent'
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
