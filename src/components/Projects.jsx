import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../lib/motion.js'
import { projects } from '../data/projects.js'
import Dialog from './Dialog.jsx'
import Icon from './Icon.jsx'
const ordered = [
  projects[2],
  projects[0],
  projects[1],
  projects[4],
  projects[3],
]
const categories = {
  Awara: 'Research / Product systems',
  Nocturne: 'Trust / Interaction design',
  Munim: 'Agentic finance / Product systems',
  Gamut: 'Design tooling / Engineering',
  'The Whole Fruit': 'Brand strategy / Packaging',
}

function ProjectBadge({ title }) {
  const icons = {
    Awara: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
      </svg>
    ),
    Nocturne: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
      </svg>
    ),
    Munim: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    Gamut: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    'The Whole Fruit': (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="currentColor" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  }
  return (
    <div className="archive-card-center-badge" aria-hidden="true">
      <span className="archive-badge-icon">{icons[title] || <Icon name="external" />}</span>
      <span className="archive-badge-text">{title}</span>
    </div>
  )
}

function ProjectWorkspace({ project, mode, onMode, onClose, onNext }) {
  const [loadedProject, setLoadedProject] = useState(null)
  const [notes, setNotes] = useState(false)
  const frameCleanup = useRef(null)
  const reader = useRef(null)
  useEffect(() => {
    reader.current?.scrollTo(0, 0)
    return () => frameCleanup.current?.()
  }, [project, mode])
  const frameLoaded = (e) => {
    setLoadedProject(project.no)
    // Keyboard events in a same-origin document never bubble out of an iframe.
    frameCleanup.current?.()
    const frameWindow = e.currentTarget.contentWindow
    const escape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    frameWindow.addEventListener('keydown', escape, true)
    frameCleanup.current = () =>
      frameWindow.removeEventListener('keydown', escape, true)
  }
  return (
    <Dialog
      onClose={onClose}
      labelId="project-title"
      className="project-workspace"
    >
      <header className="workspace-header">
        <div className="workspace-name">
          <span className="meta">{project.no}</span>
          <h2 id="project-title">{project.title}</h2>
        </div>
        <div className="workspace-modes" role="group" aria-label="Project view">
          <button
            aria-pressed={mode === 'study'}
            onClick={() => {
              setNotes(false)
              onMode('study')
            }}
          >
            Case study
          </button>
          {project.protoUrl && (
            <button
              aria-pressed={mode === 'prototype'}
              onClick={() => onMode('prototype')}
            >
              Live prototype
            </button>
          )}
        </div>
        <button
          className="workspace-close"
          onClick={onClose}
          aria-label="Close project"
        >
          <span>Close</span>
          <Icon name="close" />
        </button>
      </header>
      {mode === 'prototype' && project.protoUrl ? (
        <div className="prototype-body">
          {loadedProject !== project.no && (
            <p className="prototype-loading" role="status">
              Opening {project.title}…
            </p>
          )}
          <iframe
            src={project.protoUrl}
            title={project.title + ' interactive prototype'}
            onLoad={frameLoaded}
          />
          <div className="prototype-tools">
            <button
              className="button"
              aria-expanded={notes}
              onClick={() => setNotes(!notes)}
            >
              {notes ? 'Close context' : 'Design context'}
            </button>
            <a
              className="button"
              href={project.protoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open separately <Icon name="external" />
            </a>
          </div>
          {notes && (
            <aside className="prototype-notes">
              <button
                className="icon-button"
                aria-label="Close design context"
                onClick={() => setNotes(false)}
              >
                <Icon name="close" />
              </button>
              <h3>The design decision</h3>
              <p>{project.approach}</p>
              <button className="text-link" onClick={() => onMode('study')}>
                Read the case study <Icon />
              </button>
            </aside>
          )}
        </div>
      ) : (
        <div ref={reader} className="case-reader" data-lenis-prevent>
          <div className="case-intro">
            <div className="case-meta meta">
              <span>{project.role}</span>
              <span>{project.year}</span>
            </div>
            <h3>{project.tagline}</h3>
            <div className="case-actions">
              {project.protoUrl ? (
                <button
                  className="button button-light"
                  onClick={() => onMode('prototype')}
                >
                  Run live prototype <Icon name="external" />
                </button>
              ) : (
                <a
                  className="button button-light"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.linkLabel?.replace(' ↗', '') || 'Explore project'}
                  <Icon name="external" />
                </a>
              )}
              <span className="meta">{project.stack.join(' / ')}</span>
            </div>
          </div>
          <figure className="case-figure">
            <img src={project.preview} alt={project.previewAlt} />
          </figure>
          <div className="case-sections">
            <section>
              <h4>Context</h4>
              <p>{project.context}</p>
            </section>
            <section>
              <h4>The problem</h4>
              <p>{project.problem}</p>
            </section>
            <section className="case-approach">
              <h4>The design decision</h4>
              <p>{project.approach}</p>
            </section>
            <section>
              <h4>What the work demonstrates</h4>
              <ul>
                {project.outcome.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
          <button className="next-project" onClick={onNext}>
            <span>Next project</span>
            <Icon name="arrow" />
          </button>
        </div>
      )}
    </Dialog>
  )
}
export default function Projects() {
  const root = useRef(null)
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('study')
  const calm = useReducedMotion()

  useLayoutEffect(() => {
    if (calm) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.archive-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.archive-grid',
            start: 'top 85%',
            once: true,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [calm])

  const getObjectPosition = (pos) => {
    if (!pos) return 'center'
    if (pos === 'object-top') return 'top center'
    if (pos === 'object-center') return 'center center'
    if (pos === 'object-[center_12%]') return 'center 12%'
    if (pos === 'object-[center_42%]') return 'center 42%'
    return 'center'
  }

  const open = (project, nextMode) => {
    setSelected(project)
    setMode(nextMode)
  }

  return (
    <section
      id="experiments"
      tabIndex="-1"
      ref={root}
      className="archive-section"
      aria-labelledby="archive-heading"
    >
      {/* ─── Background Telemetry Graphs Video ─── */}
      <div className="archive-bg-video-wrap" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="archive-bg-video"
        >
          <source src="./assets/awwwards-graphs.mp4" type="video/mp4" />
        </video>
        <div className="archive-bg-scrim" />
      </div>

      <div className="archive-container">
        {/* ─── Left Sticky Sidebar ─── */}
        <aside className="archive-sidebar">
          <div className="archive-kicker">
            <span>Selected work</span>
            <span className="archive-kicker-dot">•</span>
            <span>2024–2025</span>
          </div>
          <h2 id="archive-heading" className="archive-title" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1, marginBottom: '24px' }}>
            Ideas, made
            <br />
            <em style={{ color: 'var(--cyan-deep)', fontStyle: 'italic' }}>tangible.</em>
          </h2>
          <p className="archive-description">
            The decisions behind the interface.
            <br />
            The prototypes that make them real.
          </p>
          <p className="archive-subtext">
            A curated series of product systems, interaction design, and working prototypes exploring clarity at moments of high friction.
          </p>
        </aside>

        {/* ─── Right 2-Column Projects Grid ─── */}
        <div className="archive-grid">
          {ordered.map((project) => (
            <article
              key={project.no}
              className="archive-card"
              tabIndex={0}
              role="button"
              onClick={() => open(project, 'study')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  open(project, 'study')
                }
              }}
              aria-label={`View ${project.title} case study`}
            >
              <img
                className="archive-card-image"
                src={project.preview}
                alt={project.previewAlt}
                style={{ objectPosition: getObjectPosition(project.previewPos) }}
                loading="lazy"
                decoding="async"
              />

              {/* Centered Brand Badge (Reference Style) */}
              <ProjectBadge title={project.title} />

              {/* Hover-only metadata overlay */}
              <div className="archive-card-overlay">
                <div className="archive-card-header">
                  <span className="archive-card-category">
                    {categories[project.title]}
                  </span>
                </div>
                <div className="archive-card-body">
                  <h3 className="archive-card-title">{project.title}</h3>
                  <p className="archive-card-tagline">{project.tagline}</p>
                  <div className="archive-card-stack">
                    {project.stack.map((tag) => (
                      <span key={tag} className="archive-stack-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="archive-card-actions">
                    <button
                      type="button"
                      className="archive-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        open(project, 'study')
                      }}
                    >
                      Case study <Icon name="arrow" />
                    </button>
                    {project.protoUrl ? (
                      <button
                        type="button"
                        className="archive-action-btn archive-action-btn-highlight"
                        onClick={(e) => {
                          e.stopPropagation()
                          open(project, 'prototype')
                        }}
                      >
                        Try prototype <Icon name="external" />
                      </button>
                    ) : project.link ? (
                      <a
                        className="archive-action-btn"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.linkLabel?.replace(' ↗', '') || 'Explore'}{' '}
                        <Icon name="external" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <ProjectWorkspace
          key={selected.no}
          project={selected}
          mode={mode}
          onMode={setMode}
          onClose={() => setSelected(null)}
          onNext={() =>
            open(
              ordered[(ordered.indexOf(selected) + 1) % ordered.length],
              'study',
            )
          }
        />
      )}
    </section>
  )
}

