'use client';
import Link from 'next/link';
import { useUser } from '../AuthenticateUser';

export default function NavBar() {
  const { user, logout } = useUser();

  return (
    <footer>
      <nav>
        <Link href="/">
          <i className="fa-regular fa-house"></i>
          <span className="nav-text">Home</span>
        </Link>
        
        <Link href="/posts/create" className="add-btn" aria-label="Add post">
          <i className="fas fa-plus"></i>
          <span className="nav-text">Post</span>
        </Link>
        
        <Link href="/profile">
          <i className="fa-solid fa-user"></i>
          <span className="nav-text">Profile</span>
        </Link>
      </nav>
    </footer>
  );
}