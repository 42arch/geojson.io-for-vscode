import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {}
      }
    }
  },
  build: {
    outDir: 'out/view',
    rollupOptions: {
      input: '/src/view/index.tsx',
      output: {
        entryFileNames: 'bundle.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/style.css'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
