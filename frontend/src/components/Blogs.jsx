import { useEffect, useState } from 'react'

export default function Blog() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(setData)
  }, [])

  return (
    <section>
      <h2 style={{ fontSize: 18, fontWeight: 500, borderLeft: '3px solid #fff', paddingLeft: 12, marginBottom: '1.5rem', color: '#fff' }}>
        Blog
      </h2>
      {data.map((b, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #1e1e1e', paddingBottom: '1rem' }}>
          <a href={b.link} style={{ color: '#ccc', fontSize: 14 }}>{b.title}</a>
          <span style={{ color: '#555', fontSize: 13 }}>{b.date}</span>
        </div>
      ))}
    </section>
  )
}