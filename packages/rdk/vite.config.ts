import { resolve } from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Vite configuration.
 * @see https://vite.dev/config
 */
const viteConfig = defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["**/*.test.*", "**/*.spec.*"],
      outDir: "build",
    }),
  ],
  build: {
    outDir: "build",
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        fiducial: resolve(__dirname, "src/fiducial/index.ts"),
        geolocation: resolve(__dirname, "src/geolocation/index.ts"),
        immersive: resolve(__dirname, "src/immersive/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    minify: mode === "production",
    rollupOptions: {
      external: (id) =>
        [
          "react",
          "react-dom",
          "three",
          "@ar-js-org/ar.js",
          "locar",
          "@react-three/fiber",
          "@react-three/xr",
        ].some((ext) => id === ext || id.startsWith(`${ext}/`)),
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          three: "THREE",
          "@react-three/fiber": "ReactThreeFiber",
          "@ar-js-org/ar.js": "ARjs",
          "@react-three/xr": "ReactThreeXR",
          locar: "LocAR",
        },
      },
    },
  },
}));

export default viteConfig;
