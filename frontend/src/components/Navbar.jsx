import './Navbar.css'

export default function Navbar({ page, setPage }) {
  const links = ['home', 'experience', 'projects', 'blog', 'resume']

  return (
    <nav>
      {links.map(l => (
        <button
          key={l}
          onClick={() => setPage(l)}
          className={page === l ? 'active' : ''}
        >
          {l.charAt(0).toUpperCase() + l.slice(1)}
        </button>
      ))}
    </nav>
  )
}