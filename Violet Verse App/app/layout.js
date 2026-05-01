import { AuthenticateUserProvider } from '@/auth/AuthenticateUser';
import NavBar from '@/components/NavBar';
import '@/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
