import Image from "next/image";
import style from "./contact.module.css";

export default function Contact() {
  return (
    <div
      className={`glass col-span-1 row-span-1 xl:col-start-2 xl:row-start-2 ${style.card}`}
    >
      <h2 className={style.title}>CONTACT</h2>
      <div className={style.content}>
        <div className={style.row}>
          <Image
            src="/email_icon.png"
            alt="Email Icon"
            width={18}
            height={18}
          />
          :<div className={style.value}>wjddns363@naver.com</div>
        </div>
        <div className={style.row}>
          <Image
            src="/phone_icon.png"
            alt="Phone Icon"
            width={18}
            height={18}
          />
          :<div className={style.value}>010-9656-1295</div>
        </div>
      </div>
    </div>
  );
}
