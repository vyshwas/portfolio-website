const fs = require('fs');

let js = fs.readFileSync('main.js', 'utf8');

// Replace the individual block triggers with a single staggered timeline triggered by #post-credits
const oldReveal = `  // --- POST-CREDITS SCROLL REVEAL ---
  gsap.utils.toArray('.credits-block').forEach((block) => {
    gsap.from(block, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
    });
  });`;

const newReveal = `  // --- POST-CREDITS SCROLL REVEAL ---
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
  });`;

js = js.replace(oldReveal, newReveal);
fs.writeFileSync('main.js', js);
console.log("Updated ScrollTrigger in main.js to use single staggered trigger on #post-credits");
