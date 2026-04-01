"use client";
import { useRouter } from "next/navigation";
import style from "./logout-button.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/logout`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Logout successful");
        router.push("/"); // 로그아웃 후 홈으로 리디렉션
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className={style.button}>
      Logout
    </button>
  );
}
