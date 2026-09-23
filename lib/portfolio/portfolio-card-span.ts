import { Portfolio, SpanSize } from "@/lib/types/portfolioTypes";

const desktopColSpanMap: Record<SpanSize, string> = {
  1: "xl:col-span-1",
  2: "xl:col-span-2",
  3: "xl:col-span-3",
};

const desktopRowSpanMap: Record<SpanSize, string> = {
  1: "xl:row-span-1",
  2: "xl:row-span-2",
  3: "xl:row-span-3",
};

const normalizeSize = (size: Portfolio["size"]) => {
  const col = size?.[0] ?? 1;
  const row = size?.[1] ?? 1;

  return { col, row };
};

/**
 * frontmatter 의 `size` 를 카드가 그리드에서 차지할 칸 수 클래스로 바꾼다.
 *
 * 칸 수를 실제로 쓰는 구간은 3열이 되는 1280px 이상뿐이다. 그 아래는 한 줄에
 * 카드 하나씩, 같은 높이로 쌓아 칸이 맞물리지 않아 빈 자리가 생기는 것을 막는다. (#69)
 *
 * @example
 * const { desktopColSpan } = getSpanClasses([2, 1]); // "xl:col-span-2"
 */
export const getSpanClasses = (size: Portfolio["size"]) => {
  const { col, row } = normalizeSize(size);
  const isRowLayout = col >= row;

  return {
    col,
    row,
    isRowLayout,
    //* 좁은 화면은 1열이므로 칸 수를 1로 고정한다.
    narrowColSpan: "col-span-1",
    narrowRowSpan: "row-span-2 sm:row-span-1",
    desktopColSpan: desktopColSpanMap[col as SpanSize],
    desktopRowSpan: desktopRowSpanMap[row as SpanSize],
  };
};
