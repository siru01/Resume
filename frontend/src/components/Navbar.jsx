export default function Navbar({ page, setPage }) {
  const links = ['home', 'work', 'projects', 'blog', 'resume']

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: '2rem',
      padding: '1.2rem 0', borderBottom: '1px solid #2a2a2a',
      marginBottom: '2rem', justifyContent: 'center'
    }}>
      {links.map(l => (
        <button key={l} onClick={() => setPage(l)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: page === l ? '#fff' : '#888',
          fontFamily: 'inherit', fontSize: '14px',
          textTransform: 'capitalize', padding: 0,
        }}>
          {l.charAt(0).toUpperCase() + l.slice(1)}
        </button>
      ))}
    </nav>
  )
}