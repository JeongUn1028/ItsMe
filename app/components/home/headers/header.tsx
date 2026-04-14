import style from "./header.module.css";
import Link from "next/link";

export default async function Header() {
  return (
    <div className={style.container}>
      <Link href="/" className={style.title}>
        LEEJEONGUN.COM
      </Link>
      <Link href="/login" className={style.adminLink}>
        Login
      </Link>
      {/* <div>modeChanger</div> */}
    </div>
  );
}
