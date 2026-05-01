import { AuthenticateUserProvider } from "./AuthenticateUser";
import NavBar from "./components/NavBar";
import "./globals.css";

export default function RootLayout({ children }) {
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
            <NavBar />
          </div>
        </AuthenticateUserProvider>
      </body>
    </html>
  );
}
