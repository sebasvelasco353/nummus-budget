import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',   // Required: listen on all interfaces inside the container
    port: 5173,
    // HMR must know the external host so the browser WebSocket connects correctly
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    // In dev, proxy /api requests to the backend container so you
    // don't need CORS configuration during development
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
    },
  },
})