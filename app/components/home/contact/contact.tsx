import Image from "next/image";
import Link from "next/link";
import style from "./contact.module.css";
import type { CSSProperties } from "react";
import { EMAIL, GITHUB_URL, VELOG_URL } from "@/lib/profile/links";
import { getResume } from "@/lib/resume/getResume";

export default function Contact() {
  const { pdfPath } = getResume();

  return (
    <section
      className={`glass fade-up col-span-1 ${style.card}`}
      style={{ "--i": 3 } as CSSProperties}
      aria-labelledby="contact-heading"
    >
      <h2 id="contact-heading" className={style.title}>
        CONTACT
      </h2>
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

        {/* 마지막 페이지에서도 이력서·코드·글로 바로 갈 수 있게 같은 경로를 한 번 더 둡니다. (#69) */}
        <div className={style.actions}>
          <Link
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className={`pill ${style.action}`}
          >
            이력서 PDF
          </Link>
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`pill pill-neutral ${style.action}`}
          >
            GitHub
          </Link>
          <Link
            href={VELOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`pill pill-neutral ${style.action}`}
          >
            Velog
          </Link>
        </div>
      </div>
    </section>
  );
}
