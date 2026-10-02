import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../lib/motion.js'
import './how-i-work.css'

gsap.registerPlugin(ScrollTrigger)

const habits = [
  {
    title: 'Reframe the relationship',
    body: 'In Tuck, the app never says stop. The mascot says it is tired and asks for help, so the person becomes the caretaker instead of the one being blocked.',
    project: 'Tuck',
  },
  {
    title: 'Design the worst case first',
    body: 'A flow is judged when it breaks. Nocturne’s failed payment got as much care as its success: the app takes the blame and keeps the order intact.',
    project: 'Nocturne',
  },
  {
    title: 'Build systems, not screens',
    body: 'Gamut encodes the 60-30-10 rule and contrast checks into tokens, so every palette passes WCAG before anyone has to check it by hand.',
    project: 'Gamut',
  },
  {
    title: 'Prove it in code',
    body: 'An interaction has to be felt to be judged. Awara’s live itinerary and Munim’s hold window are working prototypes, not static frames.',
    project: 'Awara · Munim',
  },
]

// The five principles from the live site ("The way I see it"), each redrawn
// as a diagram whose motion lives in CSS and runs only while it is on screen.
const principles = [
  {
    id: 'material',
    name: 'Engineering is a design material.',
    text: 'Motion, latency, and edge cases are part of the experience. I prototype in the medium the product will live in.',
    art: (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        {['DATA', 'LOGIC', 'UI'].map((label, i) => (
          <g key={label} className="hw-layer" style={{ '--i': i }}>
            <path d={'M60 ' + (86 - i * 22) + ' L120 ' + (68 - i * 22) + ' L180 ' + (86 - i * 22) + ' L120 ' + (104 - i * 22) + ' Z'} />
            <text className="hw-label" x="204" y={90 - i * 22}>{label}</text>
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: 'explore',
    name: 'AI expands the exploration.',
    text: 'I use AI to explore more possibilities, then bring product judgment to the result. The decisions remain mine to explain.',
    art: (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        {[16, 38, 60, 82, 104].map((y, i) => (
          <path key={y} className="hw-branch" style={{ '--i': i }} pathLength="1" d={'M28 60 C70 60 80 ' + y + ' 120 ' + y} />
        ))}
        {[16, 38, 60, 82, 104].map((y, i) => (
          <circle key={'n' + y} className="hw-option" style={{ '--i': i }} cx="124" cy={y} r="6" />
        ))}
        <path className="hw-pick" pathLength="1" d="M130 38 C170 38 176 60 212 60" />
        <circle className="hw-origin" cx="24" cy="60" r="8" />
        <circle className="hw-result" cx="214" cy="60" r="9" />
      </svg>
    ),
  },
  {
    id: 'trust',
    name: 'Trust is built into the system.',
    text: 'Clear permissions, visible state, and a way back. People should understand what the product is doing on their behalf.',
    art: (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        <circle className="hw-state" cx="50" cy="66" r="16" />
        <circle className="hw-state hw-state--next" cx="190" cy="66" r="16" />
        <path className="hw-forward" pathLength="1" d="M72 66 H166" />
        <path className="hw-back" pathLength="1" d="M190 44 C176 6 64 6 50 44" />
        <text className="hw-label" x="120" y="102">a way back</text>
      </svg>
    ),
  },
  {
    id: 'behaviour',
    name: 'Behaviour makes the interface.',
    text: 'I design what happens before, during, and after the click. An interface is a relationship between actions and consequences.',
    art: (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        <rect className="hw-target" x="70" y="30" width="100" height="32" rx="16" />
        <circle className="hw-ripple" cx="120" cy="46" r="16" />
        <circle className="hw-cursor" cx="120" cy="46" r="6" />
        {['before', 'during', 'after'].map((label, i) => (
          <g key={label}>
            <circle className="hw-phase" style={{ '--i': i }} cx={70 + i * 50} cy="88" r="5" />
            <text className="hw-label" x={70 + i * 50} y="112">{label}</text>
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: 'canvas',
    name: 'The work has to leave the canvas.',
    text: 'Build it. Try it. Find the friction. A working prototype creates a more useful conversation than a perfect static screen.',
    art: (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        <rect className="hw-frame" x="16" y="16" width="110" height="88" rx="6" />
        <rect className="hw-phone" x="164" y="8" width="58" height="104" rx="12" />
        <rect className="hw-leaving" x="44" y="40" width="40" height="40" rx="8" />
      </svg>
    ),
  },
]

export default function HowIWork() {
  const root = useRef(null)
  const calm = useReducedMotion()

  // Diagrams loop only while their card is visible.
  useEffect(() => {
    const cards = root.current.querySelectorAll('.hw-law')
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-live', entry.isIntersecting)
    }, { threshold: 0.35 })
    cards.forEach((card) => seen.observe(card))
    return () => seen.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (calm) return
    const context = gsap.context(() => {
      // The rail runs across on desktop and down the side on phones.
      const axis = window.matchMedia('(max-width: 767px)').matches ? 'scaleY' : 'scaleX'
      gsap.fromTo('.hw-rail-fill', { [axis]: 0 }, {
        [axis]: 1, ease: 'none',
        scrollTrigger: { trigger: '.hw-habits', start: 'top 80%', end: 'bottom 55%', scrub: true },
      })
      gsap.from('.hw-habit', {
        y: 28, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.hw-habits', start: 'top 82%', once: true },
      })
      gsap.from('.hw-law', {
        y: 40, opacity: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.hw-laws', start: 'top 85%', once: true },
      })
    }, root)
    return () => context.revert()
  }, [calm])

  return (
    <section id="how-i-work" ref={root} className={'how-i-work' + (calm ? ' is-calm' : '')} aria-labelledby="how-heading" tabIndex={-1}>
      <div className="hw-container">
        <header className="hw-heading">
          <h2 id="how-heading">How I <em>work.</em></h2>
          <p>
            Four habits you can see in the work above, and the five
            principles underneath them.
          </p>
        </header>

        <ol className="hw-habits">
          <li className="hw-rail" aria-hidden="true"><span className="hw-rail-fill" /></li>
          {habits.map((habit, index) => (
            <li key={habit.title} className="hw-habit">
              <span className="hw-num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{habit.title}</h3>
              <p>{habit.body}</p>
              <span className="hw-project">{habit.project}</span>
            </li>
          ))}
        </ol>

        <div className="hw-laws-head">
          <h3>Principles I design by</h3>
          <p>Five principles that shape how I think, design, and build.</p>
        </div>
        <ul className="hw-laws">
          {principles.map((item, index) => (
            <li key={item.id} className={'hw-law hw-law--' + item.id}>
              <div className="hw-art">{item.art}</div>
              <span className="hw-pnum">{String(index + 1).padStart(2, '0')}</span>
              <h4>{item.name}</h4>
              <p className="hw-rule">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
