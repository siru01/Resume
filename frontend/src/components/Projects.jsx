import { useEffect, useState } from 'react'
import './Projects.css'

export default function Projects() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setData)
  }, [])

  return (
    <section>
      <h2>Projects</h2>
      {data.map((p, i) => (
        <div key={i} className="project-item">
          <a href={p.link} target="_blank" rel="noreferrer" className="project-name">{p.name}</a>
          <p className="project-description">{p.description}</p>
        </div>
      ))}
    </section>
  )
}