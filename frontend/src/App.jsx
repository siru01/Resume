import { useState, useEffect, Component } from 'react'
import Navbar from './components/Navbar'     
import Home from './components/Home'     
import Experience from './components/Experience'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Resume from './components/Resume'
import Progress from './components/Progress'
import SearchPalette from './components/SearchPalette'
import Assets from './components/Assets'
import CodeCompiler from './components/CodeCompiler'
import Footer from './components/Footer'
//for analytical 
import { Analytics } from '@vercel/analytics/react';

console.log('App component loading...');

// Error boundary — catches any render crash and shows a simple reload button
// instead of a completely blank page.
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('App render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', gap: '1rem',
          fontFamily: 'JetBrains Mono, monospace', background: '#0d0d0d', color: '#fff'
        }}>
          <p style={{ color: '#ef4444' }}>Something went wrong.</p>
          <pre style={{ fontSize: '12px', opacity: 0.6, maxWidth: '80vw', overflowX: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{ padding: '8px 20px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Initialize page from localStorage, default to 'home'
  const [page, setPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home'
  })
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Save page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', page)
  }, [page])

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
    <AppErrorBoundary>
    <>   

    <div className="grid-container">
  <div className="wave-overlay"></div>
  
  <div className="map-wrapper">
    <div className="c na" title="North America"></div>
    <div className="c ca" title="Central America"></div>
    <div className="c sa" title="South America"></div>
    <div className="c eu" title="Europe"></div>
    <div className="c af" title="Africa"></div>
    <div className="c as" title="Asia"></div>
    <div className="c in" title="India"></div>
    <div className="c sea" title="South East Asia"></div>
    <div className="c au" title="Australia"></div>
    <div className="c jp" title="Japan"></div>
    <div className="c nz" title="New Zealand"></div>
  </div>
</div>
    <Analytics />
    <div className="app-container">
      <Navbar page={page} setPage={setPage} onOpenSearch={() => setIsSearchOpen(true)} theme={theme} toggleTheme={toggleTheme} />
      <SearchPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        setPage={setPage} 
      />
      
      <div className="app-main-content">
        <div className={`app-back-nav ${page === 'home' ? 'app-home-spacing' : ''}`}>
          {page !== 'home' && (
            <button className="app-back-button" onClick={() => setPage('home')}>
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
        {page === 'progress' && <AppErrorBoundary><Progress /></AppErrorBoundary>}
        {page === 'assets' && <Assets />}
        {page === 'code' && <CodeCompiler />}
      </div>

      <Footer setPage={setPage} />
    </div>
    </>
    </AppErrorBoundary>
  )
}

//commenting for the streak 



