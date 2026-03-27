//* 포트폴리오 container를 클릭하면 상세 페이지로 이동
//* 왼쪽사이드에 썸네일, 오른쪽 사이드에 프로젝트 제목, 설명, 태그가 보이는 형태

import { Project, SpanSize, TabletSpanSize } from "@/lib/projects/types";
import Image from "next/image";
import style from "./portfolio-card.module.css";

//* mobile: col-span-1 row-span-1

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

function normalizeSize(size: Project["size"]) {
  const col = size?.[0] ?? 1;
  const row = size?.[1] ?? 1;

  if (col === 1 && row === 1) {
    return { col: 2 as SpanSize, row: 1 as SpanSize };
  }

  return { col, row };
}

//* 프로젝트를 받아서 포트폴리오를 카드 형태로 렌더링
//* size: [colSpan, rowSpan] — 예) [1, 1], [2, 1], [1, 2], [2, 2]
export default function PortfolioCard(project: Project) {
  const { thumbnail, title, summary, tags, size } = project;
  const { col, row } = normalizeSize(size);

  const tabletColSpan = tabletColSpanMap[Math.min(col, 2) as TabletSpanSize];
  const desktopColSpan = desktopColSpanMap[col as SpanSize];
  const tabletRowSpan = tabletRowSpanMap[Math.min(row, 2) as TabletSpanSize];
  const desktopRowSpan = desktopRowSpanMap[row as SpanSize];

  //* 가로 >= 세로면 row, 세로 > 가로면 column
  //* mobile에서는 항상 row 배치
  //* tablet, desktop에서는 size에 따라 row 또는 column 배치
  const layoutClass = col >= row ? style.row : style.column;

  return (
    <div
      className={`glass col-span-2 row-span-2 p-4 ${tabletColSpan} ${desktopColSpan} ${tabletRowSpan} ${desktopRowSpan} ${style.container} ${layoutClass}`}
    >
      <div className={style.thumbnailWrap}>
        <Image
          src={thumbnail}
          alt={title}
          width={500}
          height={300}
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className={style.thumbnail}
        />
      </div>
      <div className={style.info}>
        <h2>{title}</h2>
        <p>{summary}</p>
        <ul className={style.tags}>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
