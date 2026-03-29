import Link from "next/link";
import style from "./links.module.css";
import Image from "next/image";

export default function Links() {
  return (
    <div
      className={`glass col-span-1 row-span-1 xl:col-start-2 xl:row-start-1 ${style.card}`}
    >
      <h1 className={style.title}>GIT/VELOG LINKS</h1>
      <div className={style.content}>
        <div className={style.iconRow}>
          <Link
            href="https://github.com/JEONGUN1028"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github_logo_icon.png"
              alt="GitHub"
              width={32}
              height={32}
            />
          </Link>
          <Link
            href="https://velog.io/@jeongun1028"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/velog_logo_icon.svg"
              alt="Velog"
              width={32}
              height={32}
            />
          </Link>
        </div>
        <div className={style.account}>@JEONGUN1028</div>
      </div>
    </div>
  );
}
