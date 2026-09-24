import { expect, test } from "@playwright/test";
import { gotoHome } from "./helpers";

//* Chrome 은 기본값 round 를 superellipse(1) 로 계산한다. K > 1 이어야 원보다 각진 스쿼클이다.
function toSuperellipseK(shape: string) {
  const trimmed = shape.trim();
  if (trimmed === "" || trimmed === "round") return 1;
  const match = trimmed.match(/^superellipse\(([\d.]+)\)$/);
  return match ? Number(match[1]) : Number.NaN;
}

//* iOS 관점 개선 4 — 스쿼클 모서리와 스프링 이징 (#44)

test.describe("스쿼클 모서리", () => {
  test("corner-shape 를 지원하면 카드 모서리가 superellipse 로 그려진다", async ({ page }) => {
    await gotoHome(page);
    const isSupported = await page.evaluate(() =>
      CSS.supports("corner-shape", "superellipse(1.5)"),
    );
    test.skip(!isSupported, "corner-shape 미지원 브라우저는 아래 폴백 테스트가 담당한다");

    for (const selector of [".glass", 'a[href^="/portfolio/"]']) {
      const shape = await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).getPropertyValue("corner-top-left-shape"));
      expect(toSuperellipseK(shape), selector).toBeGreaterThan(1);
    }
  });

  test("캡슐(pill)은 스쿼클로 바꾸지 않고 둥근 끝을 유지한다", async ({ page }) => {
    await gotoHome(page);
    const shape = await page
      .locator(".pill")
      .first()
      .evaluate((el) => getComputedStyle(el).getPropertyValue("corner-top-left-shape"));
    //* 미지원 브라우저는 빈 문자열, 지원 브라우저는 기본값 round
    expect(toSuperellipseK(shape)).toBe(1);
  });

  test("corner-shape 를 지원하지 않으면 기존 원형 모서리 크기를 그대로 쓴다", async ({ page }) => {
    await gotoHome(page);
    const isSupported = await page.evaluate(() =>
      CSS.supports("corner-shape", "superellipse(1.5)"),
    );
    test.skip(isSupported, "지원 브라우저에서는 확인할 수 없다");

    const radius = await page
      .locator(".glass")
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
    expect(radius).toBe("20px");
  });
});

test.describe("스프링 이징", () => {
  test("모션 토큰이 linear() 스프링 커브로 정의된다", async ({ page }) => {
    await gotoHome(page);
    const tokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        easeOut: cs.getPropertyValue("--ease-out"),
        spring: cs.getPropertyValue("--ease-spring"),
      };
    });
    expect(tokens.easeOut).toMatch(/^\s*linear\(/);
    expect(tokens.spring).toMatch(/^\s*linear\(/);
  });

  test("버튼 전환이 스프링 커브로 움직인다", async ({ page }) => {
    await gotoHome(page);
    const timing = await page
      .locator(".pill")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionTimingFunction);
    expect(timing).toContain("linear(");
  });

  test("스프링 커브는 0 에서 시작해 1 에서 멈춘다", async ({ page }) => {
    await gotoHome(page);
    const points = await page.evaluate(() =>
      ["--ease-out", "--ease-spring"].map((name) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(name);
        const inner = value.slice(value.indexOf("(") + 1, value.lastIndexOf(")"));
        return inner.split(",").map((stop) => Number.parseFloat(stop.trim()));
      }),
    );
    for (const stops of points) {
      expect(stops[0]).toBe(0);
      expect(stops.at(-1)).toBe(1);
    }
  });
});
