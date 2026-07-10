const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// We need to replace the old .z-slide and .z-title styles.
// I'll use regex to strip out the old block, then append the new block.

// Remove old .z-slide block
css = css.replace(/\.z-slide\s*\{[^}]+\}/g, '');
// Remove old .z-title block
css = css.replace(/\.z-title\s*\{[^}]+\}/g, '');
// Remove old .z-meta block
css = css.replace(/\.z-meta\s*\{[^}]+\}/g, '');
// Remove old .z-desc block
css = css.replace(/\.z-desc\s*\{[^}]+\}/g, '');
// Remove old .z-title-muted block
css = css.replace(/\.z-title-muted\s*\{[^}]+\}/g, '');

// The mobile overrides for .z-slide might still exist in a media query. Let's append an !important override block at the end.
const brutalistCSS = `
/* --- BRUTALIST EDITORIAL ABOUT SECTION --- */
.z-slide { 
    position: absolute !important; 
    top: 50% !important; 
    left: 50% !important; 
    transform: translate(-50%, -50%) !important; 
    width: 100vw !important; 
    max-width: none !important;
    padding: 0 4vw !important;
    display: flex !important; 
    flex-direction: column !important; 
    align-items: flex-start !important; 
    text-align: left !important; 
    opacity: 0; 
    pointer-events: auto !important; 
}

.z-title { 
    font-size: clamp(4rem, 11vw, 15rem) !important; 
    font-weight: 800 !important; 
    line-height: 0.85 !important; 
    margin-bottom: 2rem !important; 
    font-family: var(--font-sans) !important; 
    text-transform: uppercase !important; 
    letter-spacing: -0.04em !important; 
    width: 100% !important;
}

.z-title-muted { 
    color: var(--text-secondary) !important; 
    display: block !important;
    text-align: right !important;
}

.z-title-accent {
    color: var(--accent-red) !important;
    display: block !important;
    text-align: right !important;
}

.z-meta { 
    font-family: var(--font-sans) !important; 
    font-size: 0.85rem !important; 
    text-transform: uppercase !important; 
    letter-spacing: 0.05em !important; 
    color: var(--text-primary) !important; 
    margin-bottom: 1rem !important; 
    display: block !important; 
    font-weight: 600 !important;
}

.z-desc { 
    font-size: clamp(1rem, 1.5vw, 1.5rem) !important; 
    line-height: 1.4 !important; 
    max-width: 400px !important; 
    font-family: var(--font-sans) !important; 
    color: var(--text-muted) !important; 
    font-weight: 500 !important; 
    align-self: flex-end !important; 
    text-align: right !important;
}

@media (max-width: 768px) {
    .z-title { font-size: clamp(3rem, 14vw, 5rem) !important; }
    .z-slide { padding: 0 6vw !important; }
    .z-desc { max-width: 90% !important; }
}
`;

css += brutalistCSS;
fs.writeFileSync('style.css', css);
console.log("Updated style.css with brutalist editorial layout for Z-slides.");
