//* 포트폴리오 container를 클릭하면 상세 페이지로 이동
//* 왼쪽사이드에 썸네일, 오른쪽 사이드에 프로젝트 제목, 설명, 태그가 보이는 형태

import { Project } from "@/lib/projects/types";
import Image from "next/image";
import style from "./portfolio-card.module.css";
import { getSpanClasses } from "../../../lib/projects/portfolio-card-span";

//* mobile: col-span-2 row-span-2

//* 프로젝트를 받아서 포트폴리오를 카드 형태로 렌더링
//* size: [colSpan, rowSpan] — 예) [1, 1], [2, 1], [1, 2], [2, 2]
export default function PortfolioCard(project: Project) {
  const { thumbnail, title, summary, tags, size } = project;
  const {
    isRowLayout,
    mobileColSpan,
    mobileRowSpan,
    tabletColSpan,
    desktopColSpan,
    tabletRowSpan,
    desktopRowSpan,
  } = getSpanClasses(size);

  return (
    <div
      className={`glass ${style.card} ${mobileColSpan} ${mobileRowSpan} ${tabletColSpan} ${desktopColSpan} ${tabletRowSpan} ${desktopRowSpan} ${isRowLayout ? style.rowLayout : style.columnLayout}`}
    >
      <div
        className={`${style.thumbnailWrap} ${isRowLayout ? style.thumbnailWrapRow : style.thumbnailWrapColumn}`}
      >
        <Image
          src={thumbnail}
          alt={title}
          width={500}
          height={300}
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className={style.thumbnail}
        />
      </div>
      <div className={`${style.info} ${isRowLayout ? style.infoRow : ""}`}>
        <h2 className={style.title}>{title}</h2>
        <p className={style.summary}>{summary}</p>
        <ul className={style.tags}>
          {tags.map((tag, index) => (
            <li key={index} className={style.tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
