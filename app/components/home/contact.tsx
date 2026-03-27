import Image from "next/image";
import style from "./contact.module.css";

export default function Contact() {
  return (
    <div className={`${style.container} glass`}>
      <h2 className={style.title}>Contact</h2>
      <div className={style.subContainer}>
        <div className={style.contacts}>
          <Image
            src="/email_icon.png"
            alt="Email Icon"
            width={18}
            height={18}
          />
          <div>:</div>
          <div className={style.email}>wjddns363@naver.com</div>
        </div>
        <div className={style.contacts}>
          <Image
            src="/phone_icon.png"
            alt="Phone Icon"
            width={18}
            height={18}
          />
          <div>:</div>
          <div className={style.email}>010-9656-1295</div>
        </div>
      </div>
    </div>
  );
}
