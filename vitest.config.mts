import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  css: {
    // Next.js용 postcss.config.mjs(@tailwindcss/postcss)는 Vite에서 로드되지 않으므로
    // 테스트에서는 PostCSS를 거치지 않고 CSS Modules만 처리합니다.
    postcss: {},
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
