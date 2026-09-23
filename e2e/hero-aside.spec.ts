import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* Hero 오른쪽 영역은 "무엇을 다루는가(기술)"와 "눌러서 확인하라(행동)"가
//* 한 덩어리로 보이지 않아야 하고, 카드 아래쪽을 비워 두지 않아야 한다. (#69)

const isTwoColumn = (width: number) => width >= 1024;

test("주력 기술 묶음에 이름표가 붙는다", async ({ page }) => {
  await gotoHome(page);

  await expect(page.getByText("주력 기술")).toBeVisible();
});

test("이력서 버튼은 기술 칩보다 눈에 띄게 크다", async ({ page }) => {
  await gotoHome(page);

  const chip = (await page.locator("li.chip").first().boundingBox())!;
  const resume = (await page
    .getByRole("link", { name: "이력서 PDF" })
    .first()
    .boundingBox())!;

  expect(resume.height).toBeGreaterThanOrEqual(chip.height * 1.25);
});

test("2열 배치에서 행동 버튼이 카드 아래쪽에 자리잡는다", async ({
  page,
  viewport,
}) => {
  test.skip(!isTwoColumn(viewport?.width ?? 0), "2열이 되는 1024px 이상만");

  await gotoHome(page);

  const card = (await page
    .locator('section[aria-labelledby="hero-name"]')
    .boundingBox())!;
  const resume = (await page
    .getByRole("link", { name: "이력서 PDF" })
    .first()
    .boundingBox())!;
  const chip = (await page.locator("li.chip").first().boundingBox())!;

  //* 기술 칩은 위, 버튼은 아래.
  expect(resume.y).toBeGreaterThan(chip.y);
  //* 카드 바닥까지 남는 공간이 패딩 수준이어야 한다. 예전에는 140px 넘게 비어 있었다.
  const gap = card.y + card.height - (resume.y + resume.height);
  expect(gap).toBeLessThanOrEqual(48);
});
