/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for this mode (development/production)
  // loadEnv returns values as strings; prefix filter is '' to get all VITE_ vars
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@k2-saas': resolve(__dirname, '../../packages')
      }
    },
    server: {
      proxy: {
        '/api': {
          // Use loaded env value (fallback to localhost if missing)
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxying:', req.method, req.url, '→', proxyReq.path);
            });
          },
        },
      },
    },
  };
});
