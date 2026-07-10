const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Add inner padding-top to the post-credits section to create a gap from the projects section
css = css.replace(
    'padding: 0;\n    margin: 0;\n}',
    'padding: 12vh 0 0 0;\n    margin: 0;\n}'
);

// 2. Increase the bottom padding of the credits container to shift the tagline & button up
css = css.replace(
    'padding: 2vh 6vw;\n    gap: 14vh;',
    'padding: 2vh 6vw 12vh 6vw;\n    gap: 14vh;'
);

// Mobile padding adjustments
css = css.replace(
    'padding: 2vh 5vw; gap: 10vh;',
    'padding: 2vh 5vw 10vh 5vw; gap: 10vh;'
);

fs.writeFileSync('style.css', css);
console.log("Updated spacing and padding for post-credits section");
