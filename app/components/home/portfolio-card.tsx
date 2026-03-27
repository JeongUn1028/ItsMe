//* 포트폴리오 container를 클릭하면 상세 페이지로 이동
//* 왼쪽사이드에 썸네일, 오른쪽 사이드에 프로젝트 제목, 설명, 태그가 보이는 형태

import { Project } from "@/lib/projects/types";
import Image from "next/image";

const tabletColSpanMap: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-2",
};

const desktopColSpanMap: Record<number, string> = {
  1: "xl:col-span-1",
  2: "xl:col-span-2",
  3: "xl:col-span-3",
};

const tabletRowSpanMap: Record<number, string> = {
  1: "sm:row-span-1",
  2: "sm:row-span-2",
  3: "sm:row-span-3",
};

const desktopRowSpanMap: Record<number, string> = {
  1: "xl:row-span-1",
  2: "xl:row-span-2",
  3: "xl:row-span-3",
};

//* 프로젝트를 받아서 포트폴리오를 카드 형태로 렌더링
//* size: [colSpan, rowSpan] — 예) [1, 1], [2, 1], [1, 2], [2, 2]
export default function PortfolioCard(project: Project) {
  const { thumbnail, title, summary, tags, size } = project;
  const tabletColSpan = tabletColSpanMap[size?.[0] ?? 1];
  const desktopColSpan = desktopColSpanMap[size?.[0] ?? 1];
  const tabletRowSpan = tabletRowSpanMap[size?.[1] ?? 1];
  const desktopRowSpan = desktopRowSpanMap[size?.[1] ?? 1];

  return (
    <div
      className={`glass col-span-1 row-span-1 h-full p-4 ${tabletColSpan} ${desktopColSpan} ${tabletRowSpan} ${desktopRowSpan}`}
    >
      <div>
        {/* <Image src={thumbnail} alt={title} width={500} height={300} /> */}
      </div>
      <div>
        <h2>{title}</h2>
        <p>{summary}</p>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
