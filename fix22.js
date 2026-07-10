const fs = require('fs');

// 1. Update HTML: Add inline click handler and head script for persistent flip state
let html = fs.readFileSync('index.html', 'utf8');

// Add script in the head to apply flip-mode instantly before body rendering (prevents flash of dark mode)
if (!html.includes("if (localStorage.getItem('flipMode') === 'enabled')")) {
    html = html.replace(
        '</head>',
        `  <script>
    if (localStorage.getItem('flipMode') === 'enabled') {
      document.documentElement.classList.add('flip-mode');
    }
  </script>
</head>`
    );
}

// Add direct inline onclick handler to #flipToggle, and update class toggling to document.documentElement
html = html.replace(
    /id="flipToggle" role="button" aria-label="Toggle flip mode" tabindex="0" style="cursor: pointer;"/,
    `id="flipToggle" role="button" aria-label="Toggle flip mode" tabindex="0" style="cursor: pointer;" onclick="document.documentElement.classList.toggle('flip-mode'); localStorage.setItem('flipMode', document.documentElement.classList.contains('flip-mode') ? 'enabled' : 'disabled');"`
);

fs.writeFileSync('index.html', html);
console.log("Updated index.html with inline toggle triggers and head loader");

// 2. Update CSS: Make flip-mode invert all colors of the website using filter: invert(1) on html element
let css = fs.readFileSync('style.css', 'utf8');

// Strip out the previous flip styles
css = css.replace(/\/\* --- Color Inversion \(Theme Flip\) --- \*\/[\s\S]*?\}\n\}/g, '');
css = css.replace(/body\.flip-mode\s*\{[^}]+\}/g, '');
css = css.replace(/body\.flip-mode img[\s\S]*?!important;/g, '');

const absoluteInvertStyles = `
/* --- Full Color Inversion Theme --- */
html.flip-mode {
    filter: invert(1) !important;
}

/* Make sure background color matches the inverted filter */
html.flip-mode body {
    background-color: #ffffff !important;
}

/* Ensure the flip switch knob transitions properly */
html.flip-mode .crt-switch-knob {
    transform: translateX(24px) !important;
}

/* Force the indicator light to show active state on track */
html.flip-mode .crt-switch-indicator {
    background: #000 !important;
    box-shadow: 0 0 6px rgba(0,0,0,0.8) !important;
}
`;

css += absoluteInvertStyles;
fs.writeFileSync('style.css', css);
console.log("Updated style.css with absolute color inversion");

// 3. Remove the JS handler from main.js to avoid double-triggering
let js = fs.readFileSync('main.js', 'utf8');
js = js.replace(/\/\/ --- FLIP MODE TOGGLE ---[\s\S]*?\}\s*\}\n/g, '');
fs.writeFileSync('main.js', js);
console.log("Cleaned up main.js event listeners");
