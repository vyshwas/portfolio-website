const fs = require('fs');
let js = fs.readFileSync('main.js', 'utf8');

// 1. Reduce blur aggressiveness: change /150 to /600 so blur kicks in much later
js = js.replace(
    "const blurAmt = Math.max(0, Math.abs(effectiveZ) / 150 - 1);",
    "const blurAmt = Math.max(0, Math.abs(effectiveZ) / 600 - 1);"
);

// 2. Widen the fade-out window: start fading at 1200 instead of 400, fully gone at 2500 instead of 800
js = js.replace(
    "if (effectiveZ > 400) {\n              alpha = 1 - Math.max(0, (effectiveZ - 500) / 300);",
    "if (effectiveZ > 1200) {\n              alpha = 1 - Math.max(0, (effectiveZ - 1200) / 1300);"
);

// 3. Also handle the fade-IN: slides that are far away should fade in more gently
// Currently there's no fade-in logic — slides just start blurry. Let's add an opacity ramp for negative Z.
// We'll add a fade-in block right after the existing alpha block.
js = js.replace(
    "alpha = Math.max(0, Math.min(1, alpha));",
    "// Fade-in: slides still far ahead (negative effectiveZ) fade in gradually\n            if (effectiveZ < -800) {\n              alpha = Math.min(alpha, Math.max(0, 1 - (Math.abs(effectiveZ) - 800) / 1500));\n            }\n            alpha = Math.max(0, Math.min(1, alpha));"
);

fs.writeFileSync('main.js', js);
console.log("Widened fade-in/fade-out thresholds for readable Z-slides");
