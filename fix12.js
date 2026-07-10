const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Insert "STRATEGIC DESIGNER" banner below the giant-name
const strategicBanner = '<h2 id="hero-role-banner" style="position: absolute; top: 12vh; left: 50%; transform: translateX(-50%); width: 100vw; text-align: center; font-size: 5vw; line-height: 1; font-family: var(--font-serif); letter-spacing: 0.15em; text-transform: uppercase; white-space: nowrap; color: #ffffff; mix-blend-mode: overlay; opacity: 0.8; z-index: 50; pointer-events: none; font-weight: 300;">STRATEGIC DESIGNER</h2>';

// Insert after giant-name h1 closing tag
html = html.replace(
    /<\/h1>\s*\n\s*<!-- Screen overlay/,
    '</h1>\n\n        ' + strategicBanner + '\n\n        <!-- Screen overlay'
);

// 2. Insert post-credits section before </main>
const postCredits = `
    <!-- ------------------------------------------
         POST-CREDITS — CINEMATIC CLOSING
    ------------------------------------------ -->
    <section id="post-credits" class="post-credits-section">
      
      <!-- Cinematic bar top -->
      <div class="credits-bar credits-bar-top"></div>

      <div class="credits-scroll-container">

        <!-- Act I: Title Card -->
        <div class="credits-block credits-title-card">
          <span class="credits-label">A PORTFOLIO BY</span>
          <h1 class="credits-name">VISHWAS<br>MEHTA</h1>
          <span class="credits-label credits-label-sub">STRATEGIC DESIGNER &mdash; BENGALURU, INDIA</span>
        </div>

        <!-- Act II: Summary -->
        <div class="credits-block credits-summary">
          <span class="credits-label">[ THE STORY SO FAR ]</span>
          <p class="credits-body">
            I started in computer science, spent four years thinking in systems and code, 
            then moved into a two-year M.Des program. That shift taught me something important: 
            the best design thinking comes from understanding how things actually work underneath.
          </p>
          <p class="credits-body">
            Now I work across brand identity, product design, and storytelling &mdash; 
            the parts of design that get separated, but rarely should be.
          </p>
        </div>

        <!-- Act III: Skills -->
        <div class="credits-block credits-skills">
          <span class="credits-label">[ SKILLS &amp; CRAFT ]</span>
          <div class="credits-skills-grid">
            <div class="credits-skill-col">
              <h4 class="credits-col-head">Brand</h4>
              <ul>
                <li>Brand Strategy</li>
                <li>Visual Identity</li>
                <li>Art Direction</li>
                <li>Packaging Design</li>
                <li>Brand Guidelines</li>
              </ul>
            </div>
            <div class="credits-skill-col">
              <h4 class="credits-col-head">Product</h4>
              <ul>
                <li>UX Research</li>
                <li>Interaction Design</li>
                <li>Design Systems</li>
                <li>Prototyping</li>
                <li>User Testing</li>
              </ul>
            </div>
            <div class="credits-skill-col">
              <h4 class="credits-col-head">Tools</h4>
              <ul>
                <li>Figma</li>
                <li>Adobe Creative Suite</li>
                <li>Blender</li>
                <li>HTML / CSS / JS</li>
                <li>After Effects</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Act IV: Contact -->
        <div class="credits-block credits-contact">
          <span class="credits-label">[ GET IN TOUCH ]</span>
          <a href="mailto:vyommehta197@gmail.com" class="credits-email">VYOMMEHTA197@GMAIL.COM</a>
          <div class="credits-links">
            <a href="https://www.linkedin.com/in/vishwas-mehta-319924226" target="_blank" rel="noopener">LinkedIn</a>
            <span class="credits-dot">&bull;</span>
            <a href="https://www.behance.net/vishwashmehta" target="_blank" rel="noopener">Behance</a>
            <span class="credits-dot">&bull;</span>
            <a href="https://vyshwas.github.io/vyshwas-s-playground/" target="_blank" rel="noopener">Backyard</a>
          </div>
        </div>

        <!-- Final Card -->
        <div class="credits-block credits-final">
          <span class="credits-tagline">BUILT QUIETLY. &mdash; 2026</span>
          <button id="credits-back-to-top" class="credits-top-btn" aria-label="Back to top">&uarr; BACK TO TOP</button>
        </div>

      </div>

      <!-- Cinematic bar bottom -->
      <div class="credits-bar credits-bar-bottom"></div>

    </section>
`;

// Insert before </main>
html = html.replace(
    '</main><!-- /main-content -->',
    postCredits + '\n\n    </main><!-- /main-content -->'
);

fs.writeFileSync('index.html', html);
console.log("Inserted strategic designer banner and post-credits section");

// 3. Add CSS for post-credits
let css = fs.readFileSync('style.css', 'utf8');

const creditsCss = `
/* =============================================
   POST-CREDITS CINEMATIC SECTION
   ============================================= */
.post-credits-section {
    position: relative;
    background: #0a0a0a;
    color: #ffffff;
    overflow: hidden;
    padding: 0;
}

.credits-bar {
    width: 100%;
    height: 8vh;
    background: #000000;
}

.credits-scroll-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10vh 6vw;
    gap: 18vh;
}

.credits-block {
    width: 100%;
    max-width: 900px;
    text-align: center;
    opacity: 0;
    transform: translateY(40px);
}

.credits-label {
    display: block;
    font-family: var(--font-sans);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent-red);
    margin-bottom: 2rem;
}

.credits-label-sub {
    margin-top: 2.5rem;
    margin-bottom: 0;
    color: rgba(255,255,255,0.4);
    font-size: 0.65rem;
    letter-spacing: 0.3em;
}

/* Title card */
.credits-title-card .credits-name {
    font-family: var(--font-serif);
    font-size: clamp(5rem, 18vw, 20rem);
    font-weight: 800;
    line-height: 0.85;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    margin: 0;
    background: linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.15) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Summary */
.credits-summary {
    max-width: 650px;
}
.credits-body {
    font-family: var(--font-serif);
    font-size: clamp(1.1rem, 2vw, 1.6rem);
    line-height: 1.7;
    color: rgba(255,255,255,0.65);
    margin-bottom: 1.5rem;
    font-weight: 300;
}

/* Skills grid */
.credits-skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    text-align: left;
    margin-top: 1rem;
}
.credits-col-head {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent-red);
    margin-bottom: 1.2rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.credits-skill-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.credits-skill-col li {
    font-family: var(--font-serif);
    font-size: 1rem;
    color: rgba(255,255,255,0.55);
    padding: 0.45rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: color 0.3s;
}
.credits-skill-col li:hover {
    color: #ffffff;
}

/* Contact */
.credits-email {
    display: block;
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 4vw, 3.5rem);
    font-weight: 300;
    color: #ffffff;
    text-decoration: none;
    letter-spacing: 0.05em;
    margin-bottom: 2.5rem;
    transition: color 0.3s;
}
.credits-email:hover {
    color: var(--accent-red);
}
.credits-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
.credits-links a {
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    text-decoration: none;
    transition: color 0.3s;
}
.credits-links a:hover {
    color: var(--accent-red);
}
.credits-dot {
    color: rgba(255,255,255,0.15);
    font-size: 0.6rem;
}

/* Final card */
.credits-final {
    padding-top: 8vh;
}
.credits-tagline {
    display: block;
    font-family: var(--font-sans);
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.25);
    margin-bottom: 3rem;
}
.credits-top-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.5);
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 1rem 2.5rem;
    cursor: pointer;
    border-radius: 100px;
    transition: all 0.3s;
}
.credits-top-btn:hover {
    background: var(--accent-red);
    border-color: var(--accent-red);
    color: #ffffff;
}

@media (max-width: 768px) {
    .credits-scroll-container { padding: 8vh 5vw; gap: 12vh; }
    .credits-skills-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .credits-email { font-size: clamp(1.2rem, 5vw, 2rem); }
}
`;

css += creditsCss;
fs.writeFileSync('style.css', css);
console.log("Added post-credits CSS");

// 4. Add GSAP scroll reveal for credits blocks + back-to-top in main.js
let js = fs.readFileSync('main.js', 'utf8');

const creditsJs = `
  // --- POST-CREDITS SCROLL REVEAL ---
  gsap.utils.toArray('.credits-block').forEach((block) => {
    gsap.fromTo(block,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Credits back-to-top button
  const creditsTopBtn = document.getElementById('credits-back-to-top');
  if (creditsTopBtn) {
    creditsTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
`;

// Insert before the closing of the DOMContentLoaded or at the end of the file
if (!js.includes('POST-CREDITS SCROLL REVEAL')) {
    // Find the last closing }); which should be the DOMContentLoaded close
    const lastIdx = js.lastIndexOf('});');
    if (lastIdx !== -1) {
        js = js.slice(0, lastIdx) + creditsJs + '\n' + js.slice(lastIdx);
    }
    fs.writeFileSync('main.js', js);
    console.log("Added post-credits animations to main.js");
}

// 5. Also add hero-role-banner fade to GSAP timeline
js = fs.readFileSync('main.js', 'utf8');
if (!js.includes('#hero-role-banner')) {
    js = js.replace(
        "tl.to('#giant-name', { opacity: 0, duration: 0.1 }, 0);",
        "tl.to('#giant-name', { opacity: 0, duration: 0.1 }, 0);\n\n      tl.to('#hero-role-banner', { opacity: 0, duration: 0.1 }, 0);"
    );
    fs.writeFileSync('main.js', js);
    console.log("Added hero-role-banner fade to GSAP timeline");
}
