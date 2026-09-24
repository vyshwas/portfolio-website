import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useReducedMotion, scrollToTarget } from './lib/motion.js'
import Nav from './components/Nav.jsx'
import Hero from './components/PainterlyHero.jsx'
import About from './components/About.jsx'
import Projects from './components/SelectedWork.jsx'
import LabReveal from './components/LabReveal.jsx'
import Bento from './components/Bento.jsx'
import FooterExit from './components/FooterExit.jsx'
import MagneticCursor from './components/MagneticCursor.jsx'

export default function App() {
  const calm = useReducedMotion()
  const progress = useRef(null)
  useEffect(() => {
    if (calm) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false })
    const update = () => ScrollTrigger.update()
    const tick = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis
    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', update)
      lenis.destroy()
      delete window.__lenis
    }
  }, [calm])
  useEffect(() => {
    let cancelled = false
    const refresh = () => {
      if (!cancelled) {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        window.__lenis?.resize()
      }
    }
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progress.current)
          progress.current.style.transform = 'scaleX(' + self.progress + ')'
      },
    })
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    const frame = requestAnimationFrame(refresh)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      trigger.kill()
      window.removeEventListener('load', refresh)
    }
  }, [calm])
  return (
    <>
      <a
        className="skip-link"
        href="#experiments"
        onClick={(e) => {
          e.preventDefault()
          scrollToTarget('#experiments')
          document.getElementById('experiments').focus({ preventScroll: true })
        }}
      >
        Skip to selected work
      </a>
      <div className="reading-progress" ref={progress} aria-hidden="true" />
      <MagneticCursor />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <LabReveal />
        <Bento />
      </main>
      <FooterExit />
    </>
  )
}
