import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Static files - let through
  if (
    path.startsWith("/_next") || 
    path.startsWith("/favicon.ico") ||
    path.includes("/static/")
  ) {
    return NextResponse.next();
  }

  // Public routes - anyone can access
  const isPublicRoute =
    path === "/client/auth/login" ||
    path === "/client/auth/register" ||
    path.startsWith("/api/auth/");

  // If already logged in and trying to access login/register, redirect to home
  if (token && (path === "/client/auth/login" || path === "/client/auth/register")) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // Invalid token, let them access login/register
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // Protected routes
  const isProtectedRoute =
    path === "/" ||
    path.startsWith("/profile") ||
    path.startsWith("/posts") ||
    path.startsWith("/statistics") ||
    path.startsWith("/api/posts") ||
    path.startsWith("/api/users") ||
    path.startsWith("/api/statistics");

  // If not logged in and trying to access protected routes, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/client/auth/login", request.url));
  }

  // Verify token is valid for protected routes
  if (isProtectedRoute && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
      await jwtVerify(token, secret);
    } catch (error) {
      const response = NextResponse.redirect(
        new URL("/client/auth/login", request.url)
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
    "/client/auth/:path*",
    "/profile/:path*",
    "/posts/:path*",
    "/statistics/:path*",
    "/api/:path*",
  ],
};