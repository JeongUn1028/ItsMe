import { getSpanClasses } from "@/lib/portfolio/portfolio-card-span";
import cardStyle from "../../portfolio/portfolio-card/portfolio-card.module.css";
import style from "./portfolio-cards-skeleton.module.css";

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
          mobileColSpan,
          mobileRowSpan,
          tabletColSpan,
          desktopColSpan,
          tabletRowSpan,
          desktopRowSpan,
        } = getSpanClasses([...size]);

        return (
          <div
            key={index}
            aria-hidden="true"
            className={`glass ${cardStyle.card} ${mobileColSpan} ${mobileRowSpan} ${tabletColSpan} ${desktopColSpan} ${tabletRowSpan} ${desktopRowSpan} ${isRowLayout ? cardStyle.rowLayout : cardStyle.columnLayout} ${style.skeletonCard}`}
          >
            <div
              className={`${cardStyle.thumbnailWrap} ${isRowLayout ? cardStyle.thumbnailWrapRow : cardStyle.thumbnailWrapColumn} ${style.thumbnailSkeleton}`}
            />
            <div
              className={`${cardStyle.info} ${isRowLayout ? cardStyle.infoRow : ""}`}
            >
              <div className={`${style.bar} ${style.titleBar}`} />
              <div className={`${style.bar} ${style.summaryBar}`} />
              <div className={`${style.bar} ${style.summaryBarShort}`} />
              <div className={style.tags}>
                <div className={`${style.bar} ${style.tagBar}`} />
                <div className={`${style.bar} ${style.tagBarShort}`} />
                <div className={`${style.bar} ${style.tagBarTiny}`} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
