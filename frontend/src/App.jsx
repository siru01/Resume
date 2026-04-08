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
      <div style={{ paddingLeft: '350px', paddingRight: '350px', boxSizing: 'border-box', marginTop: '70px' }}>
        {page === 'home' && <Home />}
        {page === 'work' && <Experience />}
        {page === 'projects' && <Projects />}
        {page === 'blog' && <Blog />}
        {page === 'resume' && <Resume />}   
      </div>
    </>
  )
}