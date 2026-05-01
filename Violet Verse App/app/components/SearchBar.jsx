'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const performSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(`/server/api/users/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const handleUserClick = (userId) => {
    setShowResults(false);
    setSearchTerm('');
    router.push(`/client/users/${userId}`);
  };

  return (
    <div className="search-input-row" ref={containerRef}>
      <input
        type="text"
        placeholder="Search users..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && performSearch()}
      />
      <button className="search-btn" onClick={performSearch}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
      {showResults && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="no-results">No users found</div>
          ) : (
            results.map(user => (
              <div key={user.id} className="search-result-item" onClick={() => handleUserClick(user.id)}>
                <img src={user.profilePic} className="search-result-img" alt="" />
                <div className="search-result-info">
                  <div className="search-result-name">{user.displayName}</div>
                  <div className="search-result-username">@{user.username}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}