const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The text is currently: color: #ffffff; z-index: 50; pointer-events: none;
// Let's replace color: #ffffff; with color: #ffffff; mix-blend-mode: overlay; opacity: 0.85;
html = html.replace(
    /color: #ffffff; z-index: 50;/g,
    'color: #ffffff; mix-blend-mode: overlay; opacity: 0.8; z-index: 50;'
);

fs.writeFileSync('index.html', html);
console.log("Applied mix-blend-mode to giant-name to integrate it with the photograph");
