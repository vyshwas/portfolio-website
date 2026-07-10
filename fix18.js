const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Change font-size to clamp(4rem, 13vw, 15rem) to fit "VISHWAS MEHTA" within the screen width
// 2. Add padding and box-sizing to prevent background-clip text clipping on the edges
css = css.replace(
    /font-size: clamp\(5rem, 18vw, 20rem\);/g,
    'font-size: clamp(4rem, 13vw, 15rem);'
);

css = css.replace(
    /\.credits-title-card \.credits-name \{([\s\S]*?)\}/,
    `.credits-title-card .credits-name {
    font-family: var(--font-serif);
    font-size: clamp(4rem, 13vw, 15rem);
    font-weight: 800;
    line-height: 0.85;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    margin: 0;
    background: linear-gradient(180deg, #ffffff 20%, rgba(255,255,255,0.75) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
    width: 100%;
    padding: 0 0.05em;
    box-sizing: border-box;
}`
);

fs.writeFileSync('style.css', css);
console.log("Adjusted credits-name font size and padding to prevent clipping");
