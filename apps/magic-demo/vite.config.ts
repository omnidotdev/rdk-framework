import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Vite configuration.
 * @see https://vite.dev/config
 */
const viteConfig = defineConfig({
  plugins: [react(), mkcert(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  publicDir: "public",
  resolve: {
    alias: {
      react: "react",
      "react-dom": "react-dom",
      three: "three",
      "@react-three/fiber": "@react-three/fiber",
    },
  },
});

export default viteConfig;
