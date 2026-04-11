import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import Link from "next/link";
import LogoutButton from "../../ui/logout-button";
import style from "./header.module.css";

export default async function Header() {
  const isLogin = await getLoginStatus();

  return (
    <div className={style.container}>
      <Link href="/" className={style.title}>
        LEEJEONGUN.COM
      </Link>
      {isLogin && <LogoutButton />}
      {/* <div>modeChanger</div> */}
    </div>
  );
}
