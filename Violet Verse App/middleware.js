import { NextResponse } from "next/server";

// if logged in user tries to access /login or /register, redirect to home
//if not logged in and tries to access protected routes, redirect to /login

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const protectedRoutes = ["/", "/profile", "/create-post"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login/:path*",
    "/register/:path*",
    "/profile/:path*",
    "/create-post/:path*",
    "/posts/:path*",
  ],
};
