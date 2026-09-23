import Image from "next/image";
import Link from "next/link";
import style from "./contact.module.css";
import type { CSSProperties } from "react";

const EMAIL = "wjddns363@naver.com";

export default function Contact() {
  return (
    <div
      className={`glass fade-up col-span-1 ${style.card}`}
      style={{ "--i": 3 } as CSSProperties}
    >
      <h2 className={style.title}>CONTACT</h2>
      <div className={style.content}>
        {/* 탭하면 메일 앱이 열리도록 실제 링크로 둡니다.
            전화번호는 공개 노출 대신 이력서 PDF 안에만 둡니다. (#63) */}
        <Link href={`mailto:${EMAIL}`} className={style.row}>
          <Image
            src="/contact/email_icon.png"
            className="dark-invert"
            alt=""
            width={18}
            height={18}
            sizes="18px"
          />
          <span className={style.value}>{EMAIL}</span>
        </Link>
      </div>
    </div>
  );
}
