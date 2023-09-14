import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // with options: http://localhost:5173/api/bar-> http://localhost:3055/bar
      '/api': {
        target: 'http://localhost:3055',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:3055',
        ws: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // with RegEx: http://localhost:5173/fallback/ -> http://localhost:3055/
      '^/fallback/.*': {
        target: 'http://localhost:3055',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly"
    }
  }
})
