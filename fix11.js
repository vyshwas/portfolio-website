const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove "Strategic Designer" from the screen overlay
html = html.replace(
    '<span class="screen-tag" style="text-transform: uppercase; font-family: \'Inter\', sans-serif; font-size: clamp(0.45rem, 3cqw, 0.65rem); color: #ffffff; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 3cqh;">Strategic Designer</span>',
    ''
);

// 2. Add "STRATEGIC DESIGNER" as a large editorial text just below the nav bar, 
// similar to the giant-name watermark but at the top
// Place it right after the giant-name element
html = html.replace(
    '</h1>\n\n        <!-- Screen overlay',
    '</h1>\n\n        <h2 id="hero-role-banner" style="position: absolute; top: 12vh; left: 50%; transform: translateX(-50%); width: 100vw; text-align: center; font-size: 5vw; line-height: 1; font-family: var(--font-serif); letter-spacing: 0.15em; text-transform: uppercase; white-space: nowrap; color: #ffffff; mix-blend-mode: overlay; opacity: 0.8; z-index: 50; pointer-events: none; font-weight: 300;">STRATEGIC DESIGNER</h2>\n\n        <!-- Screen overlay'
);

// 3. Shift the TV lower: change screen-overlay top from 55.5% to 60%
html = html.replace(
    'top: 55.5%;\n        width:  23.5vw;',
    'top: 60%;\n        width:  23.5vw;'
);

fs.writeFileSync('index.html', html);
console.log("Removed strategic designer from screen, added banner below nav, shifted TV down");

// 4. Also shift the TV_ORIGIN_Y in main.js to match the new position
let js = fs.readFileSync('main.js', 'utf8');
js = js.replace(
    "const TV_ORIGIN_Y   = 55.5; // % from top - tuned for new photo",
    "const TV_ORIGIN_Y   = 60; // % from top - shifted TV lower"
);
fs.writeFileSync('main.js', js);
console.log("Updated TV_ORIGIN_Y to 60 in main.js");

// 5. Add fade-out for the hero-role-banner in the GSAP timeline
js = fs.readFileSync('main.js', 'utf8');
if (!js.includes('#hero-role-banner')) {
    js = js.replace(
        "tl.to('#giant-name', { opacity: 0, duration: 0.1 }, 0);",
        "tl.to('#giant-name', { opacity: 0, duration: 0.1 }, 0);\n\n      tl.to('#hero-role-banner', { opacity: 0, duration: 0.1 }, 0);"
    );
    fs.writeFileSync('main.js', js);
    console.log("Added hero-role-banner fade to GSAP timeline");
}
