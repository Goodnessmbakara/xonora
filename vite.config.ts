import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.CANISTER_ID_XONORA_BACKEND': JSON.stringify('uxrrr-q7777-77774-qaaaq-cai'),
    'process.env.DFX_NETWORK': JSON.stringify(mode === 'production' ? 'ic' : 'local'),
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/identity', '@dfinity/principal'],
  },
}));
