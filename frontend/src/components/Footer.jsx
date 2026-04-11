import './Footer.css'

export default function Footer({ setPage }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Navigate Column */}
        <div className="footer-col">
          <h3 className="footer-title">Navigate</h3>
          <ul className="footer-links">
            <li onClick={() => setPage('home')}>Home</li>
            <li onClick={() => setPage('experience')}>Work</li>
            <li onClick={() => setPage('projects')}>Projects</li>
            {/*<li onClick={() => setPage('blog')}>Blog</li>*/}
            <li onClick={() => setPage('resume')}>Resume</li>
          </ul>
        </div>

        {/* Assets Column */}
        <div className="footer-col">
          <h3 className="footer-title">Assets</h3>
          <ul className="footer-links">
            <li onClick={() => setPage('assets')}>Rig [specs]</li>
            <li onClick={() => setPage('assets')}>Setup</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {currentYear} Sirjan Murmu. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
