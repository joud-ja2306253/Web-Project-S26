// app/middleware.js
import { NextResponse } from "next/server";
import { verifyJwt } from "./client/auth/jwt";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Public routes - anyone can access
  const isPublicRoute =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path.startsWith("/api/auth/");

  // Static files - let through
  if (path.startsWith("/_next") || path.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // If already logged in and trying to access login/register, redirect to home
  if (token && (path === "/auth/login" || path === "/auth/register")) {
    const user = verifyJwt(token);
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If not logged in and trying to access protected routes, redirect to login
  const isProtectedRoute =
    path === "/" ||
    path.startsWith("/profile") ||
    path.startsWith("/posts") ||
    path.startsWith("/statistics") ||
    path.startsWith("/api/posts") ||
    path.startsWith("/api/users") ||
    path.startsWith("/api/statistics");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Verify token is valid
  if (isProtectedRoute && token) {
    const user = verifyJwt(token);
    if (!user) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/profile/:path*",
    "/posts/:path*",
    "/statistics/:path*",
    "/api/:path*",
  ],
};
