import { getSpanClasses } from "@/lib/portfolio/portfolio-card-span";
import cardStyle from "../../portfolio/portfolio-card/PortfolioCard.module.css";
import style from "./PortfolioCardsSkeleton.module.css";

const skeletonLayouts = [
  [2, 1],
  [1, 1],
  [1, 2],
  [1, 1],
  [2, 1],
] as const;

export default function PortfolioCardsSkeleton() {
  return (
    <>
      {skeletonLayouts.map((size, index) => {
        const {
          isRowLayout,
          narrowColSpan,
          narrowRowSpan,
          desktopColSpan,
          desktopRowSpan,
        } = getSpanClasses([...size]);

        return (
          <div
            key={index}
            aria-hidden="true"
            className={`glass ${cardStyle.card} ${narrowColSpan} ${narrowRowSpan} ${desktopColSpan} ${desktopRowSpan} ${isRowLayout ? cardStyle.rowLayout : cardStyle.columnLayout} ${style.skeletonCard}`}
          >
            <div
              className={`${cardStyle.thumbnailWrap} ${isRowLayout ? cardStyle.thumbnailWrapRow : cardStyle.thumbnailWrapColumn} ${style.thumbnailSkeleton} shimmer`}
            />
            <div
              className={`${cardStyle.info} ${isRowLayout ? cardStyle.infoRow : ""}`}
            >
              <div className={`shimmer ${style.bar} ${style.titleBar}`} />
              <div className={`shimmer ${style.bar} ${style.summaryBar}`} />
              <div className={`shimmer ${style.bar} ${style.summaryBarShort}`} />
              <div className={style.tags}>
                <div className={`shimmer ${style.bar} ${style.tagBar}`} />
                <div className={`shimmer ${style.bar} ${style.tagBarShort}`} />
                <div className={`shimmer ${style.bar} ${style.tagBarTiny}`} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
