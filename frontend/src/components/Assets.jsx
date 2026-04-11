import './Assets.css'

export default function Assets() {
  const specs = [
    { label: 'Processor', value: 'AMD Ryzen 5 5600H @ 3.30GHz' },
    { label: 'Memory', value: '8GB DDR4 3200MHz' },
    { label: 'Graphics', value: 'NVIDIA GeForce GTX 1650 4GB' },
    { label: 'Storage', value: '512GB NVMe SSD ' },
    { label: 'Display', value: '27" 1080p 60Hz IPS + 15" 1080p 60Hz' },
    { label:  'Camera' , value: 'Nikon Coolpix A100'}
  ]

  const setup = [
    { label: 'VS Code', value: 'A lightweight, and extensible open-source code editor ' },
    { label: 'Antigravity', value: 'An AI-powered development Code Editor' },
    { label: 'Claude code', value: 'Anthropic AI coding assistant' },
    { label: 'Postman', value: 'Build, test, share, and document APIs efficiently' },
    { label: 'Jupiter Notebook', value: 'Superior for data exploration, visualization, and rapid prototyping' },
    { label: 'Virtual Box', value: 'Creating isolated development environments' },
    
  ] 

  return (
    <div className="ast-page">
      <section className="ast-section">
        <h2 className="ast-title">Rig [Specs]</h2>
        <div className="ast-specs-grid">
          {specs.map((item, i) => (
            <div key={i} className="ast-spec-item">
              <span className="ast-spec-label">{item.label}</span>
              <span className="ast-spec-value">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="ast-section-divider"></div>

      <section className="ast-section">
        <h2 className="ast-title">Setup [Workspace]</h2>
        <div className="ast-specs-grid">
          {setup.map((item, i) => (
            <div key={i} className="ast-spec-item">
              <span className="ast-spec-label">{item.label}</span>
              <span className="ast-spec-value">{item.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
