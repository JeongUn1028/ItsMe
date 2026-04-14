import {
  Portfolio,
  SpanSize,
  TabletSpanSize,
} from "@/lib/types/portfilioTypes";

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

const tabletColSpanMap: Record<TabletSpanSize, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
};

const tabletRowSpanMap: Record<TabletSpanSize, string> = {
  1: "sm:row-span-1",
  2: "sm:row-span-2",
};

function normalizeSize(size: Portfolio["size"]) {
  const col = size?.[0] ?? 1;
  const row = size?.[1] ?? 1;

  return { col, row };
}

export function getSpanClasses(size: Portfolio["size"]) {
  const { col, row } = normalizeSize(size);
  const isRowLayout = col >= row;

  return {
    col,
    row,
    isRowLayout,
    mobileColSpan: "col-span-2",
    mobileRowSpan: "row-span-2",
    tabletColSpan: tabletColSpanMap[Math.min(col, 2) as TabletSpanSize],
    desktopColSpan: desktopColSpanMap[col as SpanSize],
    tabletRowSpan: tabletRowSpanMap[Math.min(row, 2) as TabletSpanSize],
    desktopRowSpan: desktopRowSpanMap[row as SpanSize],
  };
}
