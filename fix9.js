const fs = require('fs');

// 1. Change z-title font to serif in style.css
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(
    'font-family: var(--font-sans) !important; \n    text-transform: uppercase !important;',
    'font-family: var(--font-serif) !important; \n    text-transform: uppercase !important;'
);
fs.writeFileSync('style.css', css);
console.log("Changed z-title font to serif");

// 2. Increase SCROLL_MULT from 1.1 to 6 so the about section stays much longer
let js = fs.readFileSync('main.js', 'utf8');
js = js.replace(
    "const SCROLL_MULT   = 1.1;    // pin scroll distance reduced for faster scroll",
    "const SCROLL_MULT   = 6;    // increased for readable about section"
);
fs.writeFileSync('main.js', js);
console.log("Increased SCROLL_MULT from 1.1 to 6");
