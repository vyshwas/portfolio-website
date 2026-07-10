const fs = require('fs');

// 1. Remove the crt-switch toggle button HTML from index.html
let html = fs.readFileSync('index.html', 'utf8');

// Find and remove the crt-switch block
html = html.replace(/<!-- CRT Flip Switch -->[\s\S]*?<\/div>\s*<\/header>/, '</header>');

fs.writeFileSync('index.html', html);
console.log("Removed toggle switch from index.html");

// 2. Remove flip-mode styles from style.css to keep the code clean
let css = fs.readFileSync('style.css', 'utf8');

css = css.replace(/\/\* --- Full Color Inversion Theme --- \*\/[\s\S]*?shadow:[^\}]+!important;\s*\}/g, '');
css = css.replace(/html\.flip-mode\s*body\s*\{[^}]+\}/g, '');
css = css.replace(/html\.flip-mode\s*#hero-bg\s*\{[^}]+\}/g, '');

fs.writeFileSync('style.css', css);
console.log("Cleaned up style.css by removing flip-mode classes");
