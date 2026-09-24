# Painterly hero

This branch replaces the TV entrance with a living oil painting and gives Selected Work a matching paper gallery. Section anchors, contact links, project content, and working prototypes are retained. The original hero component is still available in `src/components/Hero.jsx`.

## Visual direction

An original, sunlit oil landscape fills the first viewport. Viridian name lettering retains the portfolio's Pilowlava identity. Powder-blue sky leaves space for the introduction; poppies provide the warm accent. Shared radius tokens and generous navigation spacing continue the existing design system. The hero deliberately retains the artwork's daylight palette in both system color schemes.

Design dials: variance 8, motion 8, density 3. Native CSS and the repository's existing GSAP provide choreography; a small WebGL shader moves the painted image without loading Three.js on the first viewport.

## Motion and behavior

- Staggered horizontal paint reveal and a short introduction sequence.
- Animated pigment: drifting sky, wind through foliage, water ripples and pointer-responsive perspective.
- A separately painted foreground flower layer sways in the breeze; petals travel across the landscape.
- A gentle scroll perspective effect in normal page flow, with no pinned entrance.
- The existing Motion control and system reduced-motion preference show the complete static painting.
- The WebGL ticker stops offscreen and when the tab is hidden, runs at a maximum of 30 fps, and caps pixel density at 1.5.
- A real image remains underneath the canvas if WebGL is unavailable or its context is lost.

## Files

- `src/components/PainterlyHero.jsx`: semantic hero, actions and entrance choreography.
- `src/components/Painting.jsx`: image-first rendering and effect lifecycle.
- `src/lib/living-painting.js`: animated pigment, visibility and resource cleanup.
- `src/components/painting.css`: scoped tokens, typography, layout and responsive motion.
- `public/assets/painting/`: optimized landscape and transparent foreground images.

Run `npm run dev -- --host 127.0.0.1 --port 5187` for the local preview. The deployment base remains relative for GitHub Pages. Nothing has been pushed or deployed.

## Verification

`npm run verify:painting` builds the production app and exercises it under `/portfolio-website/`. All 32 checks passed: animation renders changing pixels; motion can be paused and restored; rendering stops offscreen; navigation reaches selected work; the resume resolves; keyboard focus and mobile dialog behavior work; unsupported or lost WebGL falls back to the painting; and layouts fit at widths of 320, 390, 768, 1366 and 1920 pixels. System reduced motion and the dark system preference were also checked.

The initial hero-only local desktop Lighthouse report recorded performance 90, accessibility 100, best practices 100, LCP 1.9 seconds, and CLS 0. Reports and screenshots are in `.verification/`. Changed source files pass Oxlint; the full repository lint retains two pre-existing unused-variable warnings in the former hero and an old maintenance script.

The historical `npm run verify` script still targets the retired CRT entrance and an earlier gallery structure. It was not substituted or represented as passing; `verify:painting` is the focused production check for this change.

The existing navigation helper also needed a small fix: it now computes a numeric scroll destination once, preventing Lenis from adding CSS scroll-margin to the explicit header offset.

Artwork generation prompts and the final asset paths are in [ARTWORK.md](ARTWORK.md). The working branch is `feat/painterly-hero`. The production preview is available at `http://127.0.0.1:5188/` while its local preview process is running.

## Selected Work gallery

`src/components/SelectedWork.jsx` and `src/components/selected-work.css` extend the hero's viridian ink and warm paper into an asymmetric, twelve-column gallery. Original screenshots and packaging sit on a shared painted-paper mount. Captions and case-study/prototype actions remain visible without hover. Mobile uses a single column with full-size controls.

The six projects retain their order and content. All Work, Product Design, and Brand & Tools filters animate with GSAP Flip; each piece also enters as it scrolls into view. Filter changes refresh navigation offsets. Manual and system reduced-motion settings show the gallery immediately without layout animation or artwork movement.

The shared `ProjectWorkspace` is exported from the original `Projects.jsx`; its reading surface now matches the gallery, while embedded prototypes keep their own visual identities. Tuck no longer displays an external action with no destination. Next Project follows the currently selected category.

`npm run verify:gallery` builds and exercises the production app beneath `/portfolio-website/`. All 43 checks pass, including rapid filtering, accessible result counts, focus restoration, mobile dialogs, all three live prototype interactions, reduced motion, lazy image loading, and navigation after the gallery changes height. Layouts were checked at 320, 390, 768, and 1366 pixels and reviewed visually at desktop and mobile sizes. Reports and screenshots are in `.verification/`.

The 32 hero regression checks also pass with this gallery. A final delivery pass adds intrinsic preview dimensions, preloads the landscape, reduces the gallery paper from 283 KB to 51 KB, and supplies 640/960-pixel foreground variants. The final desktop Lighthouse result is performance 92, accessibility 100, best practices 100, LCP 1.2 seconds, and CLS 0. The simulated slower-mobile audit scores performance 53, accessibility 100, and best practices 100, with LCP 6.2 seconds (improved from 9.4 seconds before the delivery pass). Mobile loading remains a performance limitation; the audit identifies blocking external font CSS and animation initialization costs. These are local synthetic measurements, not deployed field metrics.
