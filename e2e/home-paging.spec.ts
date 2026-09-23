import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* 넓은 화면(≥1440px)만 좌우 페이지 넘김, 그 아래는 세로 스크롤을 유지한다. (#65)
//* 1440px 미만에서는 한 페이지 콘텐츠가 뷰포트를 넘겨 페이지 안에서 또 스크롤해야 하므로 켜지 않는다.

const DECK = "[data-home-deck]";

//* HomeDeck 은 클라이언트 컴포넌트라 하이드레이션 후에야 페이지를 복원한다.
//* SSR HTML 만 보고 측정하면 아직 scrollLeft 가 0 이다.
async function waitForActivePage(
  page: import("@playwright/test").Page,
  label: RegExp,
) {
  //* dev 서버가 부하를 받으면 하이드레이션이 5초를 넘기기도 한다.
  //* CI 는 프로덕션 빌드를 띄우므로 훨씬 빠르다.
  await expect(page.getByRole("button", { name: label })).toHaveAttribute(
    "aria-current",
    "true",
    { timeout: 15_000 },
  );
}

test.describe("넓은 화면 페이징", () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) < 1440,
    "1440px 이상에서만 페이징",
  );

  test("도트를 누르면 페이지가 바뀌고 URL 에 반영된다", async ({ page }) => {
    await gotoHome(page);

    const deck = page.locator(DECK);
    await expect(deck).toBeVisible();
    expect(await deck.evaluate((el) => el.scrollLeft)).toBe(0);

    await page.getByRole("button", { name: /글 · 연락처/ }).click();
    await expect(page).toHaveURL(/[?&]page=contact/);
    await expect
      .poll(async () => deck.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(100);
  });

  test("page 파라미터로 들어가면 해당 페이지에서 시작한다", async ({ page }) => {
    await page.goto("/?page=contact");
    await page.locator('a[href*="velog.io/@jeongun1028"]').first().waitFor();
    await waitForActivePage(page, /글 · 연락처 페이지로 이동/);

    const deck = page.locator(DECK);
    await expect
      .poll(async () => deck.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(100);
  });

  test("새로고침해도 같은 페이지가 유지된다", async ({ page }) => {
    await gotoHome(page);
    await page.getByRole("button", { name: /글 · 연락처/ }).click();
    await expect(page).toHaveURL(/[?&]page=contact/);

    await page.reload();
    await page.locator('a[href^="/portfolio/"]').first().waitFor();
    await waitForActivePage(page, /글 · 연락처 페이지로 이동/);

    const deck = page.locator(DECK);
    await expect
      .poll(async () => deck.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(100);
  });

  test("키보드 방향키로 페이지를 넘길 수 있다", async ({ page }) => {
    await gotoHome(page);

    const deck = page.locator(DECK);
    await deck.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/[?&]page=contact/);

    await page.keyboard.press("ArrowLeft");
    await expect
      .poll(async () => deck.evaluate((el) => el.scrollLeft))
      .toBeLessThan(100);
  });

  test("첫 페이지에서 이름과 대표 프로젝트를 함께 볼 수 있다", async ({ page }) => {
    await gotoHome(page);

    //* #63 에서 만든 위계가 페이징 후에도 유지되어야 한다.
    await expect(page.getByRole("heading", { name: "이정운" })).toBeInViewport();
    await expect(
      page.getByRole("heading", { name: "대표 프로젝트" }),
    ).toBeInViewport();
    await expect(page.locator('a[href^="/portfolio/"]').first()).toBeInViewport();
  });
});

test.describe("좁은 화면 세로 스크롤", () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) >= 1440,
    "1440px 미만에서만 세로 스크롤",
  );

  test("가로 페이징 컨트롤을 노출하지 않는다", async ({ page }) => {
    await gotoHome(page);

    await expect(page.getByRole("button", { name: /페이지로 이동/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /이전 페이지|다음 페이지/ })).toHaveCount(0);
  });

  test("세로로 스크롤되며 가로로는 넘치지 않는다", async ({ page }) => {
    await gotoHome(page);

    const { docWidth, viewportWidth, docHeight, viewportHeight } =
      await page.evaluate(() => ({
        docWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        docHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
      }));

    expect(docWidth).toBeLessThanOrEqual(viewportWidth);
    //* 콘텐츠가 한 화면보다 길어 세로 스크롤이 존재해야 한다.
    expect(docHeight).toBeGreaterThan(viewportHeight);
  });

  test("연락처가 대표 프로젝트보다 아래에 온다", async ({ page }) => {
    await gotoHome(page);

    const card = (await page.locator('a[href^="/portfolio/"]').first().boundingBox())!;
    const contact = (await page.getByRole("heading", { name: "CONTACT" }).boundingBox())!;
    expect(card.y).toBeLessThan(contact.y);
  });
});
