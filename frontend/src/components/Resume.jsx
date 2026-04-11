import { useEffect, useState } from 'react'
import './Resume.css'

const resumeData = {
    My_Data: [{
          name: "SIRJAN MURMU",
          email: "murmu.sirjan10@gmail.com",
        location:"Haldia",
        socials:{
            github:"https://github.com/sirjanmurmu",
            linkedin:"https://www.linkedin.com/in/sirjanmurmu",
            twitter:"https://twitter.com/sirjanmurmu"
        }
    }
],

    experience: [
  {
    company: "KGeN [INDGG]",
    status: null,
    roles: [
      {
        title: "Game tester",
        start: "May 2024",
        end: "Dec 2024",
        location: "Remote",
        responsibilities: [
          "Executed comprehensive QA testing for Web3-based titles, identifying and documenting critical bugs in gameplay loops, UI/UX flows",
          "Collaborated with development teams via detailed bug reports, utilizing structured feedback to improve performance, game stability, and the overall onboarding process for new users.",
        ]
      }
    ]
  },
  {
    company: "Codesoft",
    status: "Python internship",
    roles: [
      {
        title: "Python intern",
        start: "April 2023",
        end: "August 2023",
        location: "Remote",
        responsibilities: [
          "Engineered functional Python applications, including a secure Password Generator and Task Manager, utilizing standard libraries to handle user input and data persistence.",
          "Implemented core algorithmic logic and randomization for interactive programs, ensuring robust error handling and a seamless user interface (CLI).",
        ]
      }
    ]
  }
],

    projects: [
  {
    title: "Alziermers-Diseases-Detection",
    description: "Developed an AI-based diagnostic tool using machine learning to detect early-stage Alzheimer. It's detection and classification with MRI data accuracy is very high using a good dataset, from OASIS and ADNI.",
    link: "https://github.com/siru01/Alziermers-Diseases-Detection.git",
    Live: null,
  }, 
  {
    title: "E-Book Reader [Shelf]",
    description: "Shelf is a sophisticated, minimalist web application designed for the modern reader. It transforms the way you interact with your book collection by providing a seamless interface to explore new titles, manage your reading progress, and maintain a virtual rack of every book you've ever touched.",
    link: "https://github.com/siru01/e-book.git",
    Live: null,
  },
  {
    title: "Data Transfer [Kite]",
    description: "A browser-based peer-to-peer file sharing application that enables devices on the same Wi-Fi network to discover each other and transfer files directly, without any cloud storage or external servers, the project demonstrates applied knowledge of networking protocols, asynchronous Python, binary data handling in the browser, and full-stack integration",
    link: "https://github.com/siru01/Kite.git",
    Live: null,
  },
  {
    title: "Content Monitoring System",
    description: "This system monitors external content against user-defined keywords, generates match scores, and provides a review workflow with intelligent suppression rules. When a flag is marked irrelevant, it stays suppressed unless the underlying content changes.",
    link: "https://github.com/siru01/content-monitoring-system.git",
    Live: null,
  },
],
    skills: [
        {
            languages: ["C", "Python", "JavaScript"]
        },
        {
            frameworks: ["React","Node.js","FastAPI","django","tkinter","vite","nmap","wireshark","metasploit","burp suite","bettercap"]  
        },
        {
          tools: ["Git", "GitHub", "Antigravity", "VS Code", "Postman", "Jupyter Notebook","Virtual Box","Adobe Express","Notion" ]

        },
        {
        cloud_Platforms : ["Google Cloud"],
        google_cloud_public_profile:["https://www.skills.google/public_profiles/ca23be66-24c8-43a6-b85b-74136aa11351"]
        },
        {
          databases: ["MySQL", "SQLite", "MongoDB", "PostgreSQL"]
        },
        {
          Languages: ["English", "Hindi","Bengali"]
        },
    ],

    certifications: [
        {
            "name": "Foundation of Cybersecurity",
            "issuer": "Coursera",
            "year": "2023",
        },
        {
            "name": "Getting Started with Microsoft Excel",
            "issuer": "Coursera",
            "year": "2023",
        }
    ],
    education: [
        {
            degree: "Bachelor of Technology",
            school: "Maulana Abul Kalam Azad University of Technology",
            branch: "Information Technology",
            cgpa: "8.5",
            year: "2021 - 2025",
        }
    ]
}


export default function Resume() {
  const [data] = useState(resumeData)

  const personalInfo = data.My_Data[0]

  const SocialIcon = ({ platform }) => {
    switch (platform) {
      case 'github':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section className="resume-page">
      {/* Header Section */}
      <header className="resume-header">
        <h1 className="resume-name">{personalInfo.name}</h1>
        <div className="resume-contact">
          <span>{personalInfo.email}</span>
          <span className="resume-separator">·</span>
          <span>{personalInfo.location}</span>
        </div>
        <div className="resume-socials">
          <a href={personalInfo.socials.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={personalInfo.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={personalInfo.socials.twitter} target="_blank" rel="noreferrer">Twitter</a>
        </div>
      </header>

      <div className="resume-container">
        
        {/* Experience Section - Synced with Experience.jsx */}
        <div className="resume-section">
          <div className="resume-heading">
            <h2 className="resume-section-title">Former Organizations</h2>
          </div>
          {data.experience.map((exp, i) => (
            exp.roles.map((role, j) => (
              <div key={`${i}-${j}`} className="resume-experience-item">
                <div className="resume-experience-header">
                  <div className="resume-experience-left">
                    <h3 className="resume-role-title">{role.title}</h3>
                    <h4 className="resume-company-name">{exp.company}</h4>
                  </div>
                  <div className="resume-experience-right">
                    <div className="resume-role-duration">{role.start} - {role.end}</div>
                    <div className="resume-role-location">{role.location}</div>
                  </div>
                </div>
                {role.responsibilities && (
                  <ul className="resume-responsibilities">
                    {role.responsibilities.map((resp, k) => (
                      <li key={k}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ))}
        </div>
        <div className="resume-divider"></div>

        {/* Projects Section - Synced with Projects.jsx */}
        <div className="resume-section resume-projects-container">
          <h2 className="resume-project-section-title">Projects</h2>
          {data.projects.map((project, i) => (
            <div key={i} className="resume-project-item">
              <div className="resume-project-header">
                <span className="resume-project-title">{project.title}</span>
              </div>
              <div className="resume-project-description-row">
                <p className="resume-project-description">
                  {project.description}
                </p>
                {project.Live && (
                  <a href={project.Live} target="_blank" rel="noreferrer" className="resume-project-live-link">
                    Live Demo ↗
                  </a>
                )}
              </div>
              <div className="resume-project-actions">
                <a href={project.link} target="_blank" rel="noreferrer" className="resume-project-github-icon" title="View Source Code">
                  <SocialIcon platform="github" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="resume-divider"></div>

        {/* Skills Section - Kept as is */}
        <div className="resume-section">
          <h2 className="resume-section-title">Skills</h2>
          <div className="resume-skills-grid">
            {data.skills.map((skillObj, i) => {
              const category = Object.keys(skillObj)[0];
              const items = skillObj[category];
              return (
                <div key={i} className="resume-skill-category">
                  <h3 className="resume-category-label">{category.replace('_', ' ')}</h3>
                  <div className="resume-skill-tags">
                    {Array.isArray(items) ? 
                      items.map((skill, si) => <span key={si} className="resume-skill-tag">{skill}</span>) :
                      <span className="resume-skill-tag">{items}</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="resume-divider"></div>

        {/* Certifications Section */}
        <div className="resume-section">
          <h2 className="resume-section-title">Certifications</h2>
          {data.certifications.map((cert, i) => (
            <div key={i} className="resume-item resume-certification-item">
              <div className="resume-item-header">
                <span className="resume-item-title">{cert.name}</span>
                <span className="resume-item-date">{cert.year}</span>
              </div>
              <div className="resume-item-sub">{cert.issuer}</div>
            </div>
          ))}
        </div>
        <div className="resume-divider"></div>

        {/* Education Section - Last */}
        <div className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="resume-item resume-education-item">
              <div className="resume-item-header">
                <span className="resume-item-title">{edu.degree}</span>
                <span className="resume-item-date">{edu.year}</span>
              </div>
              <div className="resume-item-sub">
                <span>{edu.school}</span>
                <span className="resume-item-cgpa">CGPA: {edu.cgpa}</span>
              </div>
              <div className="resume-item-branch">{edu.branch}</div>
            </div>
          ))}
        </div>
        <div className="resume-divider"></div>

      </div>
    </section>
  )
}