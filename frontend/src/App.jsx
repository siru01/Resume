import { useState } from 'react'
import Navbar from './components/Navbar'     
import Home from './components/Home'     
import Experience from './components/Experience'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Resume from './components/Resume'      

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <>
      <Navbar page={page} setPage={setPage} />
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
      </div>
    </>
  )
}