import Image from "next/image";
import style from "./contact.module.css";
import type { CSSProperties } from "react";

const EMAIL = "wjddns363@naver.com";
const PHONE = "010-9656-1295";

export default function Contact() {
  return (
    <div
      className={`glass fade-up col-span-1 row-span-1 xl:col-start-2 xl:row-start-2 ${style.card}`}
      style={{ "--i": 2 } as CSSProperties}
    >
      <h2 className={style.title}>CONTACT</h2>
      <div className={style.content}>
        {/* 탭하면 메일 앱 / 전화 앱이 열리도록 실제 링크로 둡니다. */}
        <a href={`mailto:${EMAIL}`} className={style.row}>
          <Image
            src="/contact/email_icon.png"
            alt=""
            width={18}
            height={18}
          />
          <span className={style.value}>{EMAIL}</span>
        </a>
        <a href={`tel:${PHONE.replace(/-/g, "")}`} className={style.row}>
          <Image
            src="/contact/phone_icon.png"
            alt=""
            width={18}
            height={18}
          />
          <span className={style.value}>{PHONE}</span>
        </a>
      </div>
    </div>
  );
}
