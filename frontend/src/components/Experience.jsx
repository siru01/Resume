import { useEffect, useState } from 'react'
import './Experience.css'

export default function Experience() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/experience').then(r => r.json()).then(setData)
  }, [])

  return (
    <section>
      <h2>Companies i have worked for ...</h2>
      {data.map((exp, i) => (
        exp.roles.map((role, j) => (
          <div key={`${i}-${j}`} className="experience-item">
            <div className="experience-header">
              <div className="experience-left">
                <h3 className="role-title">{role.title}</h3>
                <h4 className="company-name">{exp.company}</h4>
              </div>
              <div className="experience-right">
                <div className="role-duration">{role.start} - {role.end}</div>
                <div className="role-location">{role.location}</div>
              </div>
            </div>
            {role.responsibilities && (
              <ul className="responsibilities">
                {role.responsibilities.map((resp, k) => (
                  <li key={k}>{resp}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      ))}
    </section>
  )
}
