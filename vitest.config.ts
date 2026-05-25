import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        include: ["src/features/**/*.{ts,tsx}", "src/shared/**/*.{ts,tsx}"],
        exclude: ["**/*.mock.ts", "**/*.types.ts", "**/__tests__/**"],
      },
    },
  })
);
