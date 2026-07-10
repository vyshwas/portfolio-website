const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Add a clean mobile rule at the very end to force hamburger to the right
css += `
@media (max-width: 1024px) {
    .site-header .header-container {
        margin-left: auto !important;
        margin-right: 0 !important;
    }
}
`;

fs.writeFileSync('style.css', css);
console.log("Pushed hamburger to the right on mobile/tablet");
