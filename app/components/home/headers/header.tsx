import style from "./header.module.css";
import Link from "next/link";
import HeaderAuthLink from "./HeaderAuthLink";

export default function Header() {
  return (
    <div className={style.container}>
      <Link href="/" className={style.title}>
        LEEJEONGUN.COM
      </Link>
      <HeaderAuthLink />
      {/* <div>modeChanger</div> */}
    </div>
  );
}
