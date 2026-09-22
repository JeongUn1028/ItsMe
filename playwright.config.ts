import { defineConfig, devices } from "@playwright/test";

//* E2E 는 시스템 Chrome 을 사용합니다 (브라우저 별도 다운로드 없음).
//* 실행: npm run test:e2e  (dev 서버를 자동으로 띄웁니다)
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  //* dev 서버 하나를 공유하므로 동시 실행 수를 제한합니다.
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3456",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "NEXT_DIST_DIR=.next-dev npm run dev -- -p 3456",
    url: "http://localhost:3456",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "mobile",
      //* iPhone 프리셋은 WebKit 이라 Chrome 으로 실행할 수 없어, Chromium 계열 프리셋에 iPhone 폭을 적용합니다.
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 390, height: 844 },
        channel: "chrome",
      },
    },
  ],
});
