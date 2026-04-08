import { useEffect, useState } from 'react'
import './Home.css'

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setData)
  }, [])

  if (!data) return null

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h1>{data.name}</h1>
          <p>
            {data.title} · <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
        </div>
      </div>
      <p className="profile-bio">{data.bio}</p>
      <div className="profile-socials">
        {Object.entries(data.socials).map(([name, url]) => (
          <a key={name} href={url} target="_blank" rel="noreferrer">
            {name}
          </a>
        ))}
      </div>
      <hr />
    </div>
  )
}