import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Le site parle directement à Supabase : aucun serveur local à relayer.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
