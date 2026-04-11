import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'     
import Home from './components/Home'     
import Experience from './components/Experience'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Resume from './components/Resume'      
import SearchPalette from './components/SearchPalette'
import Assets from './components/Assets'
import Footer from './components/Footer'

console.log('App component loading...');

export default function App() {
  const [page, setPage] = useState('home')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K or "/"
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    console.log('App mounted, current page:', page);
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="app-root">
      <Navbar page={page} setPage={setPage} onOpenSearch={() => setIsSearchOpen(true)} theme={theme} toggleTheme={toggleTheme} />
      <SearchPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        setPage={setPage} 
      />
      
      <div className="main-content">
        <div className={`back-nav ${page === 'home' ? 'home-spacing' : ''}`}>
          {page !== 'home' && (
            <button className="back-button" onClick={() => setPage('home')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back</span>
            </button>
          )}
        </div>
        
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'experience' && <Experience />}
        {page === 'projects' && <Projects />}
        {page === 'blog' && <Blog />}
        {page === 'resume' && <Resume />}   
        {page === 'assets' && <Assets />}
      </div>

      <Footer setPage={setPage} />
    </div>
  )
}


