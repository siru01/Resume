import './Resume.css'

export default function Resume() {
  return (
    <section>
      <h2>Resume</h2>
      <div className="resume-container">
        <div className="resume-section">
          <h3>Education</h3>
          <div className="resume-item">
            <div className="resume-title">Your Degree</div>
            <div className="resume-meta">University Name · 2020 - 2024</div>
            <div className="resume-description">Add your educational background here</div>
          </div>
        </div>

        <div className="resume-section">
          <h3>Skills</h3>
          <div className="resume-item">
            <div className="resume-title">Technical Skills</div>
            <div className="resume-description">
              Add your technical skills here: React, Node.js, Python, etc.
            </div>
          </div>
        </div>

        <div className="resume-section">
          <h3>Certifications</h3>
          <div className="resume-item">
            <div className="resume-title">Your Certification</div>
            <div className="resume-meta">Issuing Organization · 2024</div>
            <div className="resume-description">Add certification details</div>
          </div>
        </div>
      </div>
    </section>
  )
}