import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Portfolio } from "@/lib/types/portfolioTypes";
import { getSpanClasses } from "@/lib/portfolio/portfolio-card-span";
import style from "./PortfolioCard.module.css";

//* 홈 포트폴리오 카드. Link 를 사용해 키보드 접근과 prefetch 가 되도록 합니다.
//* index 는 순차 등장 애니메이션의 지연 순서로만 쓰입니다.
interface PortfolioCardProps extends Portfolio {
  /** 순차 등장 애니메이션의 지연 순서 */
  index?: number;
  /** 첫 화면에 보이는 카드면 이미지를 우선 로드한다 */
  isPriority?: boolean;
}

export default function PortfolioCard({
  index = 0,
  isPriority = false,
  ...portfolio
}: PortfolioCardProps) {
  const { thumbnail, title, summary, tags, size, slug } = portfolio;

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
    <Link
      href={`/portfolio/${slug}`}
      aria-label={`${title} 자세히 보기`}
      className={`glass fade-up ${style.card} ${mobileColSpan} ${mobileRowSpan} ${tabletColSpan} ${desktopColSpan} ${tabletRowSpan} ${desktopRowSpan} ${isRowLayout ? style.rowLayout : style.columnLayout}`}
      style={{ "--i": index } as CSSProperties}
    >
      <div
        className={`${style.thumbnailWrap} ${isRowLayout ? style.thumbnailWrapRow : style.thumbnailWrapColumn}`}
      >
        <Image
          src={thumbnail}
          alt=""
          width={500}
          height={300}
          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          priority={isPriority}
          className={style.thumbnail}
        />
      </div>
      <div className={`${style.info} ${isRowLayout ? style.infoRow : ""}`}>
        <h2 className={style.title}>{title}</h2>
        <p className={style.summary}>{summary}</p>
        <ul className={style.tags}>
          {tags.map((tag) => (
            <li key={tag} className={`chip ${style.tag}`}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
