"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchLoginAction(formData: FormData): Promise<void> {
  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const redirectPath = formData.get("redirect")?.toString() ?? "/admin";
  const safeRedirectPath = redirectPath.startsWith("/")
    ? redirectPath
    : "/admin";

  if (!username || !password) {
    redirect(
      `/login?error=missing&redirect=${encodeURIComponent(safeRedirectPath)}`,
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      },
    );

    if (!response.ok) {
      redirect(
        `/login?error=invalid&redirect=${encodeURIComponent(safeRedirectPath)}`,
      );
    }

    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));

    const cookiesStore = await cookies();
    cookiesStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
    });
  } catch (error) {
    console.error("Login SeverAction error:", error);
    redirect(
      `/login?error=server&redirect=${encodeURIComponent(safeRedirectPath)}`,
    );
  }

  redirect(safeRedirectPath);
}
