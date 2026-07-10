const fs = require('fs');

let js = fs.readFileSync('main.js', 'utf8');

// Find the scroll reveal block and replace it cleanly
const regex = /\/\/ --- POST-CREDITS SCROLL REVEAL ---[\s\S]*?\}\);\s*\}\);\s*\}\);\s*\}\);/g;
// Wait! Let's check how the block ends exactly.
// It ends with:
//           }
//         }
//       );
//     });
// That is:
//           }
//         }
//       );
//     });

// Let's use a very safe replacement matching up to creditsTopBtn
const searchStr = `  // --- POST-CREDITS SCROLL REVEAL ---
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
        }
      );
    });`;

const replaceStr = `  // --- POST-CREDITS SCROLL REVEAL ---
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

js = js.replace(searchStr, replaceStr);
fs.writeFileSync('main.js', js);
console.log("Successfully replaced ScrollTrigger with staggered block in main.js");
