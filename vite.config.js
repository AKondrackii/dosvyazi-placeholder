import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'mpa',
  root: 'src',
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    },
    hmr: {
      host: 'localhost',
      port: 3000
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
      },
      output: {
        entryFileNames: 'js/[name].[hash].min.js',
        chunkFileNames: 'js/[name].[hash].min.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0]?.endsWith('.css'))
            return 'css/[name].[hash].min.css'

          return 'assets/[name][extname]'
        }
      }
    }
  }
})