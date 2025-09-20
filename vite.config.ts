import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Garantir que as variáveis de ambiente sejam incluídas no build
    'process.env.VITE_REPLICATE_API_TOKEN': JSON.stringify(process.env.VITE_REPLICATE_API_TOKEN),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});