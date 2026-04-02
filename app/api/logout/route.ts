import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 클라이언트에서 로그아웃 요청이 오면 쿠키에서 access_token을 삭제
    (await cookies()).delete("access_token");
    const response = NextResponse.json(
      { ok: true, message: "Logout successful" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
