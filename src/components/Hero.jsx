import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion, scrollToTarget } from '../lib/motion.js'
import Icon from './Icon.jsx'

export default function Hero() {
  const root = useRef(null)
  const calm = useReducedMotion()
  useLayoutEffect(() => {
    if (calm) return
    const ctx = gsap.context(() => {
      const stage = root.current.querySelector('.hero-zoom-stage')
      const origin = () => {
        const { width: w, height: h } = root.current.getBoundingClientRect()
        const scale = Math.max(w / 1376, h / 768)
        return {
          x: (w - 1376 * scale) / 2 + 692 * scale,
          y: (h - 768 * scale) / 2 + 380.5 * scale,
        }
      }
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'hero-scene',
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.45,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 10,
        },
      })
      timeline.to(
        '.hero-copy, .hero-foot, .hero-caption',
        { autoAlpha: 0, y: -30, duration: 0.18 },
        0,
      )
      // Dive zoom, capped: past ~5x the frame is fully behind the 95%
      // ink signal veil, so deeper scales buy nothing visible while the
      // layer (up to ~24,000px at 17x) busts GPU tile limits and tears
      // into stepped seams on fast scrolls. 5x keeps it inside safe
      // raster size with the same on-screen read.
      timeline.fromTo(
        stage,
        { scale: 1 },
        {
          scale: 5,
          transformOrigin: () => origin().x + 'px ' + origin().y + 'px',
          duration: 0.76,
          ease: 'power2.inOut',
        },
        0,
      )
      timeline.fromTo(
        '.hero-signal',
        { opacity: 0 },
        { opacity: 1, duration: 0.25 },
        0.3,
      )
      timeline.fromTo(
        '.hero-statement span',
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.07, duration: 0.24, ease: 'power3.out' },
        0.44,
      )
      timeline.to(
        '.hero-statement',
        { opacity: 0, y: -50, duration: 0.13 },
        0.86,
      )
      timeline.to(
        '.hero-curtain',
        { scaleY: 1, transformOrigin: 'bottom', duration: 0.12 },
        0.88,
      )
    }, root)
    return () => ctx.revert()
  }, [calm])
  return (
    <section
      id="hero"
      ref={root}
      className="hero"
      aria-label="Vishwas Mehta, Strategic Product Designer and Design Engineer"
    >
      <div className="hero-zoom-stage" aria-hidden="true">
        <img
          src="./assets/hero-tv.jpg"
          className="hero-image"
          alt=""
          fetchPriority="high"
          width="1376"
          height="768"
        />
        <div className="hero-shade" />
      </div>
      <div className="hero-copy">
        <p className="hero-role">
          Vishwas Mehta{' '}
          <span>Strategic Product Designer & Design Engineer</span>
        </p>
        <h1>
          Design that ships.
          <br />
          <em>Code that feels.</em>
        </h1>
      </div>
      <div className="hero-caption" aria-hidden="true">
        <span>IDEA</span>
        <span className="caption-line" />
        <span>INTERFACE</span>
      </div>
      <div className="hero-foot">
        <p>
          I craft interfaces that feel inevitable.
          <br />
          Systems thinking. Front-end execution.
        </p>
        <div className="hero-actions">
          <button
            className="button button-light"
            onClick={() => scrollToTarget('#experiments')}
          >
            Explore the work <Icon name="arrow" />
          </button>
          <a
            className="button button-glass"
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé <Icon name="external" />
          </a>
        </div>
        <span className="hero-location">
          Bengaluru, India
          <br />
          Open to remote & relocation
        </span>
      </div>
      <div className="hero-signal" aria-hidden="true">
        <div className="signal-scanlines" />
        <div className="hero-statement">
          <div>
            <span>Systems thinking</span>
          </div>
          <div>
            <span>
              <em>before visual polish.</em>
            </span>
          </div>
        </div>
      </div>
      <div className="hero-curtain" aria-hidden="true" />
    </section>
  )
}
