import { useState } from 'react'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Blog from './components/Blog'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>
      <Navbar page={page} setPage={setPage} />
      {page === 'home' && (
        <>
          <Profile />
          <Experience />
        </>
      )}
      {page === 'projects' && <Projects />}
      {page === 'blog' && <Blog />}
    </div>
  )
}