import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* 배경색의 상대 밝기 (0 = 검정, 1 = 흰색)
async function bodyLuminance(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const rgb = getComputedStyle(document.body).backgroundColor.match(/\d+/g)!;
    const [r, g, b] = rgb.map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  });
}

test.describe("다크 모드", () => {
  test("시스템이 다크면 다크로 렌더된다", async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: "dark" });
    const page = await ctx.newPage();
    await gotoHome(page);
    expect(await bodyLuminance(page)).toBeLessThan(0.2);
    //* 브라우저 폼 컨트롤/스크롤바도 다크로
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
    ).toContain("dark");
    await ctx.close();
  });

  test("토글로 바꾼 테마는 새로고침 후에도 유지된다", async ({ page }) => {
    await gotoHome(page);
    expect(await bodyLuminance(page)).toBeGreaterThan(0.8);

    const lightThemeColor = await page
      .locator('meta[name="theme-color"]')
      .first()
      .getAttribute("content");

    const toggle = page.getByRole("button", { name: /테마/ });
    await toggle.click(); // system → dark
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await bodyLuminance(page)).toBeLessThan(0.2);
    //* Safari 상단 바 색도 함께 바뀌어야 합니다.
    const themeColor = await page
      .locator('meta[name="theme-color"]')
      .first()
      .getAttribute("content");
    //* 팔레트 값을 하드코딩하지 않는다. 라이트에서 읽어둔 값과 달라지기만 하면 된다.
    expect(themeColor).not.toBe(lightThemeColor);

    await page.reload();
    await page.locator('a[href^="/portfolio/"]').first().waitFor();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await bodyLuminance(page)).toBeLessThan(0.2);

    await page.getByRole("button", { name: /테마/ }).click(); // dark → light
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await bodyLuminance(page)).toBeGreaterThan(0.8);
  });

  //* 아이콘은 filter: invert 로 뒤집지 않고 SVG 가 글자색(currentColor)을 그대로 따른다. (#44)
  test("다크 모드에서 아이콘은 반전 없이 글자색을 따라 밝게 보인다", async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: "dark" });
    const page = await ctx.newPage();
    await gotoHome(page);

    await expect(page.locator(".dark-invert")).toHaveCount(0);
    const icon = page.locator('a[href^="mailto:"] svg');
    await expect(icon).toHaveCount(1);
    const { filter, luminance } = await icon.evaluate((el) => {
      const cs = getComputedStyle(el);
      const [r, g, b] = (cs.color.match(/\d+/g) ?? ["0", "0", "0"]).map(Number);
      return { filter: cs.filter, luminance: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 };
    });
    expect(filter).toBe("none");
    expect(luminance).toBeGreaterThan(0.5);
    await ctx.close();
  });
});

test.describe("투명도 감소 설정", () => {
  test("prefers-reduced-transparency 에서는 blur 없이 불투명한 카드로 렌더된다", async ({
    page,
  }) => {
    //* Playwright 의 emulateMedia 에 아직 없는 기능이라 CDP 로 직접 설정합니다.
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
    });
    await gotoHome(page);

    const { backdrop, alpha } = await page
      .locator(".glass")
      .first()
      .evaluate((el) => {
        const cs = getComputedStyle(el);
        const m = cs.backgroundColor.match(/[\d.]+/g)!;
        return { backdrop: cs.backdropFilter, alpha: m[3] === undefined ? 1 : Number(m[3]) };
      });
    expect(backdrop).toBe("none");
    expect(alpha).toBeGreaterThan(0.9);
  });
});
