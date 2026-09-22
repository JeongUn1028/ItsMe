import style from "./VelogPostsSkeleton.module.css";

export default function VelogPostsSkeleton() {
  return (
    <div className={`glass ${style.container}`} aria-hidden="true">
      <div className={`shimmer ${style.bar} ${style.headingBar}`} />
      <div className={style.list}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={style.item}>
            <div className={`shimmer ${style.bar} ${style.titleBar}`} />
            <div className={style.tags}>
              <div className={`shimmer ${style.bar} ${style.tagBar}`} />
              <div className={`shimmer ${style.bar} ${style.tagBarShort}`} />
              <div className={`shimmer ${style.bar} ${style.tagBarTiny}`} />
            </div>
            <div className={style.dateRow}>
              <div className={`shimmer ${style.bar} ${style.dateBar}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
