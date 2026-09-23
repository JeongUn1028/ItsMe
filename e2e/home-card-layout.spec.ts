import { expect, test } from "@playwright/test";
import { gotoHome, hasVelogPosts } from "./helpers";

//* 캡처 점검에서 드러난 홈의 레이아웃 어색함을 고정한다. (#69)

test("모든 프로젝트 카드에서 글 영역이 카드 폭의 절반 이상을 차지한다", async ({
  page,
}) => {
  await gotoHome(page);

  const cards = page.locator('a[href^="/portfolio/"]');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    const card = cards.nth(index);
    const cardBox = (await card.boundingBox())!;
    //* 제목·요약·태그를 감싼 영역. 썸네일과 좌우로 나뉘면 폭이 절반 아래로 떨어진다.
    const infoBox = (await card.locator("h2").locator("..").boundingBox())!;

    expect(infoBox.width).toBeGreaterThanOrEqual(cardBox.width * 0.5);
  }
});

test("프로젝트 카드 제목이 잘리지 않는다", async ({ page }) => {
  await gotoHome(page);

  const titles = page.locator('a[href^="/portfolio/"] h2');
  const count = await titles.count();

  for (let index = 0; index < count; index += 1) {
    const isClipped = await titles.nth(index).evaluate((element) => {
      //* 말줄임(…)이 걸리면 실제 글자 크기가 보이는 영역보다 크다.
      return (
        element.scrollWidth > element.clientWidth + 1 ||
        element.scrollHeight > element.clientHeight + 1
      );
    });
    expect(isClipped).toBe(false);
  }
});

test("Velog 목록에서 태그와 작성일이 같은 줄에 놓인다", async ({ page }) => {
  await gotoHome(page);
  test.skip(!(await hasVelogPosts(page)), "Velog API 응답이 없으면 건너뜁니다");

  const rows = page.locator('a[href*="velog.io/@jeongun1028/"]');
  const count = await rows.count();
  let checked = 0;

  for (let index = 0; index < count; index += 1) {
    const row = rows.nth(index);
    const chips = row.locator(".chip");
    //* 태그가 없는 글은 비교할 기준 줄이 없으므로 건너뜁니다.
    if ((await chips.count()) === 0) continue;
    const tagBox = (await chips.first().boundingBox())!;

    //* 날짜는 행의 마지막 텍스트다.
    const dateBox = (await row.locator("p").last().boundingBox())!;
    const dateCenter = dateBox.y + dateBox.height / 2;

    expect(dateCenter).toBeGreaterThan(tagBox.y);
    expect(dateCenter).toBeLessThan(tagBox.y + tagBox.height);
    checked += 1;
  }

  expect(checked).toBeGreaterThan(0);
});

test("CONTACT 에 이메일과 GitHub · Velog · 이력서 경로가 함께 있다", async ({
  page,
}) => {
  await gotoHome(page);

  //* Hero 에도 같은 링크가 있으므로 CONTACT 카드 안으로 범위를 좁힌다.
  const contact = page.getByRole("region", { name: "CONTACT" });

  await expect(contact.locator('a[href^="mailto:"]')).toBeVisible();
  await expect(contact.locator('a[href*="github.com/JeongUn1028"]')).toBeVisible();
  await expect(contact.locator('a[href*="velog.io"]')).toBeVisible();
  await expect(contact.locator('a[href$=".pdf"]')).toBeVisible();
});
