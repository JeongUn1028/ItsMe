import style from "./AuthStatusSkeleton.module.css";

export default function AuthStatusSkeleton() {
  return (
    <div className={style.actionSkeletonGroup} aria-hidden="true">
      <span className={`${style.skeletonPill} ${style.skeletonPillMd}`}></span>
      <span className={`${style.skeletonPill} ${style.skeletonPillSm}`}></span>
    </div>
  );
}
