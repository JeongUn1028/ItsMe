import { getSession } from "@/lib/auth/getSession";
import LogoutButton from "../../ui/logout-button";
import style from "./header.module.css";

export default async function Header() {
  const isLogin = await getSession();
  return (
    <div className={style.container}>
      <h1 className={style.title}>LEEJEONGUN.COM</h1>
      {isLogin && <LogoutButton />}
      {/* <div>modeChanger</div> */}
    </div>
  );
}
