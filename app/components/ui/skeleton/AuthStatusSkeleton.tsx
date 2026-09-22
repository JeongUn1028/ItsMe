import style from "./AuthStatusSkeleton.module.css";

export default function AuthStatusSkeleton() {
  return (
    <div className={style.actionSkeletonGroup} aria-hidden="true">
      <span className={`shimmer ${style.skeletonPill} ${style.skeletonPillMd}`}></span>
      <span className={`shimmer ${style.skeletonPill} ${style.skeletonPillSm}`}></span>
    </div>
  );
}
