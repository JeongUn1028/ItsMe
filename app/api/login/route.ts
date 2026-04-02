import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username = "", password = "" } = await req.json();

    if (
      username === process.env.NEXT_ID &&
      password === process.env.NEXT_SECRET
    ) {
      return NextResponse.json(
        { ok: true, message: "Login successful" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { ok: false, message: "아이디 또는 비밀번호 오류입니다." },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
