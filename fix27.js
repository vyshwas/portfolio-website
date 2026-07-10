const fs = require('fs');

let js = fs.readFileSync('main.js', 'utf8');

// Prepend the localStorage cleanup at the very beginning of the DOMContentLoaded block
js = js.replace(
    "document.addEventListener('DOMContentLoaded', () => {",
    "document.addEventListener('DOMContentLoaded', () => {\n  // Clean up any remaining flipMode local storage states\n  localStorage.removeItem('flipMode');\n  document.documentElement.classList.remove('flip-mode');\n  document.body.classList.remove('flip-mode');"
);

fs.writeFileSync('main.js', js);
console.log("Added automated flipMode storage cleanup to main.js");
