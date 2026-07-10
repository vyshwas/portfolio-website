const fs = require('fs');

// 1. Update HTML: Add the #global-grain container right after <body>
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('id="global-grain"')) {
    html = html.replace(
        '<body>',
        '<body>\n    <div id="global-grain"></div>'
    );
    fs.writeFileSync('index.html', html);
    console.log("Added global-grain element to index.html");
}

// 2. Update CSS: Replace body::after grain with #global-grain rule
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(
    /\/\* Cinematic Film Grain Overlay \*\/[\s\S]*?body::after \{[\s\S]*?\}/g,
    `/* Cinematic Film Grain Overlay (Controlled via JS scroll trigger) */
#global-grain {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 999999;
    opacity: 0; /* Invisible on hero, fades in for about and rest of site */
    background-image: url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E");
    transition: opacity 0.3s ease;
}`
);
fs.writeFileSync('style.css', css);
console.log("Replaced body::after with #global-grain in style.css");

// 3. Update main.js: Fade #global-grain opacity dynamically based on ScrollTrigger progress
let js = fs.readFileSync('main.js', 'utf8');

// Find the onUpdate loop inside ScrollTrigger.create and inject the grain fade
const onUpdateSearch = 'onUpdate: (self) => {\n          //  Camera only moves during Phase 2 (after TV zoom ends at 0.25) \n          const p = self.progress;';
const onUpdateReplace = `onUpdate: (self) => {
          // Fade in global grain only when entering the About section (progress >= 0.22)
          const globalGrain = document.getElementById('global-grain');
          if (globalGrain) {
            globalGrain.style.opacity = self.progress >= 0.22 ? '0.04' : '0';
          }
          //  Camera only moves during Phase 2 (after TV zoom ends at 0.25) 
          const p = self.progress;`;

js = js.replace(onUpdateSearch, onUpdateReplace);

// Ensure the grain remains visible when leaving the hero trigger downwards
const onLeaveSearch = "onLeave:     () => { heroBg.style.willChange = 'auto'; },";
const onLeaveReplace = `onLeave:     () => { 
          heroBg.style.willChange = 'auto'; 
          const globalGrain = document.getElementById('global-grain');
          if (globalGrain) globalGrain.style.opacity = '0.04';
        },`;

js = js.replace(onLeaveSearch, onLeaveReplace);

// Ensure the grain fades back out when returning to the hero trigger
const onEnterBackSearch = "onEnterBack: () => { heroBg.style.willChange = 'transform'; },";
const onEnterBackReplace = `onEnterBack: () => { 
          heroBg.style.willChange = 'transform'; 
          const globalGrain = document.getElementById('global-grain');
          if (globalGrain) {
            globalGrain.style.opacity = heroTrigger ? (heroTrigger.progress >= 0.22 ? '0.04' : '0') : '0';
          }
        },`;

js = js.replace(onEnterBackSearch, onEnterBackReplace);

fs.writeFileSync('main.js', js);
console.log("Updated main.js ScrollTrigger logic for global grain control");
