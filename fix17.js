const fs = require('fs');

// 1. Fix HTML: replace "same time." with "same&nbsp;time." to prevent widow/orphan word
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
    'conversations happen at the same time.</p>',
    'conversations happen at the same&nbsp;time.</p>'
);
fs.writeFileSync('index.html', html);
console.log("Updated HTML with non-breaking space for 'same time.'");

// 2. Fix CSS: Adjust credits-name gradient so it is properly visible (more opaque at bottom)
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(
    'background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.35) 100%);',
    'background: linear-gradient(180deg, #ffffff 20%, rgba(255,255,255,0.75) 100%);\n    display: inline-block;\n    width: 100%;'
);
fs.writeFileSync('style.css', css);
console.log("Updated CSS with more visible gradient and block layouts for credits name");
