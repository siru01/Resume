import { useEffect, useState } from 'react'
import './Experience.css'

export default function Experience() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/experience').then(r => r.json()).then(setData)
  }, [])

  return (
    <section>
      <h2>Experience</h2>
      {data.map((exp, i) => (
        <div key={i} className="experience-item">
          <div className="company-name">
            {exp.company}
            <span className={`company-status ${exp.status === 'Working' ? 'active' : ''}`}>
              {exp.status || 'Previous'}
            </span>
          </div>
          <div className="roles">
            {exp.roles.map((role, j) => (
              <div key={j} className="role">
                <div className="role-title">{role.title}</div>
                <div className="role-duration">{role.start} — {role.end}</div>
                <div className="role-location">{role.location}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
