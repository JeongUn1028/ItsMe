//* 클라이언트 번들로 유입되면 빌드가 실패하도록 서버 전용임을 표시합니다. (#54)
import "server-only";

//* Login 상태를 확인하는 함수

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const getLoginStatus = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;
  if (!token) {
    return false;
  }
  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY),
    );

    return true;
  } catch (error) {
    console.error("getLoginStatus error:", error);
    return false;
  }
};
