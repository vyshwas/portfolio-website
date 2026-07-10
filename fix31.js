const fs = require('fs');

let js = fs.readFileSync('main.js', 'utf8');

// Let's completely reconstruct the end of main.js to fix the nesting bug.
// We will slice the file before "/* --- Custom Cursor Logic --- */" and replace everything after it.

const cursorStartIdx = js.indexOf("/* --- Custom Cursor Logic --- */");
if (cursorStartIdx !== -1) {
    let mainContent = js.slice(0, cursorStartIdx);

    // Let's verify what was inside the post-credits block
    const postCreditsCode = `
  // --- POST-CREDITS SCROLL REVEAL ---
  // Trigger all blocks to fade in sequentially (staggered) once the credits section enters the screen
  gsap.from('.credits-block', {
    y: 40,
    opacity: 0,
    duration: 1.2,
    stagger: 0.25, // Cinematic staggered reveal
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#post-credits',
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });

  // Credits back-to-top button
  const creditsTopBtn = document.getElementById('credits-back-to-top');
  if (creditsTopBtn) {
    creditsTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
`;

    // Append postCreditsCode to the main DOMContentLoaded body (just before the cursor logic starts)
    // First, let's remove the closing "});" of DOMContentLoaded which is at the end of mainContent,
    // so we can insert the post-credits code, then close it.
    mainContent = mainContent.trim();
    if (mainContent.endsWith("});")) {
        mainContent = mainContent.slice(0, -3); // Strip the "});"
    }

    // Now construct the final block: mainContent + postCreditsCode + DOMContentLoaded close + Clean Cursor Logic
    const cleanCursorCode = `
  /* --- Custom Cursor Logic --- */
  const cursor = document.getElementById("custom-cursor");
  if (cursor && window.innerWidth > 768) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      
      window.addEventListener("mousemove", (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          cursor.style.transform = \`translate(\${mouseX}px, \${mouseY}px) translate(-50%, -50%)\`;
      });
      
      const hoverElements = document.querySelectorAll("a, button, .work-row, .menu-toggle");
      hoverElements.forEach(el => {
          el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
          el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
      });
  }
`;

    const finalJs = mainContent + postCreditsCode + "});\n" + cleanCursorCode;
    fs.writeFileSync('main.js', finalJs);
    console.log("Successfully restructured main.js: resolved DOMContentLoaded nesting bug and cleaned up custom cursor logic.");
} else {
    console.log("Error: Could not find Custom Cursor Logic comment in main.js");
}
