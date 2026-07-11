const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Use a robust regex to insert the image tag above the back-to-top button
const regex = /(<div class="credits-block credits-final">[\s\S]*?<span class="credits-tagline">[\s\S]*?<\/span>\s*\n)/g;

if (regex.test(html)) {
    html = html.replace(
        regex,
        `$1          <img src="assets/thats-all-folks.png" alt="That's all Folks!" style="width: min(280px, 60vw); display: block; margin: 2rem auto 3rem auto; opacity: 0.95; filter: contrast(1.1);\\n">\n`
    );
    fs.writeFileSync('index.html', html);
    console.log("Successfully inserted thats-all-folks.png image into index.html");
} else {
    console.log("Error: Could not match credits-final block in index.html");
}
