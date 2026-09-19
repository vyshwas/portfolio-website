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
        '.about-heading .reveal-ink',
        { backgroundSize: '0% 100%, 100% 100%' },
        {
          backgroundSize: '100% 100%, 100% 100%',
          stagger: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            end: 'center 40%',
            scrub: 1,
          },
        },
      )
      gsap.fromTo(
        '.about-rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [calm])

  return (
    <section
      id="about"
      ref={root}
      className="about-section page-gutter"
      aria-labelledby="about-heading"
    >
      <div className="about-rule" aria-hidden="true" />
      <h2 id="about-heading" className="about-heading">
        <span className="reveal-ink">An idea is only as good</span>
        <br />
        <em className="reveal-ink">as the way it works.</em>
      </h2>
      <div className="about-bottom">
        <p className="about-intro">
          I’m Vishwas. I work in the space between product strategy and the
          details you can feel.
        </p>
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
      <div className="practice-line">
        <span>Product strategy</span>
        <span>Interaction design</span>
        <span>Systems architecture</span>
        <span>Creative engineering</span>
      </div>
    </section>
  )
}
