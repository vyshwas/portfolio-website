const fs = require('fs');

// 1. Lower the watermark
let html = fs.readFileSync('index.html', 'utf8');

// The current style has 'bottom: 2vh;'
html = html.replace(
    /bottom: 2vh;/,
    'bottom: -1vh;'
);

fs.writeFileSync('index.html', html);
console.log("Updated giant-name position");

// 2. Fix the hamburger alignment inside the scrolled nav circle
let css = fs.readFileSync('style.css', 'utf8');

// I will append a rule to forcefully center the hamburger when in the 48px circle state
// The class is .site-header.scrolled-nav .header-container
css += `
.site-header.scrolled-nav .header-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    justify-content: center !important;
    align-items: center !important;
}
`;

fs.writeFileSync('style.css', css);
console.log("Updated style.css for hamburger alignment");
