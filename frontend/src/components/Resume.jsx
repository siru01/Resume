import { useEffect, useState } from 'react'
import './Resume.css'

const resumeData = {
    "education": [
        {
            "degree": "Your Degree Name",
            "school": "University Name",
            "year": "2020 - 2024",
            "description": "Add details about your education here"
        }
    ],
    "skills": [
        {
            "category": "Technical Skills",
            "items": ["React", "Python", "JavaScript", "Node.js", "FastAPI"]
        },
        {
            "category": "Languages",
            "items": ["English", "Hindi"]
        }
    ],
    "certifications": [
        {
            "name": "Your Certification Name",
            "issuer": "Issuing Organization",
            "year": "2024",
            "description": "Add certification details here"
        }
    ]
}

export default function Resume() {
  const [data] = useState(resumeData)

  return (
    <section>
      <h2>Resume</h2>
      <div className="resume-container">
        {data.education && data.education.length > 0 && (
          <div className="resume-section">
            <h3>Education</h3>
            {data.education.map((edu, i) => (
              <div key={i} className="resume-item">
                <div className="resume-title">{edu.degree}</div>
                <div className="resume-meta">{edu.school} · {edu.year}</div>
                <div className="resume-description">{edu.description}</div>
              </div>
            ))}
          </div>
        )}

        {data.skills && data.skills.length > 0 && (
          <div className="resume-section">
            <h3>Skills</h3>
            {data.skills.map((skill, i) => (
              <div key={i} className="resume-item">
                <div className="resume-title">{skill.category}</div>
                <div className="resume-description">
                  {skill.items.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <div className="resume-section">
            <h3>Certifications</h3>
            {data.certifications.map((cert, i) => (
              <div key={i} className="resume-item">
                <div className="resume-title">{cert.name}</div>
                <div className="resume-meta">{cert.issuer} · {cert.year}</div>
                <div className="resume-description">{cert.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}