import Image from "next/image";
import style from "./resume.module.css";

export default function Resume() {
  return (
    <div
      className={`${style.container} glass col-span-1 row-span-2 h-full sm:col-span-2 xl:col-span-1 xl:col-start-1 xl:row-start-1`}
    >
      <h1 className={style.logo}>ABOUT ME/RESUME</h1>
      <div className={style.subContainer}>
        <div className={style.imageContainer}>
          <Image
            src="/profile.jpg"
            alt="profile image"
            width={220}
            height={220}
            className={style.profileImage}
          />
        </div>
        <div className={style.textContainer}>
          <p className={style.description}>설계부터 시작해 나가는 개발자입니다.</p>
          <div className={style.resumeLink}>View Full Markdown Resume</div>
        </div>
      </div>
    </div>
  );
}
