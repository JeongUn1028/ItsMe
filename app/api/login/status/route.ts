import { NextResponse } from "next/server";
import { getLoginStatus } from "@/lib/auth/getLoginStatus";

export async function GET() {
  const isLoggedIn = await getLoginStatus();

  return NextResponse.json(
    { isLoggedIn },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
