import { resolve, join } from 'node:path'
import { create } from 'tar'
import { readdirSync, rmSync, renameSync } from 'node:fs'
import { defineConfig } from 'vite'

function packDist(archiveName) {
  let outDir
  return {
    name: 'pack-dist',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    async closeBundle() {
      const tmp = `.${archiveName}.tmp`
      const entries = readdirSync(outDir)

      // внутри архива всё лежит в папке dist/
      await create({ gzip: true, file: tmp, cwd: outDir }, entries)

      // чистим dist и оставляем только архив
      for (const e of entries) rmSync(join(outDir, e), { recursive: true, force: true })
      renameSync(tmp, join(outDir, archiveName))
    },
  }
}

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
  },
  plugins: [
    packDist('placeholder.tar.gz')
  ],
})