import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
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
