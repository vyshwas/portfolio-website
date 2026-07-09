const fs = require('fs');

// Fix style.css: remove the recent @media (max-width: 768px) blocks I appended that messed up the hamburger
let css = fs.readFileSync('style.css', 'utf8');

// I will just remove the blocks I appended at the very end of style.css
// I know I appended them at the end.
css = css.replace(/@media \(max-width: 768px\) \{\n\s*\.site-header \{ justify-content: space-between !important; \}\n\s*\.site-header \.header-container \{ width: 48px !important; margin-left: auto !important; margin-right: 0 !important; \}\n\s*\.site-header\.scrolled-nav \{ justify-content: flex-end !important; \}\n\}/g, '');
css = css.replace(/@media \(max-width: 768px\) \{\n\s*\.site-header \{\n\s*left: 1\.5rem !important;\n\s*width: calc\(100% - 3rem\) !important;\n\s*justify-content: space-between !important;\n\s*\}\n\s*\.site-header \.header-container \{\n\s*margin-left: 0 !important;\n\s*margin-right: 0 !important;\n\s*padding: 0 !important; \/\* fix hamburger \*\/\n\s*\}\n\}/g, '');

// To satisfy "in the mobile navigation bar is in middle when its in the hero section it should be on the right."
// I just need to add justify-content: space-between on .site-header for mobile, and make sure .header-container isn't forced to width: 48px if it was a pill!
// Let's add a clean block for it.
css += `
@media (max-width: 768px) {
    .site-header {
        justify-content: space-between !important;
        left: 1rem !important;
        right: 1rem !important;
        width: calc(100% - 2rem) !important;
    }
}
`;

fs.writeFileSync('style.css', css);
console.log("Restored hamburger to previous state");

// 2. Watermark visibility before scrolling
// The user says "watermark should be visible on the screen before scrolling starts."
// It was visible but maybe z-index: 5 wasn't enough because #screen-overlay or #hero-bg had a higher z-index, OR opacity was 0?
// Wait, I put #giant-name BEFORE #screen-overlay in index.html.
// And I gave it z-index: 5. 
// What is the z-index of #hero-bg? It has NO z-index in CSS.
// What about #hero-grain and #hero-vignette? They might have higher z-indexes.
// Let's just put #giant-name at z-index: 999 to guarantee it is visible!
// Wait! If it's 999, it might cover the #screen-overlay text. Let's make it z-index: 10 but pointer-events: none.
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/z-index: 5;/g, 'z-index: 50;');

fs.writeFileSync('index.html', html);
console.log("Boosted giant-name z-index");
