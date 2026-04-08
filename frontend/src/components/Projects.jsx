import { useEffect, useState } from 'react'

export default function Projects() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setData)
  }, [])

  return (
    <section>
      <h2 style={{ fontSize: 18, fontWeight: 500, borderLeft: '3px solid #fff', paddingLeft: 12, marginBottom: '1.5rem', color: '#fff' }}>
        Projects
      </h2>
      {data.map((p, i) => (
        <div key={i} style={{ marginBottom: '1.2rem', borderBottom: '1px solid #1e1e1e', paddingBottom: '1.2rem' }}>
          <a href={p.link} target="_blank" rel="noreferrer" style={{ color: '#fff', fontWeight: 500 }}>{p.name}</a>
          <p style={{ color: '#777', fontSize: 13, marginTop: 4 }}>{p.description}</p>
        </div>
      ))}
    </section>
  )
}