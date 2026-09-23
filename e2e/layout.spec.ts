import { expect, test } from "@playwright/test";
import { gotoHome, hasVelogPosts } from "./helpers";

//* 레이아웃 회귀: 뷰포트 밖으로 넘치는 요소, 카드 밖으로 넘치는 콘텐츠를 잡습니다.

test("페이지가 가로로 넘치지 않는다", async ({ page }) => {
  await gotoHome(page);

  const { docW, vw } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
  }));
  expect(docW).toBeLessThanOrEqual(vw);

  //* 뷰포트보다 넓은 요소가 하나도 없어야 합니다.
  const wide = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .map((el) => `${el.tagName}.${el.className}`)
      .slice(0, 5),
  );
  expect(wide).toEqual([]);
});

test("헤더 제목이 한 줄로 표시된다", async ({ page }) => {
  await gotoHome(page);
  const title = page.getByRole("link", { name: "LEEJEONGUN.COM" });
  const { height, lineHeight } = await title.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      height: el.getBoundingClientRect().height,
      lineHeight: parseFloat(cs.fontSize) * 1.1,
    };
  });
  expect(height).toBeLessThan(lineHeight * 1.8);
});

test("홈 카드 내용이 카드 밖으로 넘치지 않는다", async ({ page }) => {
  await gotoHome(page);
  //* Velog 카드: 마지막 포스트의 아래쪽이 카드 아래쪽 안에 있어야 합니다.
  //* 외부 API 가 비어 있으면 검증할 대상이 없으므로 건너뜁니다.
  test.skip(!(await hasVelogPosts(page)), "Velog 포스트가 없어 건너뜁니다");
  const card = page.locator(".glass", { hasText: "VELOG POSTS" }).first();
  const lastPost = card.locator('a[href*="velog.io"]').last();
  await expect(lastPost).toBeVisible();
  const cardBox = (await card.boundingBox())!;
  const postBox = (await lastPost.boundingBox())!;
  expect(postBox.y + postBox.height).toBeLessThanOrEqual(
    cardBox.y + cardBox.height + 1,
  );
});

test("연락처는 mailto 링크로 제공된다", async ({ page }) => {
  await gotoHome(page);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
});
