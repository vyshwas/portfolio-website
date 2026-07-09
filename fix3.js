const fs = require('fs');

// 1. Fix the mobile hamburger menu padding
let css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('padding: 0 !important; /* fix hamburger */')) {
    css = css.replace(
        /\.site-header \.header-container \{\n\s*margin-left: 0 !important;\n\s*margin-right: 0 !important;\n\s*\}/,
        '.site-header .header-container {\n        margin-left: 0 !important;\n        margin-right: 0 !important;\n        padding: 0 !important; /* fix hamburger */\n    }'
    );
    fs.writeFileSync('style.css', css);
    console.log("Fixed mobile hamburger padding in style.css");
}

// 2. Move #giant-name to be visible on top of #hero-bg
let html = fs.readFileSync('index.html', 'utf8');

// Extract the giant-name element
const giantNameMatch = html.match(/<h1 id="giant-name"[^>]+>VISHWAS MEHTA<\/h1>/);
if (giantNameMatch) {
    const giantNameStr = giantNameMatch[0];
    
    // Remove it from its current location
    html = html.replace(giantNameStr, '');
    
    // Ensure we don't have leftover blank lines
    html = html.replace(/\s*<!-- The desert TV photograph - this is what scales during the zoom -->/, 
                        '\n        <!-- The desert TV photograph - this is what scales during the zoom -->');
                        
    // Inject it right before screen-overlay so it renders on top of hero-bg
    // Let's also adjust the z-index just in case.
    const newGiantNameStr = giantNameStr.replace('z-index: 1;', 'z-index: 5;');
    
    html = html.replace(
        /<!-- Screen overlay - floats over the real TV screen in the photo -->/,
        newGiantNameStr + '\n\n        <!-- Screen overlay - floats over the real TV screen in the photo -->'
    );
    
    fs.writeFileSync('index.html', html);
    console.log("Fixed #giant-name positioning in index.html");
} else {
    console.log("Could not find #giant-name in index.html");
}
