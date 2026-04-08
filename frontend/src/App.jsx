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
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>
      <Navbar page={page} setPage={setPage} />
      {page === 'home' && <Home />}
      {page === 'experience' && <Experience />}
      {page === 'projects' && <Projects />}
      {page === 'blog' && <Blog />}
      {page === 'resume' && <Resume />}   
    </div>
  )
}