import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      //* 서버 전용 모듈의 단위 테스트를 위해 server-only 를 빈 모듈로 대체합니다.
      "server-only": new URL("./__tests__/stubs/server-only.ts", import.meta.url)
        .pathname,
    },
  },
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
