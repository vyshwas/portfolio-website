const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Insert the Bugs Bunny closing image above the back-to-top button in the credits-final card
const targetStr = `<div class="credits-block credits-final">
          <span class="credits-tagline">BUILT QUIETLY. &mdash; 2026</span>
          <button id="credits-back-to-top" class="credits-top-btn" aria-label="Back to top">&uarr; BACK TO TOP</button>
        </div>`;

const replaceStr = `<div class="credits-block credits-final">
          <span class="credits-tagline">BUILT QUIETLY. &mdash; 2026</span>
          <img src="assets/thats-all-folks.png" alt="That's all Folks!" style="width: min(280px, 60vw); display: block; margin: 0 auto 3rem auto; opacity: 0.95; filter: contrast(1.1);">
          <button id="credits-back-to-top" class="credits-top-btn" aria-label="Back to top">&uarr; BACK TO TOP</button>
        </div>`;

html = html.replace(targetStr, replaceStr);
fs.writeFileSync('index.html', html);
console.log("Successfully added Bugs Bunny image to index.html");
