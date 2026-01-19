import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '_redirects',
          dest: '.',
        },
      ],
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/agc': {
        target: process.env.VITE_VICI,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/agc/, ''), // Ajuste de la ruta
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
   build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Dividiendo las dependencias grandes en chunks separados
          'vendor': ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 3000, // Opcional: ajusta el límite de advertencia de tamaño
  },
});
