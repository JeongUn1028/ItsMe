import { describe, expect, it } from "vitest";
import { getSpanClasses } from "@/lib/portfolio/portfolio-card-span";
import type { SpanSize } from "@/lib/types/portfolioTypes";

//* 카드가 그리드에서 차지할 칸 수와 가로/세로 배치를 결정한다.
//* frontmatter 의 size 가 잘못 들어와도 화면이 깨지지 않아야 한다.

describe("getSpanClasses", () => {
  it("가로가 세로보다 길거나 같으면 가로 배치로 본다", () => {
    expect(getSpanClasses([2, 1]).isRowLayout).toBe(true);
    expect(getSpanClasses([1, 1]).isRowLayout).toBe(true);
  });

  it("세로가 더 길면 세로 배치로 본다", () => {
    expect(getSpanClasses([1, 2]).isRowLayout).toBe(false);
  });

  it("3열이 되는 데스크톱에만 칸 수를 적용한다", () => {
    const spans = getSpanClasses([3, 2]);

    expect(spans.desktopColSpan).toBe("xl:col-span-3");
    expect(spans.desktopRowSpan).toBe("xl:row-span-2");
  });

  it("size 가 비어 있으면 1x1 로 채운다", () => {
    const spans = getSpanClasses([]);

    expect(spans.col).toBe(1);
    expect(spans.row).toBe(1);
    expect(spans.isRowLayout).toBe(true);
  });

  //* size 와 무관하게 좁은 화면에서는 한 줄에 카드 하나씩, 같은 높이로 쌓는다. (#69)
  it("좁은 화면에서는 size 와 관계없이 한 줄을 차지한다", () => {
    const sizes: SpanSize[][] = [
      [1, 1],
      [2, 1],
      [1, 2],
      [3, 2],
    ];
    for (const size of sizes) {
      const spans = getSpanClasses(size);
      expect(spans.narrowColSpan).toBe("col-span-1");
      expect(spans.narrowRowSpan).toBe("row-span-2 sm:row-span-1");
    }
  });
});
