import { getSession } from "@/lib/auth/getSession";
import style from "./header.module.css";

export default async function Header() {
  const isLogin = await getSession();
  console.log("Header isLogin:", isLogin);
  return (
    <div className={style.container}>
      <h1 className={style.title}>LEEJEONGUN.COM</h1>
      <div>modeChanger</div>
      {isLogin && <button>logout</button>}
    </div>
  );
}
