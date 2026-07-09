const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find the current giant-name element and update its style to anchor it to the bottom so it is fully visible.
html = html.replace(
    /<h1 id="giant-name" style="[^"]*">VISHWAS MEHTA<\/h1>/,
    '<h1 id="giant-name" style="position: absolute; bottom: 2vh; left: 50%; transform: translateX(-50%); width: 100vw; text-align: center; font-size: 12.5vw; line-height: 0.8; font-family: var(--font-serif); letter-spacing: -0.02em; white-space: nowrap; color: #ffffff; z-index: 50; pointer-events: none;">VISHWAS MEHTA</h1>'
);

fs.writeFileSync('index.html', html);
console.log("Updated giant-name to anchor to bottom and be fully visible");
