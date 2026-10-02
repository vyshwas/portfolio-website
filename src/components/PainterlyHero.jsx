import { Fragment, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion, scrollToTarget } from '../lib/motion.js'
import Icon from './Icon.jsx'
import Painting from './Painting.jsx'
import './painting.css'

// Positioning statement. A trailing * marks the word set in italic.
const STATEMENT = 'I make high-stakes moments feel calm.*'.split(' ')

export default function PainterlyHero() {
  const root = useRef(null)
  const calm = useReducedMotion()

  useLayoutEffect(() => {
    const element = root.current
    const visibility = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting)
    })
    visibility.observe(element)
    if (calm) return () => visibility.disconnect()

    const context = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } })
      entrance
        .set('.paint-wipe', { opacity: 1 })
        .fromTo('.paint-wipe span', { scaleX: 1 }, {
          scaleX: 0, duration: 1.35, stagger: 0.075, ease: 'power3.inOut',
        })
        .set('.paint-wipe', { display: 'none' })
        .from('.paint-word', {
          yPercent: 60, opacity: 0, rotation: 2, duration: 1, stagger: 0.07, clearProps: 'all',
        }, 0.45)
        .from('.paint-reveal', {
          y: 24, opacity: 0, duration: 1.05, stagger: 0.11, clearProps: 'all',
        }, 0.6)
        .from('.paint-flora-depth', {
          y: 70, rotation: 4, opacity: 0, duration: 1.6, clearProps: 'all',
        }, 0.65)

      // A small change of perspective as the visitor leaves the painting.
      // The hero stays in normal flow; selected work remains one click away.
      gsap.to('.paint-landscape', {
        yPercent: 9, ease: 'none',
        scrollTrigger: {
          id: 'hero-scene', trigger: element, start: 'top top',
          end: 'bottom top', scrub: true,
        },
      })
    }, root)

    return () => {
      visibility.disconnect()
      context.revert()
    }
  }, [calm])

  return (
    <section
      id="hero"
      ref={root}
      className={'paint-hero' + (calm ? ' is-calm' : '')}
      aria-labelledby="paint-title"
      data-visible="true"
    >
      <div className="paint-landscape" aria-hidden="true">
        <Painting calm={calm} />
      </div>
      <div className="paint-copy">
        <p className="paint-role paint-reveal">
          Vishwas Mehta <span>Product designer, Bengaluru</span>
        </p>
        <h1 id="paint-title" className="paint-title">
          {STATEMENT.map((word, index) => (
            <Fragment key={index}>
              <span className={'paint-word' + (word.endsWith('*') ? ' is-key' : '')}>{word.replace('*', '')}</span>
              {index < STATEMENT.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </h1>
        <p className="paint-description paint-reveal">
          Systems thinking before visual polish.<br />
          Design that ships. Code that feels.
        </p>
        <div className="hero-actions paint-actions paint-reveal">
          <button className="button paint-primary" onClick={() => scrollToTarget('#experiments')}>
            Explore the work <Icon name="arrow" />
          </button>
          <a className="button paint-secondary" href="./resume.pdf" target="_blank" rel="noopener noreferrer">
            Résumé <Icon name="external" />
          </a>
        </div>
      </div>
      <div className="paint-flora-depth" aria-hidden="true">
        <img
          className="paint-flora"
          src="./assets/painting/poppies.webp"
          srcSet="./assets/painting/poppies-640.webp 640w, ./assets/painting/poppies-960.webp 960w, ./assets/painting/poppies.webp 1254w"
          sizes="(max-width: 767px) 270px, (max-width: 1023px) 40vw, clamp(280px, 32vw, 560px)"
          alt="" width="1254" height="1254" decoding="async"
        />
      </div>
      <div className="paint-petals" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
      </div>
      <div className="paint-wipe" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
      </div>
    </section>
  )
}
