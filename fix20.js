const fs = require('fs');

// 1. Update HTML: insert flipToggle switch inside the header
let html = fs.readFileSync('index.html', 'utf8');

const switchHtml = `
      <!-- CRT Flip Switch -->
      <div class="crt-switch" id="flipToggle" role="button" aria-label="Toggle flip mode" tabindex="0" style="cursor: pointer;">
        <span class="crt-switch-label" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.1em; transition: color 0.3s ease;">FLIP</span>
        <div class="crt-switch-track" style="width: 50px; height: 26px; background: #1a1a1a; border-radius: 13px; border: 1px solid #333; padding: 2px; transition: background 0.3s ease; display: flex; align-items: center;">
          <div class="crt-switch-knob" style="width: 20px; height: 20px; background: linear-gradient(145deg, #444, #222); border-radius: 50%; box-shadow: inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 5px rgba(0,0,0,0.8); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center;">
            <div class="crt-switch-indicator" style="width: 4px; height: 4px; border-radius: 50%; background: #555; box-shadow: inset 0 1px 1px rgba(0,0,0,0.5); transition: all 0.3s ease;"></div>
          </div>
        </div>
      </div>
`;

// Insert inside <header class="site-header" id="siteHeader"> before closing </header>
html = html.replace(
    '</header>',
    switchHtml + '\n  </header>'
);

fs.writeFileSync('index.html', html);
console.log("Added flip toggle switch HTML to header");

// 2. Update CSS: add flip-mode styling and toggle knob transformation
let css = fs.readFileSync('style.css', 'utf8');

const flipStyles = `
/* --- Flip Mode Styles --- */
body.flip-mode {
    transform: scaleX(-1);
    transform-origin: center top;
}

/* Ensure the cursor doesn't feel backwards on flipped text */
body.flip-mode * {
    cursor: auto;
}

/* Toggle visual state of the switch knob and indicator in flip-mode */
body.flip-mode .crt-switch-label { 
    color: #fff !important; 
}
body.flip-mode .crt-switch-track { 
    background: #FC4C13 !important; 
    border-color: #FC4C13 !important;
}
body.flip-mode .crt-switch-knob { 
    transform: translateX(24px) !important; 
}
body.flip-mode .crt-switch-indicator {
    background: #fff !important;
    box-shadow: 0 0 6px rgba(255,255,255,0.8) !important;
}

/* Align switch vertically in the header */
.site-header .crt-switch {
    position: absolute !important;
    right: 2rem !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    z-index: 1002 !important;
}

@media (max-width: 1024px) {
    .site-header .crt-switch {
        right: 5.5rem !important; /* Move left of the hamburger menu on tablets/mobile */
    }
}
`;

css += flipStyles;
fs.writeFileSync('style.css', css);
console.log("Added flip-mode styles to CSS");

// 3. Update main.js: add toggle logic for flip mode
let js = fs.readFileSync('main.js', 'utf8');

const toggleScript = `
  // --- FLIP MODE TOGGLE ---
  const flipToggle = document.getElementById('flipToggle');
  if (flipToggle) {
    // Check local storage for preference
    if (localStorage.getItem('flipMode') === 'enabled') {
      document.body.classList.add('flip-mode');
    }

    const toggleFlip = () => {
      document.body.classList.toggle('flip-mode');
      if (document.body.classList.contains('flip-mode')) {
        localStorage.setItem('flipMode', 'enabled');
      } else {
        localStorage.removeItem('flipMode');
      }
    };

    flipToggle.addEventListener('click', toggleFlip);
    flipToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    });
  }
`;

// Insert flip script inside the DOMContentLoaded listener
const lastIdx = js.lastIndexOf('});');
if (lastIdx !== -1) {
    js = js.slice(0, lastIdx) + toggleScript + '\n' + js.slice(lastIdx);
}
fs.writeFileSync('main.js', js);
console.log("Added toggle script to main.js");
