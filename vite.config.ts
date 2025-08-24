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
    // Environment variables with VITE_ prefix are automatically available to client code
    // VITE_CANISTER_ID_XONORA_BACKEND, VITE_NETWORK, and other VITE_* variables 
    // should be set in the deployment environment
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/identity', '@dfinity/principal'],
  },
}));
