import Image from "next/image";
import style from "./resume.module.css";

export default function Resume() {
  return (
    <div className={`glass ${style.card}`}>
      <h1 className={style.title}>ABOUT ME/RESUME</h1>
      <div className={style.content}>
        <div className={style.imageWrap}>
          <Image
            src="/profile.jpg"
            alt="profile image"
            width={220}
            height={220}
            className={style.image}
          />
        </div>
        <div className={style.textWrap}>
          <p className={style.description}>
            설계부터 시작해 나가는 개발자입니다.
          </p>
          <div className={style.linkText}>View Full Markdown Resume</div>
        </div>
      </div>
    </div>
  );
}
