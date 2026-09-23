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
    coverage: {
      provider: "v8",
      //* 테스트가 건드리지 않은 파일도 분모에 포함해야 실제 수치를 볼 수 있습니다.
      all: true,
      include: ["lib/**/*.ts", "app/components/**/*.tsx"],
      reporter: ["text-summary", "lcov"],
      //* 목표는 70%(핵심 로직 90%)이지만 현재는 33% 입니다.
      //* 우선 현재 수치를 하한선으로 고정해 회귀만 막고, #50 에서 테스트를 보강하며 단계적으로 올립니다.
      thresholds: {
        statements: 32,
        branches: 35,
        functions: 30,
        lines: 32,
      },
    },
  },
});
