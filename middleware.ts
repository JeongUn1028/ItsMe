import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (
    !token ||
    (!(await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY),
    )) &&
      request.nextUrl.pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
