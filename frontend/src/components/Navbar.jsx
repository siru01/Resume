import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar({ page, setPage, onOpenSearch, theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = ['home', 'experience', 'projects', /*'blog', */ 'resume']  /*for the time being blog is not being used, will be upating later  */

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.style.background = '#0d0d0d'
      document.body.style.color = '#e0e0e0'
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.style.background = '#ffffff'
      document.body.style.color = '#1a1a1a'
    }
  }, [theme])

  const handleNavClick = (l) => {
    setPage(l)
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">

      {/* Brand name - mobile only */}
      <span className="nav-brand">Sirjan</span>

      {/* Desktop nav links */}
      <div className="nav-links-group">
        {links.map((l) => (
          <button
            key={l}
            onClick={() => handleNavClick(l)}
            className={`nav-link ${page === l ? 'active' : ''}`}
          >
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      {/* Right side: search + theme + hamburger */}
      <div className="nav-right">
        <div className="search-box-trigger" onClick={onOpenSearch}>
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <circle cx="6.5" cy="6.5" r="5"/>
            <path d="M10 10l4 4"/>
          </svg>
          <span className="search-placeholder">Search</span>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Hamburger - mobile only */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => handleNavClick(l)}
              className={`mobile-nav-link ${page === l ? 'active' : ''}`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}