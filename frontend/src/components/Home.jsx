import { useEffect, useState } from 'react'

export default function Profile() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setData)
  }, [])

  if (!data) return null

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 8,
          background: '#1e1e1e', border: '1px solid #333',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22
        }}>👤</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#fff' }}>{data.name}</div>
          <div style={{ color: '#888', fontSize: 13 }}>
            {data.title} · <a href={`mailto:${data.email}`} style={{ color: '#888' }}>{data.email}</a>
          </div>
        </div>
      </div>
      <p style={{ color: '#aaa', fontSize: 14, marginBottom: '1rem' }}>{data.bio}</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {Object.entries(data.socials).map(([name, url]) => (
          <a key={name} href={url} target="_blank" rel="noreferrer"
            style={{ color: '#666', fontSize: 13, borderBottom: '1px solid #333' }}>
            {name}
          </a>
        ))}
      </div>
      <hr />
    </div>
  )
}