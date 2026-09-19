import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../lib/motion.js'
export default function About() {
  const root = useRef(null)
  const calm = useReducedMotion()
  useLayoutEffect(() => {
    if (calm) return
      const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current.querySelectorAll('.reveal-text'),
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
          },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [calm])
  return (
    <section
      id="about"
      ref={root}
      className="about-section grid-hairline"
      aria-labelledby="about-heading"
    >
      <div className="about-quadrant about-quadrant-main">
        <div className="reveal-mask">
          <h2 id="about-heading" className="about-heading reveal-text" style={{ margin: 0 }}>
            An idea is only as good
          </h2>
        </div>
        <div className="reveal-mask">
          <h2 className="about-heading reveal-text" style={{ margin: 0 }}>
            <em>as the way it works.</em>
          </h2>
        </div>
      </div>

      <div className="about-quadrant about-quadrant-dark">
        <p className="about-intro" style={{ color: 'var(--neon)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1 }}>
          I’m Vishwas. I work in the space between product strategy and the details you can feel.
        </p>
      </div>

      <div className="about-quadrant about-quadrant-meta">
        <div className="practice-line-vertical">
          <span>PRODUCT STRATEGY</span>
          <span>INTERACTION DESIGN</span>
          <span>SYSTEMS ARCHITECTURE</span>
          <span>CREATIVE ENGINEERING</span>
        </div>
      </div>

      <div className="about-quadrant about-quadrant-copy">
        <div className="about-story">
          <p>
            I started in computer science and moved into design to ask better
            questions. What should a product do? How should it behave? Why
            should people trust it?
          </p>
          <p>
            Today, I carry those decisions through research, systems,
            interactive prototypes, and front-end execution.
          </p>
        </div>
      </div>
    </section>
  )
}
