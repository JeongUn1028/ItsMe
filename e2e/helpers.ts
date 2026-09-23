import type { Page } from "@playwright/test";

//* dev 서버는 HMR 웹소켓 때문에 networkidle 이 오지 않으므로,
//* Suspense 로 스트리밍되는 콘텐츠가 보일 때까지 기다립니다.
export async function gotoHome(page: Page) {
  await page.goto("/");
  await page.locator('a[href^="/portfolio/"]').first().waitFor();
  //* Velog 목록은 외부 API 결과라 비어 있을 수 있습니다. 로딩만 끝나면 됩니다.
  const velogPost = page.locator('a[href*="velog.io/@jeongun1028/"]').first();
  const velogEmpty = page.getByText("최근 게시물이 없습니다");
  await velogPost.or(velogEmpty).first().waitFor();
  //* 진입 애니메이션(fade-up)이 끝난 뒤 위치를 측정합니다.
  await page.waitForTimeout(700);
}

//* Velog 포스트가 실제로 렌더됐는지 (외부 API 응답 여부에 따라 달라집니다)
export async function hasVelogPosts(page: Page) {
  return (await page.locator('a[href*="velog.io/@jeongun1028/"]').count()) > 0;
}
