import { useState } from 'react'
import './Home.css'
import ImageGallery from './ImageGallery';const profileData = {
  name: "SIRJAN MURMU",
  title: "Engineer · Versatile",
  email: "murmu.sirjan10@gmail.com",
  bio: "With a terminal, a vision, and to learn something new everyday.",
  socials: {
    twitter: "https://x.com/Siruishere",
    linkedin: "https://www.linkedin.com/in/sirjanmurmu",
    github: "https://github.com/siru01",
    mail: "murmu.sirjan10@gmail.com",
  }
}
 
const experienceData = [
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
]


const projectsData = [
  {
    title: "Alziermers-Diseases-Detection",
    description: "Developed an AI-based diagnostic tool using machine learning to detect early-stage Alzheimer . It's detection and classification with MRI data accuray is very high using a good dataset, from OASIS and ADNI.",
    link: "https://github.com/siru01/Alziermers-Diseases-Detection.git",
    Live: null,
  }, 
  {
    title: "E-Book Reader [Shelf]",
    description: "Shelf is a sophisticated, minimalist web application designed for the modern reader. It transforms the way you interact with your book collection by providing a seamless interface to explore new titles, manage your reading progress, and maintain a virtual rack of every book you've ever touched.",
    link: "https://github.com/siru01/e-book.git",
    Live: null,
  }
]

const GADGETS = [
  { label: 'RIG [Specs]', value: 'Curated collection of essential hardware where performance meets purpose and every gadget earns its place.'}, 
  { label: 'SETUP [Workspace]', value: 'Precision-honed toolkit where code meets craft and the right software turns a vision into a reality.'}
]

const personal = [ {label: 'Atheletic', value: 'I am a dedicated athlete who leverages the discipline of volleyball and football to maintain the mental clarity and physical endurance essential for high-level problem-solving.'}

]

export default function Home({ setPage }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(profileData.email);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = profileData.email;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    } finally {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const SocialIcon = ({ platform }) => {
    switch (platform) {
      case 'twitter':
        return <span style={{ fontSize: '24px' }}>𝕏</span>
      case 'github':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.348c.42-.648 1.36-1.573 3.322-1.573 2.429 0 4.251 1.574 4.251 4.963v5.908zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.7 0-.943.77-1.7 1.916-1.7 1.144 0 1.915.757 1.915 1.7 0 .942-.771 1.7-1.915 1.7zm1.583 11.019H3.754V8.787h3.166v11.665zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
          </svg>
        )
      case 'mail':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
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
    <div className="home-page" >
      {/* ── Profile Section ── */}
      <div className="profile">
        <div className="profile-avatar">
          <ImageGallery images={['/mainprofile.jpeg', '/pic.jpeg', '/profile-2.jpg', '/profile-3.jpg', '/profile-5.jpg']} />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{profileData.name}</h1>
          <div className="profile-meta">
            <span>{profileData.title}</span>
            <span className="meta-separator">·</span>
            <span className="profile-email-container">
              <span>{profileData.email}</span>
              <span className="copy-wrapper" onClick={handleCopyEmail} title="Copy Email">
                {copied ? (
                  <span className="copied-text">Copied!</span>
                ) : (
                  <svg className="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </span>
            </span>
          </div>
          <p className="profile-bio">{profileData.bio}</p>
          <div className="profile-socials">
  {Object.entries(profileData.socials).map(([key, url]) => {
    const isMail = key === 'mail';
    const href = isMail ? `mailto:${url}` : url;
    
    return (
      <a key={key} href={href} target={isMail ? '_self' : '_blank'} rel="noreferrer" className={`social-link social-${key}`}>
        {['twitter', 'github', 'linkedin', 'mail'].includes(key) ? (
          <SocialIcon platform={key} />
        ) : (
          '🔗'
        )}
      </a>
    );
  })}
</div>
        </div>
      </div>

      {/* ── Experience Section ── */}
<div className="experience">
  <h2 className="experience-title">Experience</h2>
  {experienceData.map((job, i) => (
    <div key={i} className="experience-company">
      {job.roles.map((role, j) => (
        <div key={j} className="experience-role">
          <div className="role-top">
            <span className="role-title">{role.title}</span>
            <span className="role-dates">{role.start} – {role.end}</span>
          </div>
          <div className="role-sub">
            <span className="company-name">{job.company}</span>
            <span className="role-location">{role.location}</span>
          </div>
          <ul className="role-responsibilities">
            {role.responsibilities.map((item, k) => (
              <li key={k}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ))}
</div>


    <div className="section-divider"></div>

{/* ── Projects Section ── */}
<div className="projects-container">
  <h2 className="project-section-title">Projects</h2>
  
  {projectsData.map((project, i) => (
    <div key={i} className="project-item">
      
      {/* Row 1: Title */}
      <div className="project-header">
        <span className="project-title">{project.title}</span>
      </div>

      {/* Row 2: Description & Live Link */}
      <div className="project-description-row">
        <p className="project-description">
          {project.description}
        </p>
        
        {/* Only renders "Live Demo" if the link is not null */}
        {project.Live && (
          <a 
            href={project.Live} 
            target="_blank" 
            rel="noreferrer" 
            className="project-live-link"
          >
            Live Demo ↗
          </a>
        )}
      </div>

      {/* Row 3: Project Links (GitHub Icon) */}
      <div className="project-actions">
        <a href={project.link} target="_blank" rel="noreferrer" className="project-github-icon" title="View Source Code">
          <SocialIcon platform="github" />
        </a>
      </div>

    </div>
  ))}
    </div>

    <div className="show-all-container">
      <div className="show-all-box" onClick={() => setPage('projects')}>
        Show all Projects
      </div>
    </div>

    <div className="section-divider"></div>

    {/* ── Assets Section ── */}
    <div className="home-assets-section">
      <h2 className="project-section-title">ASSETS</h2>
      <div className="assets-cards-container">
        {GADGETS.map((item, i) => (
          <div key={i} className="asset-card" onClick={() => setPage('assets')}>
            <div className="asset-card-content">
              <h3 className="asset-card-label">{item.label}</h3>
              <p className="asset-card-value">{item.value}</p>
            </div>
            <div className="asset-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="section-divider"></div>

    {/* ── Personal Section ── */}
    <div className="home-personal-section">
      <h2 className="project-section-title">PERSONAL</h2>
      <div className="personal-content">
        {personal.map((item, i) => (
          <div key={i} className="personal-item">
            <p className="personal-description">
              <span className="personal-label">{item.label}:</span> {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="section-divider"></div>

    {/* ── Toast Notification ── */}
    {copied && (
      <div className="toast-notification">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Email copied!</span>
      </div>
    )}
  </div>
)
}