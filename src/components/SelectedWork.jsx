import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../lib/motion.js'
import { projects } from '../data/projects.js'
import { ProjectWorkspace } from './Projects.jsx'
import Icon from './Icon.jsx'
import './selected-work.css'

gsap.registerPlugin(ScrollTrigger)

const presentation = {
  Awara: { slug: 'awara', category: 'Research & product systems', format: 'mockup', width: 1600, height: 1000 },
  Nocturne: { slug: 'nocturne', category: 'Trust & interaction design', format: 'mockup', width: 1600, height: 1000 },
  Munim: { slug: 'munim', category: 'Agentic finance & product systems', format: 'mockup', width: 1600, height: 1000 },
  Tuck: { slug: 'tuck', category: 'Behaviour design & mobile', format: 'mockup', width: 1600, height: 1000 },
  'The Whole Fruit': { slug: 'whole-fruit', category: 'Brand strategy & packaging', format: 'photo', width: 1070, height: 1470, image: './assets/painting/whole-fruit.webp' },
  Gamut: { slug: 'gamut', category: 'Design tooling & engineering', format: 'screen', width: 860, height: 640 },
}

const mainProjects = projects.slice(0, 4)
const secondaryProjects = projects.slice(4)
// Numbers follow the order on the page, so they can never drift from the data order.
const numberOf = project => String(projects.indexOf(project) + 1).padStart(2, '0')

export default function SelectedWork() {
  const root = useRef(null)
  const grid = useRef(null)
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('study')
  const calm = useReducedMotion()

  useLayoutEffect(() => {
    if (calm) return
    const context = gsap.context(() => {
      for (const piece of grid.current.children) {
        gsap.timeline({ scrollTrigger: { trigger: piece, start: 'top 90%', once: true } })
          .from(piece.querySelector('.work-art'), {
            y: 42, opacity: 0, rotation: -.6, duration: .9,
            ease: 'power3.out', clearProps: 'opacity,transform',
          })
          .from(piece.querySelector('.work-caption'), {
            y: 16, opacity: 0, duration: .65,
            ease: 'power3.out', clearProps: 'opacity,transform',
          }, .12)
      }
    }, root)
    return () => {
      context.revert()
    }
  }, [calm])

  const open = (project, nextMode) => {
    setSelected(project)
    setMode(nextMode)
  }

  return (
    <section id="experiments" tabIndex={-1} ref={root} className={'selected-work' + (calm ? ' is-calm' : '')} aria-labelledby="work-heading">
      <div className="work-container">
        <header className="gallery-heading">
          <h2 id="work-heading">Selected <em>work.</em></h2>
          <p>The ideas, the decisions, and the things I brought to life.</p>
        </header>

        <div id="work-gallery" ref={grid} className="work-grid">
          {mainProjects.map(project => {
            const detail = presentation[project.title]
            return (
              <article key={project.no} className={'work-piece work-piece--' + detail.slug} data-project={detail.slug} aria-labelledby={'work-title-' + detail.slug}>
                <button
                  className={'work-art work-art--' + detail.format}
                  type="button"
                  onClick={() => open(project, 'study')}
                  aria-label={'Read the ' + project.title + ' case study'}
                >
                  <span className="work-image">
                    <img src={detail.image || project.preview} alt={project.previewAlt} width={detail.width} height={detail.height} loading="lazy" decoding="async" />
                  </span>
                </button>
                <div className="work-caption">
                  <p className="work-category"><span className="work-no">{numberOf(project)}</span>{detail.category}</p>
                  <h3 id={'work-title-' + detail.slug}>{project.title}</h3>
                  <p className="work-summary">{project.tagline}</p>
                  <div className="work-actions">
                    <button className="work-study" type="button" onClick={() => open(project, 'study')} aria-label={'Read the ' + project.title + ' case study'}>
                      Case study <Icon name="arrow" />
                    </button>
                    {project.protoUrl && (
                      <button className="work-demo" type="button" onClick={() => open(project, 'prototype')} aria-label={'Try the ' + project.title + ' prototype'}>
                        Try prototype <Icon name="external" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        
        <div className="secondary-work" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Brand &amp; Tooling</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {secondaryProjects.map(project => (
              <li key={project.no}>
                <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                  <span className="work-no">{numberOf(project)}</span><span>{project.title} — <span style={{ opacity: 0.7, fontWeight: 400 }}>{project.tagline}</span></span> <Icon name="external" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selected && (
        <ProjectWorkspace
          key={selected.no}
          project={selected}
          mode={mode}
          onMode={setMode}
          onClose={() => setSelected(null)}
          onNext={() => open(mainProjects[(mainProjects.indexOf(selected) + 1) % mainProjects.length], 'study')}
        />
      )}
    </section>
  )
}
