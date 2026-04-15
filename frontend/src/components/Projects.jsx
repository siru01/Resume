import { useState } from 'react'
import './Projects.css'

const projectsData = [
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
    title: "Kite [File Transfer]",
    description: "A browser-based peer-to-peer file sharing application that enables devices on the same Wi-Fi network to discover each other and transfer files directly, without any cloud storage or external servers, the project demonstrates applied knowledge of networking protocols, asynchronous Python, binary data handling in the browser, and full-stack integration",
    link: "https://github.com/siru01/Kite.git",
    Live: "https://kite-azure.vercel.app",
  },
  {
    title: "Content Monitoring System",
    description: "This system monitors external content against user-defined keywords, generates match scores, and provides a review workflow with intelligent suppression rules. When a flag is marked irrelevant, it stays suppressed unless the underlying content changes.",
    link: "https://github.com/siru01/content-monitoring-system.git",
    Live: null, 
  },
];
  
export default function Projects() {
  const [data] = useState(projectsData)

  const SocialIcon = ({ platform }) => {
    switch (platform) {
      case 'github':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )
    }
  }

  return (
    <section className="proj-page">
      <h2 className="proj-section-title">Projects [Endeavour]</h2>
      {data.map((project, i) => (
        <div key={i} className="proj-item">
          
          {/* Row 1: Title */}
          <div className="proj-header">
            <span className="proj-title">{project.title}</span>
          </div>

          {/* Row 2: Description */}
          <div className="proj-description-row">
            <p className="proj-description">
              {project.description}
            </p>
          </div>

          {/* Row 3: Project Links (GitHub + Live Icon) */}
          <div className="proj-actions">
            <a href={project.link} target="_blank" rel="noreferrer" className="proj-github-icon" title="View Source Code">
              <SocialIcon platform="github" />
            </a>
            {project.Live && (
              <a href={project.Live} target="_blank" rel="noreferrer" className="proj-live-icon" title="View Live Site">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            )}
          </div>

        </div>
      ))}
    </section>
  )
}