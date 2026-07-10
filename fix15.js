const fs = require('fs');

// 1. CSS changes
let css = fs.readFileSync('style.css', 'utf8');

// Reduce z-title size from clamp(4rem, 11vw, 15rem) to clamp(3rem, 8vw, 10rem)
css = css.replace(
    "font-size: clamp(4rem, 11vw, 15rem) !important;",
    "font-size: clamp(3rem, 8vw, 10rem) !important;"
);

// Reduce z-desc size from clamp(1rem, 1.5vw, 1.5rem) to clamp(0.9rem, 1.2vw, 1.2rem)
css = css.replace(
    "font-size: clamp(1rem, 1.5vw, 1.5rem) !important;",
    "font-size: clamp(0.9rem, 1.2vw, 1.15rem) !important;"
);

// Fix credits-name: remove the gradient clip (which hides text) and just use solid white
css = css.replace(
    "background: linear-gradient(180deg, #ffffff 60%, rgba(255,255,255,0.5) 100%);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    background-clip: text;",
    "color: #ffffff;\n    -webkit-text-fill-color: #ffffff;"
);

fs.writeFileSync('style.css', css);
console.log("Updated CSS: reduced z-title/z-desc size, fixed credits-name visibility");

// 2. HTML changes - add Post Credit nav link
let html = fs.readFileSync('index.html', 'utf8');

// Desktop nav: add "Post Credit" after "Work"
html = html.replace(
    '<li><a href="#work"        class="nav-link">Work</a></li>\n            \n            <li class="nav-divider">|</li>',
    '<li><a href="#work"        class="nav-link">Work</a></li>\n            <li><a href="#post-credits" class="nav-link">Post Credit</a></li>\n            \n            <li class="nav-divider">|</li>'
);

// Mobile drawer: add "Post Credit" after "Work"
html = html.replace(
    '<li><a href="#work"        class="nav-link" style="font-size: 2rem; font-family: var(--font-serif); display: block; color: #fff;">Work</a></li>\n            \n',
    '<li><a href="#work"        class="nav-link" style="font-size: 2rem; font-family: var(--font-serif); display: block; color: #fff;">Work</a></li>\n            <li><a href="#post-credits" class="nav-link" style="font-size: 2rem; font-family: var(--font-serif); display: block; color: #fff;">Post Credit</a></li>\n            \n'
);

fs.writeFileSync('index.html', html);
console.log("Added Post Credit nav link");
