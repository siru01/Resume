import { useState } from 'react'
import './Experience.css'

const experience = [
  {
    "company": "KGeN [INDGG]",
    "status": null,
    "roles": [    
      {
        "title": "Game tester",
        "start": "May 2024",
        "end": "Dec 2024",
        "location": "Remote",
        "responsibilities": [
          "Tested game functionality and reported bugs",
          "Provided feedback on gameplay mechanics",
          "Documented test results and improvements"
        ]
      },
    ]
  },
  {
    "company": "Codesoft",
    "status": "Python internship",
    "roles": [
      {
        "title": "Python intern",
        "start": "April 2023",
        "end": "August 2023",
        "location": "Remote",
        "responsibilities": [
          "Built Python applications using modern frameworks",
          "Collaborated with team on feature development",
          "Participated in code reviews and testing"
        ]
      },
    ]
  },
]

export default function Experience() {
  const [data] = useState(experience)

  return (
    <section>
      <h2>Former Organizations</h2>
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