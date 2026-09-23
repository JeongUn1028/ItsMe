import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* next/image 가 여러 해상도(srcset)를 내려줄 때 sizes 가 없으면
//* 브라우저가 뷰포트보다 큰 이미지를 고를 수 있다. (#54)
//* SVG 처럼 Next 가 최적화하지 않는 이미지는 srcset 자체가 없어 대상이 아니다.
async function responsiveImagesWithoutSizes(
  page: import("@playwright/test").Page,
) {
  return page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((img) => img.getAttribute("srcset") && !img.getAttribute("sizes"))
      .map((img) => img.getAttribute("alt") || img.getAttribute("src") || "?"),
  );
}

test("홈의 반응형 이미지에는 모두 sizes 가 지정되어 있다", async ({ page }) => {
  await gotoHome(page);
  expect(await responsiveImagesWithoutSizes(page)).toEqual([]);
});

test("상세 페이지의 반응형 이미지에는 모두 sizes 가 지정되어 있다", async ({
  page,
}) => {
  await page.goto("/portfolio/itsme");
  await page.waitForSelector("article");
  expect(await responsiveImagesWithoutSizes(page)).toEqual([]);
});

test("이력서 PDF 링크는 새 탭에서 안전하게 열린다", async ({
  page,
  isMobile,
}) => {
  await gotoHome(page);

  //* 데스크톱(xl)에서는 사진이 기본이라 소개글로 전환해야 링크가 드러난다.
  if (!isMobile) {
    await page.getByRole("button", { name: "소개글 보기" }).click();
  }

  const pdfLink = page.getByRole("link", { name: "Resume PDF 보기" });
  await expect(pdfLink).toHaveAttribute("target", "_blank");
  await expect(pdfLink).toHaveAttribute("rel", /noopener/);
  await expect(pdfLink).toHaveAttribute("href", /\.pdf$/);
});
