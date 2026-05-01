'use client';
import Link from 'next/link';
import { useUser } from '../AuthenticateUser';

export default function NavBar() {
  const { user, logout } = useUser();

  return (
    <footer>
      <nav>
        <Link href="/">
          <i className="fa-solid fa-house"></i>
          <span className="nav-text">Home</span>
        </Link>
        <Link href="/posts/create" className="add-btn">
          <i className="fas fa-plus"></i>
          <span className="nav-text">Post</span>
        </Link>
        {user ? (
          <>
            <Link href="/profile">
              <i className="fa-regular fa-user"></i>
              <span className="nav-text">Profile</span>
            </Link>
            <button onClick={logout} className="logout-btn">
              <i className="fa-solid fa-sign-out-alt"></i>
              <span className="nav-text">Logout</span>
            </button>
          </>
        ) : (
          <Link href="/auth/login">
            <i className="fa-solid fa-sign-in-alt"></i>
            <span className="nav-text">Login</span>
          </Link>
        )}
      </nav>
    </footer>
  );
}