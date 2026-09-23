import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* 공개 페이지는 인증 상태에 의존하지 않아야 정적으로 프리렌더된다. (#57)

test("공개 상세 페이지에는 관리자 버튼이 없다", async ({ page }) => {
  await page.goto("/portfolio/itsme");
  await page.waitForSelector("article");

  await expect(page.getByRole("link", { name: /Edit|수정/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Delete|삭제/ })).toHaveCount(0);
});

test("헤더 Admin 링크는 인증 상태를 묻지 않고 항상 /admin 을 가리킨다", async ({
  page,
}) => {
  const authRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/login")) authRequests.push(request.url());
  });

  await gotoHome(page);

  const adminLink = page.getByRole("link", { name: "Admin" });
  await expect(adminLink).toHaveAttribute("href", "/admin");
  //* 클라이언트에서 로그인 상태를 되묻는 워터폴이 없어야 한다.
  expect(authRequests).toEqual([]);
});

test("로그인 상태 조회 API 는 제거되어 응답하지 않는다", async ({ request }) => {
  const response = await request.get("/api/login/status");
  expect(response.status()).toBe(404);
});
