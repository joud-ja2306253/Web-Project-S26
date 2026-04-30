// app/layout.js
import { AuthProvider } from './contexts/AuthContext'
import NavBar from './components/NavBar'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="profile-page">
        <AuthProvider>
          <div className="container">
            <main className="main">
              {children}
            </main>
            <NavBar />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}