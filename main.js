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
  const SCROLL_MULT   = 1.0;  // pin scroll distance = 1.0 × 100vh (one scroll entry)

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

    // Set initial state of main content to hidden so it fades in
    // only after entering the TV screen boundaries.
    if (mainContent) gsap.set(mainContent, { opacity: 0 });

    // GSAP timeline — scrubbed 1:1 with scroll (scrub:true = zero lag)
    const tl = gsap.timeline({ defaults: { ease: 'none' } });

    // — Chrome labels fade immediately (0–12% of scroll)
    tl.to([scrollCue, heroMetaLeft, heroMetaRight].filter(Boolean), {
      opacity: 0,
      duration: 0.12,
    }, 0);

    // — Background image zooms in (whole scroll)
    tl.to(heroBg, {
      scale: FINAL_SCALE,
      duration: 1,
    }, 0);

    // — Screen overlay: expands in parallel with the background TV image
    //   and fades out as it gets large (0–100% of scroll)
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
        duration: 1,
      }, 0);

      // Fade out the overlay contents before they exceed the viewport
      tl.to(screenOverlay, {
        opacity: 0,
        duration: 0.25,
      }, 0.55);
    }

    // — Fade in the main portfolio content (About section onwards)
    //   as the camera enters the TV's black screen (0.75–1.0 of timeline)
    if (mainContent) {
      tl.to(mainContent, {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      }, 0.75);
    }

    // ScrollTrigger — pin + instant scrub (no lag)
    // Using pinSpacing: true allows GSAP to handle layout heights automatically,
    // ensuring no empty space is left at the bottom of the page.
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

  document.querySelectorAll('.section-bg-canvas').forEach((canvas) => {
    const ctx      = canvas.getContext('2d');
    let animId, isVisible = false;
    
    // Config: dense dot grid with larger dots
    const CELL     = 10;
    const BASE_R   = 1.0;
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
  const form       = document.getElementById('contactForm');
  const success    = document.getElementById('formSuccess');
  const resetBtn   = document.getElementById('resetFormBtn');
  const submitBtn  = document.getElementById('submitBtn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const ok = f.value.trim() !== '';
      f.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;

    const orig = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'SENDING… <span class="submit-arrow">&nearr;</span>';
    form.style.opacity = '0.5';

    setTimeout(() => {
      form.classList.add('hidden');
      form.style.opacity = '';
      submitBtn.disabled = false;
      submitBtn.innerHTML = orig;
      success.classList.remove('hidden');
      form.reset();
    }, 1600);
  });

  resetBtn?.addEventListener('click', () => {
    success.classList.add('hidden');
    form.classList.remove('hidden');
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
    
    lastActiveElement = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    
    // Freeze body/document scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (lenis) {
      lenis.stop();
    }

    // Trapped focus focus management
    setTimeout(() => {
      const focusable = drawer.querySelectorAll('a, button');
      if (focusable.length > 0) {
        focusable[0].focus();
      }
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
  });

  nextProjectBtn?.addEventListener('click', () => {
    let nextIndex = (currentProjectIndex + 1) % projectsData.length;
    populateProjectDrawer(nextIndex);
    currentProjectIndex = nextIndex;
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

  /* ──────────────────────────────────────────────────────────
     10. WHY I DESIGN — JOURNAL SCROLL TRIGGERS
  ────────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    gsap.utils.toArray('.journal-segment').forEach((segment) => {
      gsap.fromTo(segment,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: segment,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }
});
