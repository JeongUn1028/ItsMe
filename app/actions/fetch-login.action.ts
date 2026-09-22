"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/lib/auth/verifyAdminCredentials";

const TOKEN_TTL_SECONDS = 60 * 60;

export async function fetchLoginAction(formData: FormData): Promise<void> {
  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const redirectPath = formData.get("redirect")?.toString() ?? "/admin";
  //* 외부 도메인으로의 open redirect 를 막기 위해 내부 경로만 허용합니다.
  const safeRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : "/admin";
  const loginUrl = (error: string) =>
    `/login?error=${error}&redirect=${encodeURIComponent(safeRedirectPath)}`;

  if (!username || !password) {
    redirect(loginUrl("missing"));
  }

  //* redirect()는 내부적으로 throw 하므로 try 블록 밖에서 호출해야 catch 에 잡히지 않습니다.
  let isValid = false;
  try {
    isValid = await verifyAdminCredentials(username, password);
  } catch (error) {
    console.error("Login ServerAction error:", error);
    redirect(loginUrl("server"));
  }

  if (!isValid) {
    redirect(loginUrl("invalid"));
  }

  let token: string;
  try {
    token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
  } catch (error) {
    console.error("JWT sign error:", error);
    redirect(loginUrl("server"));
  }

  const cookiesStore = await cookies();
  cookiesStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });

  redirect(safeRedirectPath);
}
