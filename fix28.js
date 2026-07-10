const fs = require('fs');

// 1. Update style.css: set credits-block default opacity to 1 (progressive enhancement)
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(
    /opacity: 0;\s*transform: translateY\(40px\);/g,
    'opacity: 1;'
);
fs.writeFileSync('style.css', css);
console.log("Updated credits-block styles to support progressive enhancement (opacity: 1 by default)");

// 2. Update main.js: change gsap.fromTo to gsap.from to match the new default CSS opacity
let js = fs.readFileSync('main.js', 'utf8');
js = js.replace(
    /gsap\.fromTo\(block,\s*\{\s*y:\s*40,\s*opacity:\s*0\s*\},\s*\{\s*y:\s*0,\s*opacity:\s*1,\s*duration:\s*1\.2,\s*ease:\s*'power2\.out',/g,
    `gsap.from(block, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',`
);
fs.writeFileSync('main.js', js);
console.log("Updated ScrollTrigger implementation in main.js to use gsap.from");
