'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../AuthenticateUser';

export default function NavBar() {
  const pathname = usePathname(); // current URL

  return (
    <footer>
      <nav>
        <Link href="/">
          <i className={pathname === '/' ? 'fa-solid fa-house' : 'fa-regular fa-house'}></i>
          <span className="nav-text">Home</span>
        </Link>
        
        <Link href="/create-post" className="add-btn" aria-label="Add post">
          <i className="fas fa-plus"></i>
          <span className="nav-text">Post</span>
        </Link>
        
        <Link href="/profile">
          <i className={pathname === '/profile' ? 'fa-solid fa-user' : 'fa-regular fa-user'}></i>
          <span className="nav-text">Profile</span>
        </Link>
      </nav>
    </footer>
  );
}