import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { resolve } from "path";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return mergeConfig(
    defineTestConfig({
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "src/setupTests.js",
      },
      esbuild: {
        loader: "tsx",
        include: /.*\.[tj]sx?$/,
      },
      optimizeDeps: {
        esbuildOptions: {
          loader: {
            ".js": "jsx",
            ".ts": "ts",
            ".tsx": "tsx",
          },
        },
      },
      plugins: [react()],
      base: env.VITE_BASE_URL,
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, "index.basic.html"),
            hash: resolve(__dirname, "index.advanced.html"),
          },
        },
      },
    }),
  );
};
