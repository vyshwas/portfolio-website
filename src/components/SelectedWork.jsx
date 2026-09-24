import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../lib/motion.js'
import { projects } from '../data/projects.js'
import { ProjectWorkspace } from './Projects.jsx'
import Icon from './Icon.jsx'
import './selected-work.css'

gsap.registerPlugin(Flip, ScrollTrigger)

const presentation = {
  Awara: { slug: 'awara', category: 'Research & product systems', group: 'product', format: 'phone', width: 760, height: 1648 },
  Nocturne: { slug: 'nocturne', category: 'Trust & interaction design', group: 'product', format: 'phone', width: 780, height: 1600 },
  Munim: { slug: 'munim', category: 'Agentic finance & product systems', group: 'product', format: 'screen', width: 890, height: 667 },
  Tuck: { slug: 'tuck', category: 'Behaviour design & mobile', group: 'product', format: 'screen', width: 800, height: 600 },
  'The Whole Fruit': { slug: 'whole-fruit', category: 'Brand strategy & packaging', group: 'brand', format: 'photo', width: 1070, height: 1470, image: './assets/painting/whole-fruit.webp' },
  Gamut: { slug: 'gamut', category: 'Design tooling & engineering', group: 'brand', format: 'screen', width: 860, height: 640 },
}
const ordered = [projects[2], projects[0], projects[1], projects[4], projects[3], projects[5]]
const filters = [
  { id: 'all', label: 'All work' },
  { id: 'product', label: 'Product design' },
  { id: 'brand', label: 'Brand & tools' },
]

const refreshLayout = () => {
  ScrollTrigger.refresh()
  window.__lenis?.resize()
}

export default function SelectedWork() {
  const root = useRef(null)
  const grid = useRef(null)
  const previousLayout = useRef(null)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('study')
  const calm = useReducedMotion()
  const visible = ordered.filter(project => filter === 'all' || presentation[project.title].group === filter)

  useLayoutEffect(() => {
    const state = previousLayout.current
    previousLayout.current = null
    const context = gsap.context(() => {
      if (calm) return
      if (state) {
        Flip.from(state, {
          targets: grid.current.children,
          duration: .65,
          ease: 'power3.inOut',
          scale: true,
          stagger: .035,
          onEnter: elements => gsap.fromTo(elements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: .5, delay: .15, clearProps: 'opacity,transform' },
          ),
          onComplete: refreshLayout,
        })
      } else {
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
      }
    }, root)
    const frame = requestAnimationFrame(refreshLayout)
    return () => {
      cancelAnimationFrame(frame)
      context.revert()
    }
  }, [filter, calm])

  const chooseFilter = next => {
    if (next === filter) return
    Flip.killFlipsOf(grid.current.children)
    previousLayout.current = calm ? null : Flip.getState(grid.current.children)
    setFilter(next)
  }
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

        <div className="work-toolbar">
          <div className="work-filters" role="group" aria-label="Filter selected work">
            {filters.map(item => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                aria-controls="work-gallery"
                onClick={() => chooseFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="work-count" role="status" aria-live="polite" aria-atomic="true">
            {visible.length} projects
          </p>
        </div>

        <div id="work-gallery" ref={grid} className={'work-grid' + (filter !== 'all' ? ' is-filtered' : '')}>
          {visible.map(project => {
            const detail = presentation[project.title]
            return (
              <article key={project.no} className={'work-piece work-piece--' + detail.slug} data-project={detail.slug} data-flip-id={project.no} aria-labelledby={'work-title-' + detail.slug}>
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
                  <p className="work-category">{detail.category}</p>
                  <h3 id={'work-title-' + detail.slug}>{project.title}</h3>
                  <p className="work-summary">{project.tagline}</p>
                  <div className="work-actions">
                    <button className="work-study" type="button" onClick={() => open(project, 'study')} aria-label={'Read the ' + project.title + ' case study'}>
                      Case study <Icon name="arrow" />
                    </button>
                    {project.protoUrl ? (
                      <button className="work-demo" type="button" onClick={() => open(project, 'prototype')} aria-label={'Try the ' + project.title + ' prototype'}>
                        Try prototype <Icon name="external" />
                      </button>
                    ) : project.link ? (
                      <a className="work-demo" href={project.link} target="_blank" rel="noopener noreferrer">
                        {project.title === 'Gamut' ? 'Open Gamut' : 'Brand system'} <Icon name="external" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {selected && (
        <ProjectWorkspace
          key={selected.no}
          project={selected}
          mode={mode}
          onMode={setMode}
          onClose={() => setSelected(null)}
          onNext={() => open(visible[(visible.indexOf(selected) + 1) % visible.length], 'study')}
        />
      )}
    </section>
  )
}
