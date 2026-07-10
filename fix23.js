const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Add negation rule for #hero-bg under html.flip-mode to keep it in original colors
const negateHeroBg = `
/* Negate color inversion on the TV background photo to preserve its original tones */
html.flip-mode #hero-bg {
    filter: invert(1) !important;
}
`;

css += negateHeroBg;
fs.writeFileSync('style.css', css);
console.log("Updated style.css to prevent TV hero background inversion");
