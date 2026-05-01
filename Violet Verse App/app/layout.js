"use client";
import { usePathname } from "next/navigation";
import { AuthenticateUserProvider } from "./AuthenticateUser";
import NavBar from "./components/NavBar";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Hide NavBar on login and register pages
  const hideNavBar = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        />
      </head>
      <body className="profile-page">
        <AuthenticateUserProvider>
          <div className="container">
            <main className="main">{children}</main>
            {!hideNavBar && <NavBar />}
          </div>
        </AuthenticateUserProvider>
      </body>
    </html>
  );
}