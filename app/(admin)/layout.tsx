import Link from "next/link";
import style from "./layout.module.css";
import LogoutButton from "../components/ui/logout-button";

export default async function AdminLayout({
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
        <LogoutButton />
        {/* <div>modeChanger</div> */}
      </header>
      <main className={style.content}>{children}</main>
    </div>
  );
}
