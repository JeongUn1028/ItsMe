"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Portfolio } from "@/lib/types/portfilioTypes";
import { getSpanClasses } from "@/lib/portfolio/portfolio-card-span";
import style from "./PortfolioCard.module.css";
export default function PortfolioCard(portfolio: Portfolio) {
  const { thumbnail, title, summary, tags, size } = portfolio;

  const {
    isRowLayout,
    mobileColSpan,
    mobileRowSpan,
    tabletColSpan,
    desktopColSpan,
    tabletRowSpan,
    desktopRowSpan,
  } = getSpanClasses(size);
  const router = useRouter();

  const onClickCard = () => {
    router.push(`/portfolio/${portfolio.slug}`);
  };

  return (
    <div
      className={`glass ${style.card} ${mobileColSpan} ${mobileRowSpan} ${tabletColSpan} ${desktopColSpan} ${tabletRowSpan} ${desktopRowSpan} ${isRowLayout ? style.rowLayout : style.columnLayout}`}
      onClick={onClickCard}
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
