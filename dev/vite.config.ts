import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue-tree-list': fileURLToPath(new URL('../dist/vue-tree-list.es.js', import.meta.url)),
      'vue-tree-list/dist/style.css': fileURLToPath(new URL('../dist/vue-tree-list.css', import.meta.url)),
    },
  },
})
