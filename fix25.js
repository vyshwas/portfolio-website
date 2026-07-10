const fs = require('fs');

// 1. Clean main.js - strip out the duplicate event listener block completely
let js = fs.readFileSync('main.js', 'utf8');
// Replace the entire block using string replacement of the specific lines
const duplicateBlock = `  // --- FLIP MODE TOGGLE ---
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
  }`;

js = js.replace(duplicateBlock, '');
fs.writeFileSync('main.js', js);
console.log("Cleaned up duplicated flip code from main.js");

// 2. Clean index.html
let html = fs.readFileSync('index.html', 'utf8');

// Remove head script that auto-applied flip-mode on load
html = html.replace(
    /  <script>\s*if \(localStorage\.getItem\('flipMode'\) === 'enabled'\) \{\s*document\.documentElement\.classList\.add\('flip-mode'\);\s*\}\s*<\/script>\s*\n/,
    ''
);

// Remove the local grain div
html = html.replace(
    '        <!-- Overlays -->\n        <div id="hero-grain"></div>',
    '        <!-- Overlays -->'
);

// Simplify the inline onclick handler to just toggle the class (no localStorage writing)
html = html.replace(
    /onclick="document\.documentElement\.classList\.toggle\('flip-mode'\); localStorage\.setItem\('flipMode', document\.documentElement\.classList\.contains\('flip-mode'\) \? 'enabled' : 'disabled'\);"/,
    `onclick="document.documentElement.classList.toggle('flip-mode');"`
);

fs.writeFileSync('index.html', html);
console.log("Cleaned up index.html (removed startup inversion checks, removed hero-grain element)");

// 3. Clean style.css: ensure all toggle switch states use html.flip-mode, not body.flip-mode
let css = fs.readFileSync('style.css', 'utf8');

// Replace any remaining body.flip-mode rules for the switch to html.flip-mode
css = css.replace(/body\.flip-mode \.crt-switch-track/g, 'html.flip-mode .crt-switch-track');
css = css.replace(/body\.flip-mode \.crt-switch-knob/g, 'html.flip-mode .crt-switch-knob');
css = css.replace(/body\.flip-mode \.crt-switch-indicator/g, 'html.flip-mode .crt-switch-indicator');
css = css.replace(/body\.flip-mode \.crt-switch-label/g, 'html.flip-mode .crt-switch-label');
css = css.replace(/body\.flip-mode \.crt-switch/g, 'html.flip-mode .crt-switch');

fs.writeFileSync('style.css', css);
console.log("Updated style.css selectors to match html.flip-mode");
