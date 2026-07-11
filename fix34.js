const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('filter: contrast(1.1);\\n">', 'filter: contrast(1.1);">');
fs.writeFileSync('index.html', html);
console.log("Cleaned up backslash n character from index.html");
