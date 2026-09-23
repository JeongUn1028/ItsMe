import style from "./header.module.css";
import Link from "next/link";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export default function Header() {
  return (
    <div className={style.container}>
      <Link href="/" className={style.title}>
        LEEJEONGUN.COM
      </Link>
      <div className={style.actions}>
        <ThemeToggle className={style.themeToggle} />
        {/* 로그인 여부는 묻지 않는다. 비로그인 상태면 middleware 가 /login 으로 보낸다. */}
        <Link href="/admin" className={`pill pill-neutral ${style.adminLink}`}>
          Admin
        </Link>
      </div>
    </div>
  );
}
