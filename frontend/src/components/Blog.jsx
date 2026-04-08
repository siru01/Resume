import { useEffect, useState } from 'react'
import './Blog.css'

export default function Blog() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(setData)
  }, [])

  return (
    <section>
      <h2>Blog</h2>
      {data.map((b, i) => (
        <div key={i} className="blog-item">
          <a href={b.link} className="blog-title">{b.title}</a>
          <span className="blog-date">{b.date}</span>
        </div>
      ))}
    </section>
  )
}