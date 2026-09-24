import { expect, test, type Page } from "@playwright/test";
import { gotoHome } from "./helpers";

//* 모바일에서는 상세 모달이 iOS 시트처럼 아래에서 올라오고 스와이프로 닫힌다. (#43)
//* 데스크톱은 기존 센터 팝업을 그대로 유지한다.

const isMobile = (width: number) => width < 768;

const openFirstCard = async (page: Page) => {
  await gotoHome(page);
  await page.locator('a[href^="/portfolio/"]').first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  //* 열리는 애니메이션이 끝난 뒤 위치를 잰다.
  await page.waitForTimeout(500);
  return dialog;
};

const dragDown = async (page: Page, distance: number) => {
  const grabber = page.getByTestId("sheet-grabber");
  const box = (await grabber.boundingBox())!;
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let moved = 12; moved <= distance; moved += 12) {
    await page.mouse.move(startX, startY + moved);
  }
  await page.mouse.up();
};

test("모바일에서는 시트가 화면 아래에 붙어 열린다", async ({
  page,
  viewport,
}) => {
  test.skip(!isMobile(viewport?.width ?? 0), "모바일 전용 동작");

  const dialog = await openFirstCard(page);
  const box = (await dialog.boundingBox())!;

  expect(box.x).toBeLessThanOrEqual(1);
  expect(box.width).toBeGreaterThanOrEqual((viewport?.width ?? 0) - 1);
  //* 시트 아래쪽이 화면 바닥에 닿아 있어야 한다.
  const bottomGap = (viewport?.height ?? 0) - (box.y + box.height);
  expect(Math.abs(bottomGap)).toBeLessThanOrEqual(2);
  //* 위쪽에는 뒤 페이지가 보이는 여백이 남는다.
  expect(box.y).toBeGreaterThan(24);

  await expect(page.getByTestId("sheet-grabber")).toBeVisible();
});

test("모바일에서 시트를 충분히 끌어내리면 닫힌다", async ({
  page,
  viewport,
}) => {
  test.skip(!isMobile(viewport?.width ?? 0), "모바일 전용 동작");

  await openFirstCard(page);
  await dragDown(page, 180);

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/\/(\?.*)?$/);
});

test("모바일에서 조금만 끌면 시트가 제자리로 돌아온다", async ({
  page,
  viewport,
}) => {
  test.skip(!isMobile(viewport?.width ?? 0), "모바일 전용 동작");

  const dialog = await openFirstCard(page);
  const before = (await dialog.boundingBox())!;

  await dragDown(page, 36);
  await page.waitForTimeout(400);

  await expect(dialog).toBeVisible();
  const after = (await dialog.boundingBox())!;
  expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(2);
});

test("모바일 시트가 열리면 뒤 페이지가 살짝 물러난다", async ({
  page,
  viewport,
}) => {
  test.skip(!isMobile(viewport?.width ?? 0), "모바일 전용 동작");

  await openFirstCard(page);

  const scale = await page.evaluate(() => {
    const root = document.getElementById("page-root");
    if (!root) return 1;
    const matrix = new DOMMatrixReadOnly(getComputedStyle(root).transform);
    return matrix.a;
  });
  expect(scale).toBeLessThan(1);
  expect(scale).toBeGreaterThan(0.85);
});

test("데스크톱에서는 기존 센터 팝업을 유지한다", async ({ page, viewport }) => {
  test.skip(isMobile(viewport?.width ?? 0), "데스크톱 전용 동작");

  const dialog = await openFirstCard(page);
  const box = (await dialog.boundingBox())!;
  const width = viewport?.width ?? 0;

  expect(box.y).toBeLessThanOrEqual(32);
  expect(box.width).toBeLessThan(width - 40);
  //* 가로 가운데 정렬.
  const centerOffset = box.x + box.width / 2 - width / 2;
  expect(Math.abs(centerOffset)).toBeLessThanOrEqual(2);

  await expect(page.getByTestId("sheet-grabber")).toBeHidden();
});

//* 좌우 페이징(#65)과 겹쳐도 닫은 뒤 홈으로 정상 복귀해야 한다.
test("넓은 화면에서 모달을 닫으면 홈 1페이지로 돌아온다", async ({
  page,
  viewport,
}) => {
  test.skip((viewport?.width ?? 0) < 1440, "좌우 페이징이 켜지는 폭만");

  await openFirstCard(page);
  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/\/(\?.*)?$/);
  await expect(page.getByRole("heading", { name: "대표 프로젝트" })).toBeVisible();
});
