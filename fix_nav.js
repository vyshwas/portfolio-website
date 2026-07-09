const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the literal `n artifact from the hero section
html = html.replace('</h1>`n        <!-- The desert TV photograph', '</h1>\n        <!-- The desert TV photograph');

// 2. Remove VISHWAS MEHTA from the viewport/hero section where I put it last time
// I need to find the giant-name element and update it.
// The user says: "i want the VISHWAS MEHTA INSIDE THE viewport and only on the hero section. it should NOT go in about section."
// And: "Vishwash mehta should be start to end in the viewport width and should fade out with the dessert image, it should not go to the base of about section."
// If I put it inside `#screen-overlay`, it scales.
// If I put it inside `#hero-scene` but NOT in a scaling container, it works.
// Wait, `#hero-scene` is just a section. It gets pinned.
// If I set position: absolute, top: 50%, transform: translateY(-50%), it sits in the middle of the viewport!
// Let's replace the existing #giant-name style.
html = html.replace(
    /style="position: absolute; bottom: 0; left: 0; width: 100vw; text-align: center; font-size: 14vw; line-height: 1; font-family: var\(--font-serif\); letter-spacing: -0\.02em; white-space: nowrap; color: #ffffff; z-index: 1; pointer-events: none;"/,
    'style="position: absolute; top: 75%; left: 50%; transform: translate(-50%, -50%); width: 100vw; text-align: center; font-size: 13vw; line-height: 1; font-family: var(--font-serif); letter-spacing: -0.02em; white-space: nowrap; color: #ffffff; z-index: 1; pointer-events: none;"'
);

// 3. Swap Backyard and Resume
// Desktop Menu
html = html.replace(
    /<li><a href="https:\/\/vyshwas\.github\.io\/vyshwas-s-playground\/" target="_blank" rel="noopener" class="nav-backyard-btn">Backyard<\/a><\/li>\s*<li><a href="resume\.pdf" target="_blank" rel="noopener" class="nav-resume-btn">\[ RESUME \]<\/a><\/li>/,
    '<li><a href="resume.pdf" target="_blank" rel="noopener" class="nav-resume-btn">[ RESUME ]</a></li>\n            <li><a href="https://vyshwas.github.io/vyshwas-s-playground/" target="_blank" rel="noopener" class="nav-backyard-btn">Backyard</a></li>'
);

// Mobile Menu
html = html.replace(
    /<li><a href="https:\/\/vyshwas\.github\.io\/vyshwas-s-playground\/" target="_blank" rel="noopener" class="nav-backyard-btn" style="[^"]*">Backyard<\/a><\/li>\s*<li><a href="resume\.pdf" target="_blank" rel="noopener" class="nav-resume-btn" style="[^"]*">\[ RESUME \]<\/a><\/li>/,
    '<li><a href="resume.pdf" target="_blank" rel="noopener" class="nav-resume-btn" style="font-size: 2rem; font-family: var(--font-serif); display: block; color: #fff;">[ RESUME ]</a></li>\n            <li><a href="https://vyshwas.github.io/vyshwas-s-playground/" target="_blank" rel="noopener" class="nav-backyard-btn" style="font-size: 2rem; font-family: var(--font-serif); display: block; color: var(--accent-red);">Backyard</a></li>'
);

fs.writeFileSync('index.html', html);
console.log("Fixes applied to index.html");
