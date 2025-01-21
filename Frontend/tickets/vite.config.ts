import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'jwt-decode': '/node_modules/jwt-decode',
    },
  },
  server: {
    host: '0.0.0.0', // Bind to all interfaces
  },
})
