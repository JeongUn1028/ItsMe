import { expect, test, type Page } from "@playwright/test";
import { gotoHome } from "./helpers";

//* 팔레트를 바꿔도 본문 가독성이 무너지지 않도록 WCAG AA 를 고정한다. (#66)
//* 기준: 본문 4.5:1, 큰 글씨(18.66px 이상 또는 굵은 14px 이상) 3:1

const TARGETS = [
  { label: "이름", selector: "h1" },
  { label: "섹션 제목", selector: "h2" },
  { label: "포지셔닝 문구", selector: '[class*="headline"]' },
  { label: "소개 본문", selector: '[class*="lead"]' },
  { label: "소개 더 보기", selector: "summary" },
  { label: "카드 요약", selector: '[class*="summary"]:not(summary)' },
  { label: "Velog 날짜", selector: '[class*="dateContainer"] p' },
];

async function measure(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;

    const toRgba = (value: string) => {
      const [r, g, b, a = 1] = value.match(/[\d.]+/g)!.map(Number);
      return { r, g, b, a };
    };
    const flatten = (fg: ReturnType<typeof toRgba>, bg: ReturnType<typeof toRgba>) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });
    const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const channel = (c: number) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const pageBg = toRgba(getComputedStyle(document.body).backgroundColor);
    const styles = getComputedStyle(el);

    //* 가장 가까운 불투명 배경을 찾아 반투명 색을 합성한다.
    let node: Element | null = el;
    let backdrop = pageBg;
    while (node && node !== document.body) {
      const color = toRgba(getComputedStyle(node).backgroundColor);
      if (color.a > 0) {
        backdrop = flatten(color, pageBg);
        break;
      }
      node = node.parentElement;
    }

    const text = flatten(toRgba(styles.color), backdrop);
    const [hi, lo] = [luminance(text), luminance(backdrop)].sort((a, b) => b - a);

    return {
      ratio: (hi + 0.05) / (lo + 0.05),
      fontSize: parseFloat(styles.fontSize),
      fontWeight: Number(styles.fontWeight) || 400,
    };
  }, selector);
}

for (const scheme of ["light", "dark"] as const) {
  test(`${scheme} 모드의 본문 대비가 WCAG AA 를 만족한다`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await gotoHome(page);

    const failures: string[] = [];
    for (const { label, selector } of TARGETS) {
      const result = await measure(page, selector);
      if (!result) continue;

      const isLarge =
        result.fontSize >= 18.66 ||
        (result.fontSize >= 14 && result.fontWeight >= 700);
      const required = isLarge ? 3 : 4.5;

      if (result.ratio < required) {
        failures.push(
          `${label}: ${result.ratio.toFixed(2)}:1 (필요 ${required}:1, ${result.fontSize}px)`,
        );
      }
    }

    expect(failures).toEqual([]);
    await context.close();
  });
}
