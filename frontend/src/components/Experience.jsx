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
          "Executed comprehensive QA testing for Web3-based titles, identifying and documenting critical bugs in gameplay loops, UI/UX flows",
          "Collaborated with development teams via detailed bug reports, utilizing structured feedback to improve performance, game stability, and the overall onboarding process for new users.",
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
          "Engineered functional Python applications, including a secure Password Generator and Task Manager, utilizing standard libraries to handle user input and data persistence.",
          "Implemented core algorithmic logic and randomization for interactive programs, ensuring robust error handling and a seamless user interface (CLI).",
        ]
      },
    ]
  },
]

export default function Experience() {
  const [data] = useState(experience)

  return (
    <section>
      <div className="heading">
        <h2>Former Organizations</h2>
      </div>
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