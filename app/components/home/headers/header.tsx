import style from "./header.module.css";
import Link from "next/link";
import HeaderAuthLink from "./HeaderAuthLink";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export default function Header() {
  return (
    <div className={style.container}>
      <Link href="/" className={style.title}>
        LEEJEONGUN.COM
      </Link>
      <div className={style.actions}>
        <ThemeToggle className={style.themeToggle} />
        <HeaderAuthLink />
      </div>
    </div>
  );
}
