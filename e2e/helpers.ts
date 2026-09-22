import type { Page } from "@playwright/test";

//* dev 서버는 HMR 웹소켓 때문에 networkidle 이 오지 않으므로,
//* Suspense 로 스트리밍되는 마지막 콘텐츠(포트폴리오 카드)가 보일 때까지 기다립니다.
export async function gotoHome(page: Page) {
  await page.goto("/");
  await page.locator('a[href^="/portfolio/"]').first().waitFor();
  await page.locator('a[href*="velog.io/@jeongun1028/"]').first().waitFor();
  //* 진입 애니메이션(fade-up)이 끝난 뒤 위치를 측정합니다.
  await page.waitForTimeout(700);
}
