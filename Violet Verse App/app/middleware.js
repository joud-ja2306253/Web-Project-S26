// app/middleware.js
console.log("🔥🔥🔥 MIDDLEWARE FILE IS LOADED - IF YOU SEE THIS, THE FILE LOADS 🔥🔥🔥");

import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("🔵🔵🔵 MIDDLEWARE FUNCTION RAN FOR:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login/:path*",
    "/register/:path*",
    "/profile/:path*",
    "/posts/:path*",
    "/api/:path*",
  ],
};