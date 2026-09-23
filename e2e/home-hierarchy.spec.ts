import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* 홈은 "채용 담당자가 30초 안에 판단"을 목표로 한다.
//* 이름 · 포지셔닝 · 주력 기술 · 대표 프로젝트가 스크롤 없이 또는 먼저 읽혀야 한다. (#63)

test("첫 화면에 이름과 포지셔닝 문구가 보인다", async ({ page }) => {
  await gotoHome(page);

  await expect(page.getByRole("heading", { name: "이정운" })).toBeVisible();
  await expect(
    page.getByText(/프론트엔드 개발자/).first(),
  ).toBeVisible();
});

test("주력 기술이 첫 화면에 나열된다", async ({ page }) => {
  await gotoHome(page);

  for (const skill of ["React", "Next.js", "TypeScript"]) {
    await expect(page.getByText(skill, { exact: true }).first()).toBeVisible();
  }
});

//* 이전에는 1280px 이상에서 소개글이 "소개글 보기" 토글 뒤에 숨어 있었다.
test("데스크톱에서도 소개 문구가 토글 없이 보인다", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoHome(page);

  await expect(
    page.getByText(/사용자 경험과 코드 품질/).first(),
  ).toBeVisible();
});

test("이력서 PDF 로 가는 링크가 첫 화면에 있다", async ({ page }) => {
  await gotoHome(page);

  const pdfLink = page.getByRole("link", { name: /이력서|Resume/ }).first();
  await expect(pdfLink).toBeVisible();
  await expect(pdfLink).toHaveAttribute("href", /\.pdf$/);
});

test("대표 프로젝트가 글·연락처보다 위에 놓인다", async ({ page }) => {
  await gotoHome(page);

  const projectsHeading = page.getByRole("heading", { name: "대표 프로젝트" });
  await expect(projectsHeading).toBeVisible();

  const firstCard = page.locator('a[href^="/portfolio/"]').first();
  const contact = page.getByRole("heading", { name: "CONTACT" });

  const cardBox = (await firstCard.boundingBox())!;
  const contactBox = (await contact.boundingBox())!;
  expect(cardBox.y).toBeLessThan(contactBox.y);
});

test("홈에 전화번호를 노출하지 않는다", async ({ page }) => {
  await gotoHome(page);

  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.getByText(/010-\d{4}-\d{4}/)).toHaveCount(0);
});
