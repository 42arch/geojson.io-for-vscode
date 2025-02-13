import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'out',
    lib: {
      entry: '/src/extension.ts',
      formats: ['cjs'],
      fileName: 'extension'
    },
    rollupOptions: {
      external: ['vscode', 'path']
    },
    sourcemap: true
  }
})
