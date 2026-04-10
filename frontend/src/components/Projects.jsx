import { useState } from 'react'
import './Projects.css'

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

export default function Projects() {
  const [data] = useState(projectsData)

  return (
    <section>
      <h2>Projects [Endeavour]</h2>
      {data.map((p, i) => (
        <div key={i} className="projectt-item">
          <a href={p.link} target="_blank" rel="noreferrer" className="projectt-name">{p.title}</a>
          <p className="projectt-description">{p.description}</p>
        </div>
      ))}
    </section>
  )
}