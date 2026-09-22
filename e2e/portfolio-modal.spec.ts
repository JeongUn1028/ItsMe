import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

test("포트폴리오 카드는 키보드로 열고 Esc 로 닫을 수 있다", async ({
  page,
}) => {
  await gotoHome(page);

  const card = page.locator('a[href^="/portfolio/"]').first();
  const href = await card.getAttribute("href");
  await card.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  //* 열린 직후 포커스가 다이얼로그 안으로 이동해야 합니다.
  await expect(dialog).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("URL 로 직접 진입하면 모달이 아닌 페이지로 렌더된다", async ({
  page,
}) => {
  await page.goto("/portfolio/itsme");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { level: 1, name: /포트폴리오/ }),
  ).toBeVisible();
});

test("Velog 글이 없는 포트폴리오는 Velog 아이콘을 표시하지 않는다", async ({
  page,
}) => {
  await page.goto("/portfolio/one-bite-books");
  await page.waitForSelector("article");
  await expect(page.locator('article header a[href*="github.com"]')).toHaveCount(1);
  await expect(page.locator('article header a[href*="velog.io"]')).toHaveCount(0);
  //* 빈 href 링크가 남아 있으면 안 됩니다.
  await expect(page.locator('article a[href=""]')).toHaveCount(0);
});
