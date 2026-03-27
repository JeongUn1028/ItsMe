import styles from "./header.module.css";

export default function Header() {
  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>LEEJEONGUN.COM</h1>
      <div>modeChanger</div>
    </div>
  );
}
