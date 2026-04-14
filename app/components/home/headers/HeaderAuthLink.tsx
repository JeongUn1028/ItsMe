"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import style from "./header.module.css";

export default function HeaderAuthLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const status = await fetch("/api/login/status").then((res) => res.json());
      console.log(status);
      setIsLoggedIn(status.isLoggedIn);
    };

    void fetchLoginStatus();
  }, []);

  return (
    <Link href={isLoggedIn ? "/admin" : "/login"} className={style.adminLink}>
      {isLoggedIn ? "Admin" : "Login"}
    </Link>
  );
}
