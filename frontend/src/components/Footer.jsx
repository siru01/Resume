import './Footer.css'

export default function Footer({ setPage }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="foot-site-footer">
      <div className="foot-grid">
        {/* Navigate Column */}
        <div className="foot-col">
          <h3 className="foot-title">Navigate</h3>
          <ul className="foot-links">
            <li onClick={() => setPage('home')}>Home</li>
            <li onClick={() => setPage('experience')}>Work</li>
            <li onClick={() => setPage('projects')}>Projects</li>
            {/*<li onClick={() => setPage('blog')}>Blog</li>*/}
            <li onClick={() => setPage('resume')}>Resume</li>
          </ul>
        </div>

        {/* Assets Column */}
        <div className="foot-col">
          <h3 className="foot-title">Assets</h3>
          <ul className="foot-links">
            <li onClick={() => setPage('assets')}>Rig [specs]</li>
            <li onClick={() => setPage('assets')}>Setup</li>
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <p className="foot-copyright">
          © {currentYear} Sirjan Murmu. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
