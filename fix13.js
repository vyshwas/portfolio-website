const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace giant-name "VISHWAS MEHTA" text with "STRATEGIC DESIGNER"
html = html.replace('>VISHWAS MEHTA</h1>', '>STRATEGIC DESIGNER</h1>');

// 2. Remove the hero-role-banner (now redundant)
html = html.replace(/<h2 id="hero-role-banner"[^>]*>STRATEGIC DESIGNER<\/h2>\s*/, '');

// 3. Remove the old footer section (desk-footer)
html = html.replace(/<!-- Integrated Closing Footer -->\s*<section id="contact" class="desk-footer">[\s\S]*?<\/section>/m, '');

// 4. Remove cinematic bars (credits-bar)
html = html.replace(/<div class="credits-bar credits-bar-top"><\/div>/g, '');
html = html.replace(/<div class="credits-bar credits-bar-bottom"><\/div>/g, '');

// 5. Fix the name - show full name "VISHWAS MEHTA" instead of just "VISHWAS<br>MEHTA"
// Actually the name IS there but the gradient makes the bottom invisible. Let me fix the gradient.

fs.writeFileSync('index.html', html);
console.log("Updated index.html");

// CSS fixes
let css = fs.readFileSync('style.css', 'utf8');

// 6. Remove space above/below post-credits
css = css.replace(
    '.credits-scroll-container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    padding: 10vh 6vw;\n    gap: 18vh;\n}',
    '.credits-scroll-container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    padding: 2vh 6vw;\n    gap: 14vh;\n}'
);

// 7. Remove credits-bar height
css = css.replace(
    '.credits-bar {\n    width: 100%;\n    height: 8vh;\n    background: #000000;\n}',
    '.credits-bar {\n    display: none;\n}'
);

// 8. Fix the name gradient so the full name is visible
css = css.replace(
    'background: linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.15) 100%);',
    'background: linear-gradient(180deg, #ffffff 60%, rgba(255,255,255,0.5) 100%);'
);

// 9. Fix back-to-top hover: dark text on vermilion background
css = css.replace(
    '.credits-top-btn:hover {\n    background: var(--accent-red);\n    border-color: var(--accent-red);\n    color: #ffffff;\n}',
    '.credits-top-btn:hover {\n    background: var(--accent-red);\n    border-color: var(--accent-red);\n    color: #1a1a1a;\n}'
);

// 10. Remove padding from post-credits section itself
css = css.replace(
    '.post-credits-section {\n    position: relative;\n    background: #0a0a0a;\n    color: #ffffff;\n    overflow: hidden;\n    padding: 0;\n}',
    '.post-credits-section {\n    position: relative;\n    background: #0a0a0a;\n    color: #ffffff;\n    overflow: hidden;\n    padding: 0;\n    margin: 0;\n}'
);

// 11. Mobile fix for credits padding
css = css.replace(
    ".credits-scroll-container { padding: 8vh 5vw; gap: 12vh; }",
    ".credits-scroll-container { padding: 2vh 5vw; gap: 10vh; }"
);

fs.writeFileSync('style.css', css);
console.log("Updated style.css");

// 12. Update main.js: remove hero-role-banner fade (element no longer exists)
let js = fs.readFileSync('main.js', 'utf8');
js = js.replace(/\s*tl\.to\('#hero-role-banner'[^;]+;\s*/g, '\n');
fs.writeFileSync('main.js', js);
console.log("Cleaned up main.js");
