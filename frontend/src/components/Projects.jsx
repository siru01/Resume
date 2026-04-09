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
        <div key={i} className="projectt-item">
          <a href={p.link} target="_blank" rel="noreferrer" className="projectt-name">{p.name}</a>
          <p className="projectt-description">{p.description}</p>
        </div>
      ))}
    </section>
  )
}