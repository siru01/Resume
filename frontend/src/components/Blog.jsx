import { useEffect, useState } from 'react'
import './Blog.css'


const blogs = [
    {"title": "WILL UPDATE SOON", "date": "", "link": "#"},
    /*{"title": "WILL UPDATE SOON", "date": "", "link": "#"},*/
]


export default function Blog() {
  const [data] = useState(blogs)

  return (
    <div className="blog-page">
    <section>
      <div className="blog-heading">
        <h2>Blog</h2>
      </div>
      {data.map((b, i) => (
        <div key={i} className="blog-item">
          <a href={b.link} className="blog-title">{b.title}</a>
          <span className="blog-date">{b.date}</span>
        </div>
      ))}
    </section>
    </div>
  )
}