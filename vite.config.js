import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/',

  server: {
    port: 3000,
    open: true,
    strictPort: true,      // falla si el puerto está ocupado en vez de cambiar
    cors: true,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,       // útil para debug en producción
    minify: 'esbuild',
  },

  preview: {
    port: 4000,
    open: true,
  },
})