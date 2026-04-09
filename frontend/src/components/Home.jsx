import { useEffect, useState } from 'react'
import './Home.css'

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setData)
  }, [])

  if (!data) return null

  const SocialIcon = ({ platform }) => {
    switch(platform) {
      case 'twitter':
        return <span style={{ fontSize: '22px' }}>𝕏</span>
      case 'github':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.348c.42-.648 1.36-1.573 3.322-1.573 2.429 0 4.251 1.574 4.251 4.963v5.908zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.7 0-.943.77-1.7 1.916-1.7 1.144 0 1.915.757 1.915 1.7 0 .942-.771 1.7-1.915 1.7zm1.583 11.019H3.754V8.787h3.166v11.665zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        )
    }
  }

  return (
    <div className="profile">
      <div className="profile-avatar">👤</div>
      <div className="profile-info">
        <h1 className="profile-name">{data.name}</h1>
        <div className="profile-meta">
          <span>{data.title}</span>
          <span className="meta-separator">·</span>
          <span>{data.email}</span>
          <span className="copy-icon">📋</span>
        </div>
        <p className="profile-bio">{data.bio}</p>
        <div className="profile-socials">
          {Object.entries(data.socials).map(([key, url]) => (
            <a 
              key={key} 
              href={url} 
              target="_blank" 
              rel="noreferrer"
              className={`social-link social-${key}`}
              
            >
              {key === 'twitter' || key === 'github' || key === 'linkedin' ? (
                <SocialIcon platform={key} />
              ) : (
                '🔗'
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}