import style from "./velog-posts-skeleton.module.css";

export default function VelogPostsSkeleton() {
  return (
    <div className={`glass ${style.container}`} aria-hidden="true">
      <div className={`${style.bar} ${style.headingBar}`} />
      <div className={style.list}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={style.item}>
            <div className={`${style.bar} ${style.titleBar}`} />
            <div className={style.tags}>
              <div className={`${style.bar} ${style.tagBar}`} />
              <div className={`${style.bar} ${style.tagBarShort}`} />
              <div className={`${style.bar} ${style.tagBarTiny}`} />
            </div>
            <div className={style.dateRow}>
              <div className={`${style.bar} ${style.dateBar}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
