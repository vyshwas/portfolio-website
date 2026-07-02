/* ============================================================
   VISHWAS MEHTA PORTFOLIO — main.js  (v3)
   Performance-first cinematic hero zoom.

   Strategy:
   ─ Scale the hero BACKGROUND IMAGE centered on the TV screen
     position in the photo, not a CSS element.
   ─ Lenis handles page smooth-scroll separately from GSAP scrub.
   ─ Canvas dot-grids are paused while hero is in view.
   ─ scrub: true = instant 1:1 scroll mapping (no lag).
   ─ will-change set only on the one animated element.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     0. REDUCED-MOTION CHECK
  ────────────────────────────────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────────────
     1. GSAP  (register before everything else)
  ────────────────────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ──────────────────────────────────────────────────────────
     2. LENIS SMOOTH SCROLL
     – connected to ScrollTrigger via the recommended pattern.
  ────────────────────────────────────────────────────────── */
  let lenis = null;
  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp: 0.1,          // 0 = instant, 1 = never arrives. 0.1 = snappy + smooth
      smoothWheel: true,
      smoothTouch: false,
    });

    // The only correct way to sync Lenis with GSAP ScrollTrigger:
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ──────────────────────────────────────────────────────────
     3. HERO — CINEMATIC TV ZOOM

     The hero-bg is the desert photo (cover-fitted).
     We scale it up with transform-origin aimed at the TV
     screen centre in the photo.

     New photo TV screen centre:
       X ≈ 50%  (TV is horizontally centred)
       Y ≈ 55.5% (Tuned for precise center alignment)
  ────────────────────────────────────────────────────────── */
  const TV_ORIGIN_X   = 50;   // % from left
  const TV_ORIGIN_Y   = 55.5; // % from top — tuned for new photo
  const FINAL_SCALE   = 9;    // how much to scale (fills viewport)
  const SCROLL_MULT   = 5.0;  // pin scroll distance = 5.0 × 100vh (provides ample scroll space for zoom + Z-slides)

  const heroPinWrapper  = document.getElementById('hero-pin-wrapper');
  const heroScene       = document.getElementById('hero-scene');
  const heroBg          = document.getElementById('hero-bg');
  const screenOverlay   = document.getElementById('screen-overlay');
  const screenName      = document.getElementById('screen-name');
  const screenRole      = document.getElementById('screen-role');
  const heroMetaLeft    = document.getElementById('hero-meta-left');
  const heroMetaRight   = document.getElementById('hero-meta-right');
  const scrollCue       = document.getElementById('scroll-cue');
  const mainContent     = document.getElementById('main-content');

  if (heroPinWrapper && heroBg && !prefersReduced) {

    const scrollDist = window.innerHeight * SCROLL_MULT;

    // Tune zoom origin to TV screen position in photo
    heroBg.style.transformOrigin = `${TV_ORIGIN_X}% ${TV_ORIGIN_Y}%`;
    heroBg.style.willChange = 'transform';

    // Set initial state of main content and about slides
    if (mainContent) gsap.set(mainContent, { opacity: 0 });
    gsap.set('#hero-about-container', { opacity: 0 });
    gsap.set('.z-slide', { 
      transformPerspective: 1000, 
      transformOrigin: '50% 50%', 
      opacity: 0, 
      z: -1500, 
      scale: 0.1 
    });

    // GSAP timeline — scrubbed 1:1 with scroll (scrub:true = zero lag)
    const tl = gsap.timeline({ defaults: { ease: 'none' } });

    // ── Phase 1: TV Zoom (0.0 to 0.25 of timeline) ──
    
    // — Chrome labels fade immediately (0–0.05 of scroll)
    tl.to([scrollCue, heroMetaLeft, heroMetaRight].filter(Boolean), {
      opacity: 0,
      duration: 0.05,
    }, 0);

    // — Background image zooms in (0–0.25)
    tl.to(heroBg, {
      scale: FINAL_SCALE,
      duration: 0.25,
    }, 0);

    // — Screen overlay: scales up (0-0.25)
    if (screenOverlay) {
      gsap.set(screenOverlay, { 
        transformOrigin: 'center center',
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0
      });
      tl.to(screenOverlay, {
        scale: FINAL_SCALE,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        duration: 0.25,
      }, 0);

      // Fade out the overlay contents quickly as they expand (0–0.15)
      tl.to(screenOverlay, {
        opacity: 0,
        duration: 0.15,
      }, 0.05);
    }

    // — Fade TV bg image to black as scale reaches maximum (0.22–0.25)
    tl.to(heroBg, {
      opacity: 0,
      duration: 0.03,
    }, 0.22);

    // ── Phase 2: About Slides Z-Scroll Fly-Through (0.25 to 0.95 of timeline) ──

    // Reveal the Z-slides container
    tl.to('#hero-about-container', {
      opacity: 1,
      duration: 0.03,
    }, 0.22);

    // Slide 1: Systems Thinking (0.25 to 0.45)
    tl.to('#z-slide-1', { opacity: 1, z: 0, scale: 1, duration: 0.08 }, 0.25);
    tl.to('#z-slide-1', { opacity: 0, z: 1000, scale: 3.5, duration: 0.07 }, 0.38);

    // Slide 2: UX & Behavior (0.43 to 0.63)
    tl.to('#z-slide-2', { opacity: 1, z: 0, scale: 1, duration: 0.08 }, 0.43);
    tl.to('#z-slide-2', { opacity: 0, z: 1000, scale: 3.5, duration: 0.07 }, 0.56);

    // Slide 3: Coherence (0.61 to 0.81)
    tl.to('#z-slide-3', { opacity: 1, z: 0, scale: 1, duration: 0.08 }, 0.61);
    tl.to('#z-slide-3', { opacity: 0, z: 1000, scale: 3.5, duration: 0.07 }, 0.74);

    // Slide 4: Longevity (0.79 to 0.97)
    tl.to('#z-slide-4', { opacity: 1, z: 0, scale: 1, duration: 0.08 }, 0.79);
    tl.to('#z-slide-4', { opacity: 0, z: 1000, scale: 3.5, duration: 0.05 }, 0.92);

    // Fade out Z-slides container at the end of slides
    tl.to('#hero-about-container', {
      opacity: 0,
      duration: 0.03,
    }, 0.97);

    // ── Phase 3: Transition to main content (0.95 to 1.0) ──
    if (mainContent) {
      tl.to(mainContent, {
        opacity: 1,
        duration: 0.03,
        ease: 'power2.out',
      }, 0.97);
    }

    // ScrollTrigger — pin + instant scrub (no lag)
    ScrollTrigger.create({
      trigger:      heroPinWrapper,
      start:        'top top',
      end:          `+=${scrollDist}`,
      pin:          heroScene,
      pinSpacing:   true,    // Let GSAP spacer handle document heights
      anticipatePin: 1,
      scrub:        true,
      animation:    tl,
      onLeave:      () => { 
        heroBg.style.willChange = 'auto'; 
        if (mainContent) gsap.set(mainContent, { opacity: 1 });
      },
      onEnterBack:  () => { 
        heroBg.style.willChange = 'transform'; 
      },
    });

  } else if (heroPinWrapper) {
    // Reduced motion / no GSAP: static hero
    heroPinWrapper.style.height = '100vh';
    if (mainContent) gsap.set(mainContent, { opacity: 1 });
  }

  /* ──────────────────────────────────────────────────────────
     4. SECTION CANVAS DOT GRIDS
     – Per-section IntersectionObserver so only visible section runs.
  ────────────────────────────────────────────────────────── */
  let clientX = -9999, clientY = -9999;
  let targetOX = 0, targetOY = 0;

  document.addEventListener('mousemove', (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
    const hw = window.innerWidth / 2;
    const hh = window.innerHeight / 2;
    targetOX = -((e.clientX - hw) / hw) * 10;
    targetOY = -((e.clientY - hh) / hh) * 10;
  });

  document.addEventListener('mouseleave', () => {
    clientX = -9999; clientY = -9999;
    targetOX = 0; targetOY = 0;
  });

  // Mobile Touch Support: Activate dot grid on touch, deactivate on release
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;
      targetOX = -((touch.clientX - hw) / hw) * 10;
      targetOY = -((touch.clientY - hh) / hh) * 10;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;
      targetOX = -((touch.clientX - hw) / hw) * 10;
      targetOY = -((touch.clientY - hh) / hh) * 10;
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    clientX = -9999;
    clientY = -9999;
    targetOX = 0;
    targetOY = 0;
  }, { passive: true });

  document.addEventListener('touchcancel', () => {
    clientX = -9999;
    clientY = -9999;
    targetOX = 0;
    targetOY = 0;
  }, { passive: true });

  document.querySelectorAll('.section-bg-canvas').forEach((canvas) => {
    const ctx      = canvas.getContext('2d');
    let animId, isVisible = false;
    
    // Config: dense dot grid with larger dots
    const CELL     = 30;
    const BASE_R   = 0.75;
    const HOVER_R  = 75;
    
    // Dynamic contrast handling based on light vs dark sections
    const parent       = canvas.closest('section') || canvas.closest('#hero-scene') || canvas.parentElement;
    const isLightTheme = parent.classList.contains('dark-theme') || parent.classList.contains('light-section') || parent.id === 'about';
    
    const BASE_C   = isLightTheme ? 'rgba(29,29,29,0.05)' : 'rgba(240,237,230,0.065)';
    const SOFT_C   = isLightTheme ? 'rgba(29,29,29,0.22)' : 'rgba(240,237,230,0.25)';
    const RED_C    = 'rgba(252,76,19,0.85)';

    let curOX = 0, curOY = 0;

    const resize = () => {
      const r   = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = r.width  * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const draw = () => {
      if (!isVisible) { animId = requestAnimationFrame(draw); return; }
      const r = canvas.getBoundingClientRect();
      const W = r.width, H = r.height;
      ctx.clearRect(0, 0, W, H);

      curOX += (targetOX - curOX) * 0.08;
      curOY += (targetOY - curOY) * 0.08;

      const lmx = clientX - r.left;
      const lmy = clientY - r.top;
      const sx  = (curOX % CELL) - CELL;
      const sy  = (curOY % CELL) - CELL;

      for (let x = sx; x < W + CELL; x += CELL) {
        for (let y = sy; y < H + CELL; y += CELL) {
          const dist = Math.hypot(lmx - x, lmy - y);
          let r2 = BASE_R, col = BASE_C;
          if (dist < HOVER_R) {
            const f = 1 - dist / HOVER_R;
            r2  = BASE_R + f * 2.2;
            col = f > 0.45 ? RED_C : SOFT_C;
          }
          ctx.beginPath();
          ctx.arc(x, y, r2, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };

    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        isVisible = e.isIntersecting;
        if (isVisible) { resize(); draw(); }
        else cancelAnimationFrame(animId);
      });
    }, { threshold: 0.02 }).observe(parent || canvas);
  });

  /* ──────────────────────────────────────────────────────────
     5. SECTION REVEAL ANIMATIONS
  ────────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    // Use fromTo so end state is always correct (fixes fading/stuck elements)
    const reveal = (selector, vars = {}) => {
      gsap.utils.toArray(selector).forEach((el) => {
        gsap.fromTo(el,
          { y: 28, opacity: 0, ...vars.from },
          {
            y: 0, opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            ...vars.to,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true,           // ← only fires once — no re-hide on scroll back
              ...vars.st,
            },
          }
        );
      });
    };

    reveal('.section-tag', { from: { y: 12 } });
    reveal('.about-lead, .work-lead, .principles-lead, .experiments-lead, .contact-lead');
    reveal('.about-col p', { to: { stagger: 0.08 } });
    reveal('.belief-card',  { to: { stagger: 0.1 } });
    reveal('.work-row',     { to: { stagger: 0.12 }, st: { start: 'top 90%' } });
    reveal('.principle-row',{ to: { stagger: 0.1  }, st: { start: 'top 90%' } });
    reveal('.experiment-row');
    reveal('.contact-intro .contact-subtext');
  }

  /* ──────────────────────────────────────────────────────────
     6. MOBILE NAVIGATION
  ────────────────────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu    = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    const closeNav = () => {
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== menuToggle) closeNav();
    });

    navMenu.querySelectorAll('.nav-link').forEach((l) => l.addEventListener('click', closeNav));
  }

  /* ──────────────────────────────────────────────────────────
     7. SCROLLSPY — active link + header theme

     Uses getBoundingClientRect() so the active section is
     based on what's *visually* in the viewport — immune to
     the GSAP pin wrapper's inflated offsetTop values.
  ────────────────────────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');
  const siteHeader = document.getElementById('siteHeader');

  const runSpy = () => {
    // Threshold: a section is "active" when its top edge is
    // within the top 40% of the viewport.
    const THRESHOLD = window.innerHeight * 0.4;

    let activeId = null;
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      // Consider a section active if it occupies the trigger zone
      if (rect.top <= THRESHOLD && rect.bottom > 0) {
        activeId = sec.id;
      }
    });

    if (activeId) {
      navLinks.forEach((l) => {
        l.classList.toggle('active', l.getAttribute('href') === `#${activeId}`);
      });
      const activeSec = document.getElementById(activeId);
      const isLightBg = activeSec?.classList.contains('dark-theme') ?? false;
      siteHeader?.classList.toggle('header-light', isLightBg);
      siteHeader?.classList.toggle('header-dark', !isLightBg);
    }
  };

  window.addEventListener('scroll', runSpy, { passive: true });
  // Also hook into Lenis scroll event for smooth-scroll accuracy
  lenis?.on('scroll', runSpy);
  runSpy();

  /* ──────────────────────────────────────────────────────────
     8. CONTACT FORM
  ────────────────────────────────────────────────────────── */
  /* ──────────────────────────────────────────────────────────
     8. VISHWAS'S DESK INTERACTION
     ────────────────────────────────────────────────────────── */
  const tvPopup = document.getElementById('tvPopupMenu');
  const contactPopup = document.getElementById('contactPopupMenu');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const mobileCopyEmailBtn = document.getElementById('mobileCopyEmailBtn');

  // Helper: hide all desk popups
  const hideDeskPopups = () => {
    tvPopup?.classList.add('hidden');
    contactPopup?.classList.add('hidden');
  };

  // Close menus on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.obj-tv') && !e.target.closest('.obj-contact')) {
      hideDeskPopups();
    }
  });

  // Action Map for Desk Objects (Desktop & Mobile)
  const deskActions = {
    tv: (e) => {
      e.stopPropagation();
      tvPopup?.classList.toggle('hidden');
      contactPopup?.classList.add('hidden');
    },
    fruit: () => {
      openProjectDrawer(0);
    },
    travel: () => {
      openProjectDrawer(1);
    },
    checkout: () => {
      openProjectDrawer(2);
    },
    notebook: () => {
      const aboutSec = document.getElementById('about');
      if (aboutSec) {
        if (lenis) {
          lenis.scrollTo(aboutSec);
        } else {
          aboutSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    contact: (e) => {
      e.stopPropagation();
      contactPopup?.classList.toggle('hidden');
      tvPopup?.classList.add('hidden');
    }
  };

  // Bind Desktop Objects
  document.querySelectorAll('.desk-obj-wrapper').forEach((obj) => {
    const action = obj.getAttribute('data-action');
    obj.addEventListener('click', (e) => {
      if (deskActions[action]) {
        deskActions[action](e);
      }
    });

    // Keypress support
    obj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        obj.click();
      }
    });
  });

  // Bind TV Popup Menu Items
  document.querySelectorAll('.tv-menu-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const projIdx = parseInt(item.getAttribute('data-project'), 10);
      hideDeskPopups();
      openProjectDrawer(projIdx);
    });
  });

  // Bind Mobile List Cards
  document.querySelectorAll('.mobile-card').forEach((card) => {
    const action = card.getAttribute('data-action');
    card.addEventListener('click', (e) => {
      if (action === 'contact') {
        // Expand contact links inline on mobile card
        const links = card.querySelector('.mobile-contact-links');
        const arrow = card.querySelector('.card-arrow');
        if (links) {
          const isHidden = links.classList.contains('hidden');
          links.classList.toggle('hidden', !isHidden);
          if (arrow) {
            arrow.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
          }
        }
      } else if (deskActions[action]) {
        deskActions[action](e);
      }
    });
  });

  // Email copying logic
  const emailToCopy = "vyommehta197@gmail.com";
  const copyEmailHandler = (btn) => {
    if (!btn) return;
    const origText = btn.innerHTML;
    navigator.clipboard.writeText(emailToCopy).then(() => {
      btn.innerHTML = "COPIED!";
      setTimeout(() => {
        btn.innerHTML = origText;
      }, 2000);
    }).catch(err => {
      console.error('Could not copy email: ', err);
      // Fallback
      alert(emailToCopy);
    });
  };

  copyEmailBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    copyEmailHandler(copyEmailBtn);
  });

  mobileCopyEmailBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    copyEmailHandler(mobileCopyEmailBtn);
  });

  /* ──────────────────────────────────────────────────────────
     9. SELECTED WORK DRAWER (Interaction 02)
  ────────────────────────────────────────────────────────── */
  const projectsData = [
    {
      title: "The Whole Fruit",
      category: "Brand Strategy · Visual Identity · Packaging",
      timeline: "4 Weeks",
      role: "Brand Strategist & Lead Designer",
      team: "Solo Project",
      summary: "Repositioning a fruit brand from a utilitarian snack to a daily ritual of luxury indulgence.",
      challenge: "Traditional fruit brands suffer from low emotional resonance and high price sensitivity. The challenge was to elevate the product from a commodity to an indispensable lifestyle brand that commands a premium.",
      outcome: "Re-designed the visual system and packaging around minimal organic geometric forms, moving away from loud, bright fruit graphics. The new identity created a premium editorial feel, increasing perceived value and buyer interest during test placements.",
      image: "assets/project_fruit.jpg"
    },
    {
      title: "Travel Product",
      category: "Product Design · UX Strategy",
      timeline: "6 Weeks",
      role: "Lead UX Researcher & Product Designer",
      team: "3 Designers",
      summary: "Re-thinking a booking flow that had been A/B tested into incoherence.",
      challenge: "Over years of incremental A/B testing, the core user flow had accumulated conflicting UI patterns, leading to cognitive fatigue, increased drop-offs, and negative feedback during critical checkout stages.",
      outcome: "Conducted usability audits to strip away unnecessary cognitive checkpoints. Redesigned the search and confirmation screen hierarchies to focus only on contextual options, resulting in an intuitive, friction-free interface.",
      image: "assets/project_travel.jpg"
    },
    {
      title: "Shopping Cart Abandonment",
      category: "UX Research · Strategy",
      timeline: "8 Weeks",
      role: "Lead UX Analyst & Strategist",
      team: "Solo Project",
      summary: "A detailed analysis and redesign case study on why most 'abandonment fixes' make the problem worse.",
      challenge: "Most plugin and pop-up systems try to solve cart abandonment by introducing high-friction popups, countdown timers, and discount emails. These techniques erode brand trust and teach users to wait for discounts.",
      outcome: "Developed a silent, non-intrusive recovery framework centered around transparent pricing, context-aware reminders, and seamless guest-checkout transitions, reducing abandonment without relying on promotional popups.",
      image: "assets/project_cart.jpg"
    }
  ];

  const drawer         = document.getElementById('project-drawer');
  const backdrop       = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const prevProjectBtn = document.getElementById('prevProjectBtn');
  const nextProjectBtn = document.getElementById('nextProjectBtn');

  let currentProjectIndex = 0;
  let lastActiveElement = null;

  const openProjectDrawer = (index) => {
    currentProjectIndex = index;
    populateProjectDrawer(index);
    
    // Reset scroll positions of scroll containers inside the drawer
    const scrollContainers = drawer.querySelectorAll('.drawer-body, .drawer-left-panel, .drawer-right-panel');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
    
    lastActiveElement = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    
    // Freeze body/document scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (lenis) {
      lenis.stop();
    }

    // Focus on the project title at the top for accessibility and to prevent auto-scrolling to the bottom
    setTimeout(() => {
      const title = document.getElementById('drawer-project-title');
      title?.focus();
    }, 100);
  };

  const closeProjectDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    
    // Restore scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    if (lenis) {
      lenis.start();
    }
    
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  };

  const populateProjectDrawer = (index) => {
    const data = projectsData[index];
    document.getElementById('drawer-project-category').textContent = data.category;
    document.getElementById('drawer-project-title').textContent    = data.title;
    document.getElementById('drawer-project-timeline').textContent = data.timeline;
    document.getElementById('drawer-project-role').textContent     = data.role;
    document.getElementById('drawer-project-team').textContent     = data.team;
    
    document.getElementById('drawer-project-summary').textContent   = data.summary;
    document.getElementById('drawer-project-challenge').textContent = data.challenge;
    document.getElementById('drawer-project-outcome').textContent   = data.outcome;
    
    // Lazy-load media
    const img = document.getElementById('drawer-project-image');
    img.src = data.image;
    img.alt = `Case study screenshot for ${data.title}`;
    
    // Preload next image hero
    const nextIdx = (index + 1) % projectsData.length;
    const preloadImg = new Image();
    preloadImg.src = projectsData[nextIdx].image;
  };

  // Bind click trigger on work list rows
  document.querySelectorAll('.work-row').forEach((row, idx) => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectDrawer(idx);
    });
  });

  /* ──────────────────────────────────────────────────────────
     9b. HOVER PROJECT PREVIEW (Interaction 03)
  ────────────────────────────────────────────────────────── */
  const workRows = document.querySelectorAll('.work-row');
  const previewFrame = document.getElementById('workPreviewFrame');
  const previewItems = document.querySelectorAll('.project-preview-item');
  const listColumn = document.querySelector('.work-list-column');

  let activeHoverIndex = -1;

  const updateActivePreview = (index, event) => {
    activeHoverIndex = index;
    
    // Toggle frame visibility class
    if (index === -1) {
      previewFrame?.classList.remove('visible');
      previewItems.forEach(item => item.classList.remove('active'));
      
      gsap.to(previewFrame, {
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      return;
    }
    
    previewFrame?.classList.add('visible');
    
    // Switch active preview item
    previewItems.forEach((item) => {
      const idx = parseInt(item.getAttribute('data-preview-index'), 10);
      item.classList.toggle('active', idx === index);
    });

    // Animate scale in
    gsap.to(previewFrame, {
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.2)',
      overwrite: 'auto'
    });

    // Position immediately or update if keyboard event
    const row = workRows[index];
    if (row && previewFrame) {
      const frameW = previewFrame.offsetWidth || 400;
      const frameH = previewFrame.offsetHeight || 250;

      // Check if it's a focus (keyboard) event
      const isKeyboard = event && event.type === 'focus';

      if (isKeyboard) {
        // Keyboard: Align preview to the right side of the focused row
        const rowRect = row.getBoundingClientRect();
        
        // Target layout position
        const targetX = window.innerWidth - frameW - (window.innerWidth * 0.08); // Right side with margin
        const targetY = rowRect.top + (rowRect.height / 2) - (frameH / 2);

        gsap.to(previewFrame, {
          x: targetX,
          y: targetY,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else if (event) {
        // Mouse: Position center vertically with mouse cursor, offset horizontally to the right
        let targetX = event.clientX + 35;
        if (targetX + frameW > window.innerWidth - 20) {
          targetX = event.clientX - frameW - 35; // Flip to the left
        }
        
        let targetY = event.clientY - (frameH / 2);
        if (targetY < 20) targetY = 20;
        else if (targetY + frameH > window.innerHeight - 20) targetY = window.innerHeight - frameH - 20;

        gsap.set(previewFrame, {
          x: targetX,
          y: targetY
        });
      }
    }
  };

  // Follow mouse cursor inside listColumn
  listColumn?.addEventListener('mousemove', (e) => {
    if (activeHoverIndex !== -1 && previewFrame) {
      const frameW = previewFrame.offsetWidth || 400;
      const frameH = previewFrame.offsetHeight || 250;

      let targetX = e.clientX + 35;
      if (targetX + frameW > window.innerWidth - 20) {
        targetX = e.clientX - frameW - 35; // Flip to the left
      }

      let targetY = e.clientY - (frameH / 2);
      if (targetY < 20) targetY = 20;
      else if (targetY + frameH > window.innerHeight - 20) targetY = window.innerHeight - frameH - 20;

      gsap.to(previewFrame, {
        x: targetX,
        y: targetY,
        duration: 0.35, // Inertial smooth lag
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  workRows.forEach((row, idx) => {
    // Mouse hover activation
    row.addEventListener('mouseenter', (e) => {
      updateActivePreview(idx, e);
    });
    
    // Accessibility focus activation
    row.addEventListener('focus', (e) => {
      updateActivePreview(idx, e);
    });
  });

  // When mouse leaves the list column, reset to default state
  listColumn?.addEventListener('mouseleave', () => {
    updateActivePreview(-1);
  });

  // Keyboard navigation for work section
  window.addEventListener('keydown', (e) => {
    // Only run if the drawer is NOT open
    if (drawer && drawer.classList.contains('open')) return;

    // Check if we are focusing on one of the work rows
    const activeEl = document.activeElement;
    if (!activeEl || !activeEl.classList.contains('work-row')) return;

    let index = Array.from(workRows).indexOf(activeEl);
    if (index === -1) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (index + 1) % workRows.length;
      workRows[nextIdx].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (index - 1 + workRows.length) % workRows.length;
      workRows[prevIdx].focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openProjectDrawer(index);
    }
  });

  // Bind controls
  closeDrawerBtn?.addEventListener('click', closeProjectDrawer);
  backdrop?.addEventListener('click', closeProjectDrawer);

  prevProjectBtn?.addEventListener('click', () => {
    let prevIndex = currentProjectIndex - 1;
    if (prevIndex < 0) {
      prevIndex = projectsData.length - 1;
    }
    populateProjectDrawer(prevIndex);
    currentProjectIndex = prevIndex;
    
    // Reset scroll positions of scroll containers inside the drawer
    const scrollContainers = drawer.querySelectorAll('.drawer-body, .drawer-left-panel, .drawer-right-panel');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  });

  nextProjectBtn?.addEventListener('click', () => {
    let nextIndex = (currentProjectIndex + 1) % projectsData.length;
    populateProjectDrawer(nextIndex);
    currentProjectIndex = nextIndex;

    // Reset scroll positions of scroll containers inside the drawer
    const scrollContainers = drawer.querySelectorAll('.drawer-body, .drawer-left-panel, .drawer-right-panel');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  });

  // Keyboard navigation support
  window.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeProjectDrawer();
    } else if (e.key === 'ArrowLeft') {
      prevProjectBtn.click();
    } else if (e.key === 'ArrowRight') {
      nextProjectBtn.click();
    }
  });

  // Focus trap inside drawer
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusable = drawer.querySelectorAll('a, button');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  });

  // 10. WHY I DESIGN — Handled in main hero pin zoom timeline above
});
