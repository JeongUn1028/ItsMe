import Link from "next/link";
import style from "./layout.module.css";
import LogoutButton from "../components/ui/LogoutBtn";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={style.page}>
      <header className={style.container}>
        <Link href="/" className={style.title}>
          LEEJEONGUN.COM
        </Link>
        <div className={style.actions}>
          <ThemeToggle className={style.themeToggle} />
          <LogoutButton />
        </div>
      </header>
      <main className={style.content}>{children}</main>
    </div>
  );
}
