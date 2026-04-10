import { useEffect, useState } from 'react'
import './Blog.css'


const blogs = [
    {"title": "WILL UPDATE SOON", "date": "", "link": "#"},
    /*{"title": "WILL UPDATE SOON", "date": "", "link": "#"},*/
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