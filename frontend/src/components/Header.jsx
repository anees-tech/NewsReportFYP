"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Header.css"

const Header = ({ isLoggedIn, isAdmin, user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-logo">
          <Link to="/">
            <h1>News Stream</h1>
          </Link>
        </div>

        <div className="search-bar">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="user-actions">
          {isLoggedIn ? (
            <div className="user-menu">
              <span>Welcome, {user.username}</span>
              {isAdmin && (
                <Link to="/admin" className="admin-link">
                  Admin Panel
                </Link>
              )}
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/category/politics">Politics</Link>
          </li>
          <li>
            <Link to="/category/sports">Sports</Link>
          </li>
          <li>
            <Link to="/category/business">Business</Link>
          </li>
          <li>
            <Link to="/category/technology">Technology</Link>
          </li>
          <li>
            <Link to="/category/entertainment">Entertainment</Link>
          </li>
          <li>
            <Link to="/category/health">Health</Link>
          </li>
          <li>
            <Link to="/category/science">Science</Link>
          </li>
        </ul>
      </nav>

      <div className="breaking-news">
        <span className="breaking-label">Breaking:</span>
        <div className="breaking-content">
          <p>Latest updates on global events. Stay tuned for more information.</p>
        </div>
      </div>
    </header>
  )
}

export default Header
