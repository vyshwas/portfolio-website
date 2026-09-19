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

      const setTvX = gsap.quickTo('.crt-tv-center', 'x', { duration: 0.8, ease: 'power2.out' })
      const setTvY = gsap.quickTo('.crt-tv-center', 'y', { duration: 0.8, ease: 'power2.out' })

      const onPointerMove = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1
        const ny = (e.clientY / window.innerHeight) * 2 - 1

        setTvX(nx * 12)
        setTvY(ny * 8)
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true })

      // ScrollTrigger Timeline (Direction 3: Hyperdrive Zoom & Camera Dive)
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

      // Initial text reveal on load
      gsap.fromTo(
        root.current.querySelectorAll('.reveal-text'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.15,
          clearProps: 'all',
        }
      )

      // Fade out copy, foot, and side caption early in scroll
      timeline.to(
        '.hero-editorial-layer, .hero-foot, .hero-caption',
        { autoAlpha: 0, y: -40, duration: 0.2 },
        0,
      )

      // Dive zoom into the off-center CRT TV
      timeline.fromTo(
        stage,
        { scale: 1 },
        {
          scale: 4.8,
          transformOrigin: '65% 50%',
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

      return () => {
        window.removeEventListener('pointermove', onPointerMove)
      }
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
      {/* ─── 1. Hero Ambient Backdrop (Video + Mesh) ─── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero-fabrica-video"
      >
        <source src="/assets/hero-art-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-bg-mesh" aria-hidden="true" />


      {/* ─── 2. Zoom Stage (Centered CRT TV) ─── */}
      <div className="hero-zoom-stage" aria-hidden="true">
        <div className="crt-tv-center">
          <div className="crt-tv-container">
            <div className="crt-screen-bezel">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="crt-screen-video"
              >
                <source src="./assets/crt-placeholder.mp4" type="video/mp4" />
              </video>
              <div className="crt-scanlines" />
              <div className="crt-curvature-glare" />
            </div>
            <img
              src="./assets/new-crt-tv.png"
              alt="Retro CRT TV"
              className="crt-tv-body"
              width="874"
              height="666"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>

      {/* ─── 3. Massive Vertical Typography ─── */}
      <div className="hero-editorial-layer">
        <div className="hero-top-text">
          <p className="hero-role text-amber-glow" style={{ marginBottom: '24px' }}>Strategic Product Designer<br />&amp; Design Engineer</p>
          <h1 className="hero-name-pilowlava reveal-text" style={{ margin: 0, lineHeight: 0.9 }}>Vishwas</h1>
        </div>
        <div className="hero-bottom-text">
          <h1 className="hero-name-pilowlava reveal-text" style={{ margin: 0, lineHeight: 0.9 }}>Mehta</h1>
          <div className="hero-telemetry-corner">
            <span>VOL. 1 / NO. 1</span>
            <span className="caption-line-short" />
            <span>2024–2025</span>
          </div>
        </div>
      </div>

      {/* ─── 4. Telemetry Caption (Right) ─── */}
      <div className="hero-caption" aria-hidden="true">
        <span>IDEA</span>
        <span className="caption-line" />
        <span>INTERFACE</span>
      </div>

      {/* ─── 5. Hero Footer & Actions ─── */}
      <div className="hero-foot">
        <p>
          <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', marginRight: '9px', verticalAlign: 'middle', boxShadow: '0 0 8px #22c55e' }} />
          Available for Product Design Roles
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
          BENGALURU, INDIA
          <br />
          OPEN TO REMOTE &amp; RELOCATION
        </span>
      </div>

      {/* ─── 6. Zoom Reveal Message ─── */}
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
