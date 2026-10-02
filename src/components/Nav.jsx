import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  scrollToTarget,
  toggleMotion,
  useReducedMotion,
} from '../lib/motion.js'
import Dialog from './Dialog.jsx'
import Icon from './Icon.jsx'

const links = [
  { id: 'experiments', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'how-i-work', label: 'How I Work' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [active, setActive] = useState('hero')
  const [menu, setMenu] = useState(false)
  const calm = useReducedMotion()
  const systemCalm = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  useEffect(() => {
    const ordered = ['hero', 'about', 'experiments', 'how-i-work', 'contact']
    let offsets = []
    const update = () => {
      const position = window.scrollY + window.innerHeight * 0.3
      const current = offsets.findLast((item) => item.top <= position)
      setActive(current?.id || 'hero')
    }
    const measure = () => {
      offsets = ordered
        .map((id) => {
          const el = document.getElementById(id)
          if (!el) return null
          return {
            id,
            top:
              ScrollTrigger.getById(id + '-scene')?.start ??
              el.getBoundingClientRect().top + window.scrollY,
          }
        })
        .filter(Boolean)
      update()
    }
    const tracker = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: update,
    })
    ScrollTrigger.addEventListener('refresh', measure)
    measure()
    return () => {
      tracker.kill()
      ScrollTrigger.removeEventListener('refresh', measure)
    }
  }, [calm])

  const go = (id) => {
    setMenu(false)
    requestAnimationFrame(() => scrollToTarget('#' + id))
  }

  return (
    <header className={'site-header ' + (active === 'hero' ? 'on-cover' : '')}>
      <a
        className="wordmark"
        href="#hero"
        aria-label="Vishwas Mehta, back to top"
        onClick={(e) => {
          e.preventDefault()
          go('hero')
        }}
      >
        <img src="./assets/logo.svg" alt="" width="20" height="20" />
        <span>Vishwas Mehta</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a
            href={'#' + link.id}
            key={link.id}
            aria-current={active === link.id ? 'location' : undefined}
            onClick={(e) => {
              e.preventDefault()
              go(link.id)
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <button
          className="motion-toggle"
          onClick={toggleMotion}
          disabled={systemCalm}
          aria-label={
            systemCalm
              ? 'Reduced motion enabled by your system'
              : calm
                ? 'Enable full motion'
                : 'Reduce motion'
          }
          aria-pressed={calm}
          title={calm ? 'Reduced motion' : 'Full motion'}
        >
          <Icon name={calm ? 'play' : 'pause'} />
          <span>Motion</span>
        </button>
        <a href="mailto:vyommehta197@gmail.com" className="nav-contact">
          Let’s talk <Icon name="external" />
        </a>
        <button
          className="mobile-toggle"
          aria-label="Open navigation"
          aria-expanded={menu}
          onClick={() => setMenu(true)}
        >
          <Icon name="menu" />
        </button>
      </div>
      {menu && (
        <Dialog
          labelId="menu-title"
          onClose={() => setMenu(false)}
          className="menu-dialog"
        >
          <div className="menu-top">
            <span id="menu-title">Explore the playground</span>
            <button
              className="icon-button"
              aria-label="Close navigation"
              onClick={() => setMenu(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <a
                key={link.id}
                href={'#' + link.id}
                onClick={(e) => {
                  e.preventDefault()
                  go(link.id)
                }}
              >
                {link.label}
                <Icon name="external" />
              </a>
            ))}
          </nav>
          <a
            className="button"
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View résumé <Icon name="external" />
          </a>
          <p>Bengaluru • Open to remote & relocation</p>
        </Dialog>
      )}
    </header>
  )
}
