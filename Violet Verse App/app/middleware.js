// app/middleware.js
import { NextResponse } from "next/server";
import { verifyJwt } from "./jwt";  

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // ... rest of your middleware

  if (token && isProtectedRoute) {
    const user = verifyJwt(token);  // ← use your function
    if (!user) {
      const response = NextResponse.redirect(new URL("/client/auth/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}