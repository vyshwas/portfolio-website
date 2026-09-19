import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion, scrollToTarget } from '../lib/motion.js'
import Icon from './Icon.jsx'
const phases = [
  {
    label: 'Raw idea',
    title: 'Start with curiosity.',
    text: 'Every product begins with an unanswered question.',
  },
  {
    label: 'Structure',
    title: 'Find the connections.',
    text: 'Turn individual insights into a coherent system.',
  },
  {
    label: 'Iteration',
    title: 'Let the idea evolve.',
    text: 'Prototype the behaviour. Learn from the friction.',
  },
  {
    label: 'Execution',
    title: 'Give it to the world.',
    text: 'A system becomes useful when people can use it.',
  },
]
export default function LabReveal() {
  const root = useRef(null),
    stage = useRef(null),
    scene = useRef(null),
    trigger = useRef(null),
    control = useRef({ morph: 0 }),
    tween = useRef(null)
  const [phase, setPhase] = useState(0),
    [sceneStatus, setStatus] = useState('waiting')
  const calm = useReducedMotion()
  const status = calm ? 'still' : sceneStatus
  useLayoutEffect(() => {
    if (calm) return
    const media = gsap.matchMedia()
    media.add('(min-width: 800px)', () => {
      trigger.current = ScrollTrigger.create({
        id: 'lab-scene',
        trigger: root.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight * 1.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          tween.current?.kill()
          control.current.morph = self.progress * 3
          scene.current?.setMorph(control.current.morph)
          const next = Math.min(3, Math.round(control.current.morph))
          setPhase((prev) => (prev === next ? prev : next))
        },
      })
      return () => {
        trigger.current = null
      }
    })
    return () => media.revert()
  }, [calm])
  useEffect(() => {
    let cancelled = false,
      initialized = false
    const container = stage.current
    if (calm) return
    const failure = () => {
      scene.current?.dispose()
      scene.current = null
      setStatus('unavailable')
    }
    container.addEventListener('sceneerror', failure)
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || initialized) return
        initialized = true
        observer.disconnect()
        setStatus('waiting')
        try {
          const { createParticleScene } =
            await import('../lib/particleScene.js')
          if (cancelled) return
          scene.current = createParticleScene(container)
          scene.current.setMorph(control.current.morph)
          setStatus('live')
        } catch (error) {
          if (!cancelled) {
            console.warn('Particle lab unavailable:', error)
            setStatus('unavailable')
          }
        }
      },
      { rootMargin: '500px' },
    )
    observer.observe(container)
    return () => {
      cancelled = true
      observer.disconnect()
      container.removeEventListener('sceneerror', failure)
      tween.current?.kill()
      scene.current?.dispose()
      scene.current = null
    }
  }, [calm])
  const choose = (index) => {
    setPhase(index)
    if (trigger.current && !calm)
      scrollToTarget(
        trigger.current.start +
          ((trigger.current.end - trigger.current.start) * index) / 3,
      )
    else {
      tween.current?.kill()
      if (calm) {
        control.current.morph = index
        return
      }
      tween.current = gsap.to(control.current, {
        morph: index,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => scene.current?.setMorph(control.current.morph),
      })
    }
  }
  return (
    <section
      id="lab"
      ref={root}
      className="lab-section page-gutter"
      aria-labelledby="lab-heading"
    >
      <div className="lab-top">
        <span>Inside the playground</span>
        <span className="lab-status meta">
          <i className={status === 'live' ? 'status-dot' : ''} />
          {status === 'live'
            ? 'INTERACTIVE / LIVE'
            : calm
              ? 'STILL / REDUCED MOTION'
              : status === 'unavailable'
                ? 'STILL STUDY'
                : 'LOADING STUDY'}
        </span>
      </div>
      <div className="lab-composition">
        <div className="lab-copy">
          <h2 id="lab-heading">
            A thought,
            <br />
            <em>taking shape.</em>
          </h2>
          <div className="lab-phase" key={phase}>
            <span className="meta">
              0{phase + 1} / {phases[phase].label}
            </span>
            <h3>{phases[phase].title}</h3>
            <p>{phases[phase].text}</p>
          </div>
        </div>
        <div className="lab-art" ref={stage}>
          {status !== 'live' && (
            <div
              className={'orbital-study orbital-' + phase}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
          <span className="lab-axis axis-x" aria-hidden="true">
            X
          </span>
          <span className="lab-axis axis-y" aria-hidden="true">
            Y
          </span>
        </div>
      </div>
      <div className="lab-bottom">
        <div
          className="phase-controls"
          role="group"
          aria-label="Explore design phases"
        >
          {phases.map((item, index) => (
            <button
              key={item.label}
              onClick={() => choose(index)}
              aria-pressed={phase === index}
            >
              <span className="meta">0{index + 1}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="lab-instructions">
          {status === 'live'
            ? 'Move to disturb · Drag to rotate · Hold to gather'
            : 'Explore the four phases'}
        </div>
        <button
          className="lab-skip text-link"
          onClick={() => scrollToTarget('#system')}
        >
          Continue <Icon />
        </button>
      </div>
    </section>
  )
}
