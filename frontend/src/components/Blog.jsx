import { useEffect, useState } from 'react'
import './Blog.css'


const blogs = [
    {"title": "dgfhzdffbdfb", "date": "6556465", "link": "#"},
    {"title": "445", "date": "551515", "link": "#"},
]


export default function Blog() {
  const [data] = useState(blogs)

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