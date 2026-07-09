const fs = require('fs');

// 1. Fix main.js to add fade out for giant-name
let js = fs.readFileSync('main.js', 'utf8');
if (!js.includes("#giant-name")) {
    js = js.replace(
        /tl\.to\(heroBg, \{\s*opacity: 0,\s*duration: 0\.03,\s*\}, 0\.22\);/,
        "tl.to(heroBg, {\n        opacity: 0,\n        duration: 0.03,\n      }, 0.22);\n\n      tl.to('#giant-name', {\n        opacity: 0,\n        duration: 0.03,\n      }, 0.22);"
    );
    fs.writeFileSync('main.js', js);
    console.log("Updated main.js with giant-name fade out");
} else {
    console.log("giant-name already in main.js");
}

// 2. Fix index.html positioning of giant-name
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
    /style="position: absolute; top: 75%; left: 50%; transform: translate\(-50%, -50%\); width: 100vw; text-align: center; font-size: 13vw; line-height: 1; font-family: var\(--font-serif\); letter-spacing: -0\.02em; white-space: nowrap; color: #ffffff; z-index: 1; pointer-events: none;"/,
    'style="position: absolute; bottom: 5vh; left: 50%; transform: translateX(-50%); width: 100vw; text-align: center; font-size: 14vw; line-height: 1; font-family: var(--font-serif); letter-spacing: -0.02em; white-space: nowrap; color: #ffffff; z-index: 1; pointer-events: none;"'
);
fs.writeFileSync('index.html', html);
console.log("Updated index.html positioning");

// 3. The hamburger menu should not be touching the wall on mobile
// In style.css, I had set left: 1.5rem, right: 1.5rem for .site-header.
// Let's ensure it has proper spacing from the wall on mobile.
// Wait, on desktop the logo is inside .site-header. On mobile, .site-header width is calc(100% - 2rem) and left is 1rem.
let css = fs.readFileSync('style.css', 'utf8');

// I will append a cleaner mobile header rule overriding any previous ones.
css += `
@media (max-width: 768px) {
    .site-header {
        left: 1.5rem !important;
        width: calc(100% - 3rem) !important;
        justify-content: space-between !important;
    }
    .site-header .header-container {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}
`;
fs.writeFileSync('style.css', css);
console.log("Updated style.css mobile header margin");
