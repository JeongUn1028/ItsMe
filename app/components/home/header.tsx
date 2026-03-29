import style from "./header.module.css";

export default function Header() {
  return (
    <div className={style.container}>
      <h1 className={style.title}>LEEJEONGUN.COM</h1>
      <div>modeChanger</div>
    </div>
  );
}
