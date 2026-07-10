const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add "Post Credit" to desktop nav - insert after the Work li
html = html.replace(
    /<li><a href="#work"\s+class="nav-link">Work<\/a><\/li>\s*\n\s*\n\s*<li class="nav-divider">/,
    '<li><a href="#work"        class="nav-link">Work</a></li>\n            <li><a href="#post-credits" class="nav-link">Post Credit</a></li>\n            \n            <li class="nav-divider">'
);

// 2. Add "Post Credit" to mobile drawer - insert after the Work li in mobile
html = html.replace(
    /<li><a href="#work"\s+class="nav-link" style="font-size: 2rem; font-family: var\(--font-serif\); display: block; color: #fff;">Work<\/a><\/li>\s*\n\s*\n\s*<li><a href="https:\/\/www\.behance/,
    '<li><a href="#work"        class="nav-link" style="font-size: 2rem; font-family: var(--font-serif); display: block; color: #fff;">Work</a></li>\n            <li><a href="#post-credits" class="nav-link" style="font-size: 2rem; font-family: var(--font-serif); display: block; color: #fff;">Post Credit</a></li>\n            \n            <li><a href="https://www.behance'
);

fs.writeFileSync('index.html', html);
console.log("Added Post Credit to nav");

// 3. CSS fixes
let css = fs.readFileSync('style.css', 'utf8');

// Bring back gradient on credits-name but make full name visible
css = css.replace(
    "color: #ffffff;\n    -webkit-text-fill-color: #ffffff;",
    "background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.35) 100%);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    background-clip: text;"
);

// Increase z-title from clamp(3rem, 8vw, 10rem) to clamp(3.5rem, 9vw, 12rem)
css = css.replace(
    "font-size: clamp(3rem, 8vw, 10rem) !important;",
    "font-size: clamp(3.5rem, 9vw, 12rem) !important;"
);

// Increase z-desc from clamp(0.9rem, 1.2vw, 1.15rem) to clamp(1rem, 1.4vw, 1.35rem)
css = css.replace(
    "font-size: clamp(0.9rem, 1.2vw, 1.15rem) !important;",
    "font-size: clamp(1rem, 1.4vw, 1.35rem) !important;"
);

fs.writeFileSync('style.css', css);
console.log("Restored gradient, increased about text size");
