const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Remove the old horizontal scaleX(-1) flip rules we added
css = css.replace(
    /body\.flip-mode \{\s*transform: scaleX\(-1\);\s*transform-origin: center top;\s*\}/g,
    ''
);

// 2. Add the color inversion rules to style.css
const invertStyles = `
/* --- Color Inversion (Theme Flip) --- */
body.flip-mode {
    filter: invert(1) hue-rotate(180deg) !important;
    background-color: #ffffff !important;
}

/* Negate inversion on images and media to keep them looking normal */
body.flip-mode img,
body.flip-mode video,
body.flip-mode #hero-bg,
body.flip-mode .preview-hero-img,
body.flip-mode .drawer-main img,
body.flip-mode .preview-media-container img,
body.flip-mode .preview-frame img,
body.flip-mode .collage-img {
    filter: invert(1) hue-rotate(180deg) !important;
}

/* Keep the switch itself dark and consistent (negate body inversion on it) */
body.flip-mode .crt-switch {
    filter: invert(1) hue-rotate(180deg) !important;
}
`;

css += invertStyles;
fs.writeFileSync('style.css', css);
console.log("Updated style.css with color inversion (theme flip) styles");

// 3. Fix the toggle switch label text in index.html to read "INVERT" instead of "FLIP"
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
    '<span class="crt-switch-label" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.1em; transition: color 0.3s ease;">FLIP</span>',
    '<span class="crt-switch-label" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.1em; transition: color 0.3s ease;">INVERT</span>'
);
fs.writeFileSync('index.html', html);
console.log("Updated index.html toggle label to INVERT");
