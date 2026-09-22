import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

test("Resume 소개글 토글", async ({ page, isMobile }) => {
  await gotoHome(page);

  if (isMobile) {
    //* 모바일: 5줄로 접혀 있다가 '더 보기'로 펼쳐집니다.
    const button = page.getByRole("button", { name: "더 보기" });
    await expect(button).toBeVisible();
    const desc = page.locator("text=프론트엔드 개발자").first();
    const before = (await desc.boundingBox())!.height;
    await button.click();
    await expect(page.getByRole("button", { name: "접기" })).toBeVisible();
    const after = (await desc.boundingBox())!.height;
    expect(after).toBeGreaterThan(before);
  } else {
    //* 데스크톱(xl): 사진 ↔ 소개글 전환.
    await page.setViewportSize({ width: 1440, height: 900 });
    const button = page.getByRole("button", { name: "소개글 보기" });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByRole("button", { name: "사진 보기" })).toBeVisible();
  }
});
