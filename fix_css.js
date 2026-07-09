const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// 1. Remove the global right-alignment I accidentally added for scrolled nav
css = css.replace(/\.site-header\.scrolled-nav \.header-container \{ width: 48px !important; margin-left: auto !important; margin-right: 0 !important; \}/, 
                  '.site-header.scrolled-nav .header-container { width: 48px; }');

// 2. Add mobile-specific rules to put the hamburger on the right
// In mobile, .site-header should be space-between (logo on left, hamburger on right)
// both in hero section and when scrolled.
const mobileRules = `
@media (max-width: 768px) {
  .site-header { justify-content: space-between !important; }
  .site-header .header-container { width: 48px !important; margin-left: auto !important; margin-right: 0 !important; }
  .site-header.scrolled-nav { justify-content: flex-end !important; }
}
`;

// Append mobileRules to the end of style.css
css += mobileRules;

fs.writeFileSync('style.css', css);
console.log("Fixes applied to style.css");
