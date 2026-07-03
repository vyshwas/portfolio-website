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
  const SCROLL_MULT   = 3.5;    // pin scroll distance reduced for faster scroll

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
  let heroTrigger       = null;

  if (heroPinWrapper && heroBg && !prefersReduced) {

    const scrollDist = window.innerHeight * SCROLL_MULT;

    // Tune zoom origin to TV screen position in photo
    heroBg.style.transformOrigin = `${TV_ORIGIN_X}% ${TV_ORIGIN_Y}%`;
    heroBg.style.willChange = 'transform';

    // Set initial state of about container (slides start via data-z / JS)
    gsap.set('#hero-about-container', { opacity: 0 });

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

    // ── Phase 2: Z-axis depth-of-field camera engine ──
    // Read each slide's spatial Z from data-z attribute, initialise transform
    const zSlides = Array.from(document.querySelectorAll('.z-slide'));
    zSlides.forEach(slide => {
      const baseZ = parseFloat(slide.dataset.z) || -1500;
      slide._spatialZ = baseZ;
      slide.style.transform = `translate(-50%, -50%) translateZ(${baseZ}px)`;
    });

    // Reveal the about container as TV bg fades to black (kept in timeline)
    tl.to('#hero-about-container', { opacity: 1, duration: 0.03 }, 0.22);

    // Container fade-out at very end of pin
    tl.to('#hero-about-container', { opacity: 0, duration: 0.01 }, 0.99);

    // ScrollTrigger — pin + scrub drives Phase 1 via tl, Phase 2 via onUpdate
    heroTrigger = ScrollTrigger.create({
      trigger:      heroPinWrapper,
      start:        'top top',
      end:          `+=${scrollDist}`,
      pin:          heroScene,
      pinSpacing:   true,
      anticipatePin: 1,
      scrub:        1,        // 1-second lag — camera glides behind scroll, calming cinematic feel
      animation:    tl,

      onUpdate: (self) => {
        // ── Camera only moves during Phase 2 (after TV zoom ends at 0.25) ──
        const p = self.progress;
        if (p < 0.22) return;

        // Map 0.25–1.0 of scroll progress → camera travelling 0–10500 Z units
        const phase2 = Math.max(0, (p - 0.25) / 0.75);
        const cameraZ = phase2 * 10500;

        zSlides.forEach(slide => {
          const calcZ = slide._spatialZ + cameraZ;

          // Update 3D position
          slide.style.transform = `translate(-50%, -50%) translateZ(${calcZ}px)`;

          // ── Depth-of-field: blur keyed to distance from camera ──
          const blurAmt = Math.max(0, Math.abs(calcZ) / 180 - 0.8);

          // ── Opacity: fade when behind camera (>400) or too far away (<-2500) ──
          let alpha = 1;
          if (calcZ > 400) {
            alpha = 1 - Math.max(0, (calcZ - 400) / 400);
          } else if (calcZ < -2500) {
            alpha = 1 - Math.abs(calcZ + 2500) / 2500;
          }
          alpha = Math.max(0, Math.min(1, alpha));

          slide.style.filter  = `blur(${blurAmt.toFixed(2)}px)`;
          slide.style.opacity = alpha;
        });
      },

      onLeave:     () => { heroBg.style.willChange = 'auto'; },
      onEnterBack: () => { heroBg.style.willChange = 'transform'; },
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

  // ──────────────────────────────────────────────────────────
  // Nav Bar Scroll shrink & Top-left logo logic
  // ──────────────────────────────────────────────────────────
  const siteHeader = document.getElementById('siteHeader');
  
  window.addEventListener('scroll', () => {
    const heroHeight = document.getElementById('hero-pin-wrapper')?.offsetHeight || window.innerHeight;
    // Shrink nav bar once we pass the hero pin wrapper area
    if (window.scrollY > heroHeight - 100) {
      siteHeader.classList.add('scrolled-nav');
    } else {
      siteHeader.classList.remove('scrolled-nav');
    }
  }, { passive: true });

  // ──────────────────────────────────────────────────────────
  // Back to Top CTA
  // ──────────────────────────────────────────────────────────
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

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

  // Handle About link scroll target in the pinned hero section
  const aboutLink = document.querySelector('a[href="#about"]');
  if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      let startPos = 0;
      if (heroPinWrapper && heroBg && !prefersReduced) {
        const scrollDist = window.innerHeight * SCROLL_MULT;
        // Scroll exactly to where slides container is revealed (progress 0.25)
        startPos = heroPinWrapper.offsetTop + (0.25 * scrollDist);
      } else if (heroPinWrapper) {
        startPos = heroPinWrapper.offsetTop;
      }
      if (lenis) {
        lenis.scrollTo(startPos);
      } else {
        window.scrollTo({ top: startPos, behavior: 'smooth' });
      }
    });
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

    if (heroTrigger && heroTrigger.isActive) {
      if (heroTrigger.progress >= 0.22) {
        activeId = 'about';
      } else {
        activeId = 'hero-scene';
      }
    } else {
      sections.forEach((sec) => {
        if (sec.id === 'hero-scene') return;
        const rect = sec.getBoundingClientRect();
        // Consider a section active if it occupies the trigger zone
        if (rect.top <= THRESHOLD && rect.bottom > 0) {
          activeId = sec.id;
        }
      });
    }

    navLinks.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('href') === `#${activeId}`);
    });

    if (activeId) {
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
  const emailToCopy = "vyommehta97@gmail.com";
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
      category: "Brand Strategy · Packaging · Identity",
      timeline: "Dissertation",
      role: "Strategist & Designer",
      team: "Solo",
      summary: "My M.Des dissertation project. The brief I gave myself: build a wellness brand confident enough to look expensive without saying \"premium\" anywhere on the pack. The category is noise. Every competitor uses the same palette, the same kraft paper, the same health claims. I wanted to explore what restraint actually signals on a shelf.",
      challenge: "PROBLEM:\nHow do you stand out in a category where every brand looks identical?\n\nAPPROACH:\nResearch competitor positioning, build a type-led system, test the visual logic against category conventions.",
      outcome: "SYSTEM:\nFull brand identity (mark, palette, packaging), documented as strategic positioning framework.\n\nLEARNING:\nRestraint and clarity are design decisions, not defaults. The work taught me how positioning dictates every visual choice downstream.",
      image: "assets/project_fruit_full.pdf"
    },
    {
      title: "Personalised Travel Platform",
      category: "Product Design · UX Research · Systems Thinking",
      timeline: "Concept",
      role: "UX Designer",
      team: "Solo",
      summary: "A concept project exploring how trip planning actually works. Most platforms ask for dates and destination, then hand you a list. People don't plan that way. They plan around a feeling, a budget, constraints they don't articulate. I designed a constraint-first flow to see what happens when you surface the reasoning instead of hiding it.",
      challenge: "PROBLEM:\nGeneric itinerary tools ignore how people actually decide.\n\nAPPROACH:\nUser research on travel planning behaviour, constraint mapping, flow redesign.",
      outcome: "SYSTEM:\nPrototype and documented user flows showing decision architecture.\n\nLEARNING:\nPersonalisation isn't a filter. It's about showing your work. Making the system's reasoning visible builds more trust than a perfect recommendation.",
      image: "assets/project_travel.jpg"
    },
    {
      title: "Cart Abandonment Audit",
      category: "UX Audit · E-commerce · Strategy",
      timeline: "Audit",
      role: "UX Analyst",
      team: "Katalyse.ai",
      summary: "A structured UX audit I completed at Katalyse.ai exploring why checkout flows lose users. The assumption is price or shipping. The audit found something quieter: friction at moments where the interface asks for trust it hasn't earned. I mapped 11 friction points and documented them as a prioritised audit.",
      challenge: "PROBLEM:\nHigh cart abandonment across e-commerce funnels, cause unclear.\n\nAPPROACH:\nAudit of Shopify checkout experience, friction point mapping, trust analysis.",
      outcome: "SYSTEM:\nDocumented audit with friction prioritisation and redesign recommendations.\n\nLEARNING:\nAmbiguity costs more than transparency. People don't abandon carts because of price. They abandon because the next step isn't clear.",
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
    const scrollContainers = drawer.querySelectorAll('.drawer-visuals, .drawer-info');
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

    // Push state for mobile swipe back using hash
    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", "#project-" + index);
    } else {
      window.location.hash = 'project-' + index;
    }

    // Focus on the project title at the top for accessibility and to prevent auto-scrolling to the bottom
    setTimeout(() => {
      const title = document.getElementById('drawer-project-title');
      title?.focus();
    }, 100);
  };

  const closeProjectDrawer = (fromHistory = false) => {
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

    // Pop state if closed manually (not via swipe back)
    if (fromHistory !== true && window.location.hash.startsWith('#project-')) {
      window.history.back();
    }
  };

  // Listen for mobile swipe back (hashchange and popstate)
  const handleHistoryChange = () => {
    if (!window.location.hash.startsWith('#project-') && drawer && drawer.classList.contains('open')) {
      closeProjectDrawer(true);
    }
  };
  window.addEventListener('hashchange', handleHistoryChange);
  window.addEventListener('popstate', handleHistoryChange);

  const populateProjectDrawer = (index) => {
    const data = projectsData[index];
    
    document.getElementById('drawer-project-title').textContent = data.title;
    
    // Combine meta data into the single meta block based on user's new layout
    const metaHTML = `${data.timeline} | ${data.category}<br>${data.role}<br>${data.team}`;
    document.getElementById('drawer-project-meta').innerHTML = metaHTML;
    
    // Populate storytelling content
    const summaryEl = document.getElementById('drawer-project-summary');
    if (summaryEl) summaryEl.textContent = data.summary || "";
    
    const challengeEl = document.getElementById('drawer-project-challenge');
    if (challengeEl) challengeEl.textContent = data.challenge || "";
    
    const outcomeEl = document.getElementById('drawer-project-outcome');
    if (outcomeEl) outcomeEl.textContent = data.outcome || "";
    
    // Lazy-load media
    const img = document.getElementById('drawer-project-image');
    const pdf = document.getElementById('drawer-project-pdf');
    
    if (data.image.endsWith('.pdf')) {
      if (img) img.style.display = 'none';
      if (pdf) {
        pdf.style.display = 'block';
        pdf.src = data.image + "#view=FitH&toolbar=0&navpanes=0";
      }
    } else {
      if (pdf) pdf.style.display = 'none';
      if (img) {
        img.style.display = 'block';
        img.src = data.image;
        img.alt = `Case study screenshot for ${data.title}`;
      }
    }
    
    // Preload next image hero
    const nextIdx = (index + 1) % projectsData.length;
    if (!projectsData[nextIdx].image.endsWith('.pdf')) {
      const preloadImg = new Image();
      preloadImg.src = projectsData[nextIdx].image;
    }
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

  // Hide preview when scrolling the page
  window.addEventListener('scroll', () => {
    if (activeHoverIndex !== -1) {
      updateActivePreview(-1);
    }
  }, { passive: true });

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
  document.getElementById('closeDrawerLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeProjectDrawer();
  });

  prevProjectBtn?.addEventListener('click', () => {
    let prevIndex = currentProjectIndex - 1;
    if (prevIndex < 0) {
      prevIndex = projectsData.length - 1;
    }
    populateProjectDrawer(prevIndex);
    currentProjectIndex = prevIndex;
    
    // Reset scroll positions of scroll containers inside the drawer
    const scrollContainers = drawer.querySelectorAll('.drawer-visuals, .drawer-info');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  });

  nextProjectBtn?.addEventListener('click', () => {
    let nextIndex = (currentProjectIndex + 1) % projectsData.length;
    populateProjectDrawer(nextIndex);
    currentProjectIndex = nextIndex;

    // Reset scroll positions of scroll containers inside the drawer
    const scrollContainers = drawer.querySelectorAll('.drawer-visuals, .drawer-info');
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

  /* ──────────────────────────────────────────────────────────
     11. FAVICON FLICKER
     – Loads the VM monogram favicon image, renders it at three
       opacity levels via canvas, and swaps <link rel="icon">
       on irregular intervals that mirror the Backyard button
       flicker rhythm (4500 ms cycle, same drop points).
  ────────────────────────────────────────────────────────── */
  (function initFaviconFlicker() {
    const S = 64;
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) return;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = S;
    const ctx = canvas.getContext('2d');

    // Flicker sequence (same rhythm as @keyframes backyard-flicker):
    //  [opacity, hold-ms]
    //   8% dip → recover → 43% dip → recover → 76% hard drop → snap → tail
    function buildSequence(FULL, DIM, OFF) {
      return [
        [FULL,  350],
        [DIM,    45],
        [FULL, 1510],
        [DIM,    45],
        [FULL, 1395],
        [OFF,    45],
        [FULL,   45],
        [FULL,  710],
      ];
    }

    function startFlicker(seq) {
      let i = 0;
      function tick() {
        const [frame, wait] = seq[i % seq.length];
        faviconLink.href = frame;
        i++;
        setTimeout(tick, wait);
      }
      setTimeout(tick, 800);
    }

    // Render the img at a given opacity → returns data URL
    function bakeFrame(img, alpha) {
      ctx.clearRect(0, 0, S, S);
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, 0, 0, S, S);
      ctx.globalAlpha = 1;
      return canvas.toDataURL('image/png');
    }

    // ── Attempt 1: load the actual favicon image (same-origin) ──
    const img = new Image();
    // Use relative path — avoids any absolute-URL CORS quirks
    img.src = 'assets/favicon.png';

    img.onload = function () {
      const FULL = bakeFrame(img, 1.00);
      const DIM  = bakeFrame(img, 0.45);
      const OFF  = bakeFrame(img, 0.10);
      startFlicker(buildSequence(FULL, DIM, OFF));
    };

    // ── Fallback: draw VM monogram from scratch if image fails ──
    img.onerror = function () {
      function drawFrame(alpha) {
        ctx.clearRect(0, 0, S, S);
        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(0, 0, S, S, 10);
        ctx.fill();
        // Thin border
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(0.5, 0.5, S - 1, S - 1, 10);
        ctx.stroke();
        // VM monogram in warm cream
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#E8E0D5';
        ctx.font = '500 30px "Cormorant Garamond", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('VM', S / 2, S / 2 + 1);
        ctx.globalAlpha = 1;
        return canvas.toDataURL('image/png');
      }
      const FULL = drawFrame(1.00);
      const DIM  = drawFrame(0.45);
      const OFF  = drawFrame(0.10);
      startFlicker(buildSequence(FULL, DIM, OFF));
    };
  })();

});
