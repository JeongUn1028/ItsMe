import style from "./header.module.css";
import Link from "next/link";

export default async function Header() {
  return (
    <div className={style.container}>
      <Link href="/" className={style.title}>
        LEEJEONGUN.COM
      </Link>
      <Link href="/admin" className={style.adminLink}>
        Admin
      </Link>
      {/* <div>modeChanger</div> */}
    </div>
  );
}
