import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-title">
          HobbyHub
        </Link>
        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/create">Create Post</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;