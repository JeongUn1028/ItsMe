import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* 전체 소개글은 <details> 로 접어 둔다. JS 없이 동작해야 하므로 동작 자체를 고정한다. (#63)

test("소개 더 보기를 누르면 전체 소개글이 펼쳐진다", async ({ page }) => {
  await gotoHome(page);

  const summary = page.getByText("소개 더 보기");
  await expect(summary).toBeVisible();

  //* 접힌 상태에서는 나머지 문단이 보이지 않는다.
  const detail = page.getByText(/그런 고민들을 개인 포트폴리오 프로젝트에서/);
  await expect(detail).toBeHidden();

  await summary.click();
  await expect(detail).toBeVisible();

  await summary.click();
  await expect(detail).toBeHidden();
});

test("포지셔닝 문구는 접기와 무관하게 항상 보인다", async ({ page }) => {
  await gotoHome(page);

  await expect(
    page.getByText(/사용자 경험과 코드 품질/).first(),
  ).toBeVisible();
});
