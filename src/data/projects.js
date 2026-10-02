export const projects = [
  {
    no: '01',
    title: 'Awara',
    tagline: 'Turning research into a living travel companion.',
    year: '2025',
    role: 'CLIENT • RESEARCH + SYSTEMS DESIGN',
    context:
      'As the Lead UX Researcher & Systems Designer, I was tasked with solving a fundamental problem: travel itineraries break the moment you arrive. Once a traveler lands, plans inevitably change due to weather, delays, or spontaneity, leaving users with a broken schedule and forcing them back to manual searching in maps and browsers.',
    problem:
      'How do we build an itinerary that acts as an active travel companion, continuously adapting the schedule as the day unfolds without overwhelming the user with constant notifications?',
    approach: [
      'Decision 1: Dynamic Healing vs. Static Recalculation. I considered a Google Maps-style rerouting approach, but rejected it because aggressive recalculation causes anxiety on a holiday. Instead, I chose a "healing" system: if a user spends too long at a museum, the app silently absorbs the delay and proactively suggests a single, localized alternative for the next activity when they open the app.',
      'Decision 2: A Calm Daylight System. The first version was a dark vermilion poster: striking in a case study, tiring on a phone checked twenty times a day. I rebuilt it as a daylight system with sand surfaces, forest for the brand, sun yellow reserved for the one action on each screen, and terracotta clay only for live changes, so colour tells the traveller what to do next.',
      'Decision 3: The Boundary of the Prototype. I built the core loop end to end, from planning a trip (drafted by Awara or by hand) to bending it live across three days in Jaipur. I intentionally did not build booking flows, focusing on schedule adjustment (adjust sheets and live nudges) to prove the thesis.'
    ],
    outcome: [
      'Live, context-aware itinerary that heals itself',
      'Adjust sheet with proactive, localized alternatives',
      'Forest, sun and clay design system with documented tokens',
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/awara-prototype.html',
    preview: './assets/mockup_awara.png',
    previewAlt: 'Three Awara screens: the welcome route, the live Jaipur itinerary with a crowd nudge, and the adjust sheet offering a quieter alternative',
    previewPos: 'object-center',
  },
  {
    no: '02',
    title: 'Nocturne',
    tagline: 'Designing checkout trust at the point of highest hesitation.',
    year: '2024',
    role: 'CONCEPT • PRODUCT STRATEGY + INTERACTION',
    context:
      'As a Product Strategist, I tackled cart abandonment in late-night food delivery, a critical drop-off point caused by last-minute fees and payment anxiety.',
    problem:
      'Generic red error messages and sudden price jumps destroy trust, leading to high abandonment at the final step of the funnel.',
    approach: [
      'Decision 1: Blame-Absorbing UI. I considered standard error validation ("Payment Failed"), but rejected it because late-night users are already stressed. I chose a "blame-absorbing" UI: the app takes the fault ("Our link to the bank timed out") and immediately guides recovery, preserving trust.',
      'Decision 2: Proactive Fee Transparency. Instead of hiding late-night delivery fees until the end, I designed the flow to actively highlight when a fee is waived or capped, turning a negative surprise into a moment of delight.'
    ],
    outcome: [
      'Itemised transparency with proactive fee waivers',
      '"Blame-absorbing" failure states that guide recovery',
      'Strategic trust markers at peak hesitation moments',
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/nocturne-prototype.html',
    preview: './assets/mockup_nocturne.png',
    previewAlt: 'Three Nocturne screens: the late-night store, the misprint receipt after a failed payment, and the payment step',
    previewPos: 'object-center',
  },
  {
    no: '03',
    title: 'Munim',
    tagline: 'Making agentic finance understandable without hiding control.',
    year: '2024',
    role: 'ACADEMIC • PRODUCT SYSTEMS + PROTOTYPING',
    context:
      'As Lead System Designer, I addressed how small businesses safely delegate digital payments without handing over full banking access.',
    problem:
      'Current delegation relies on insecure workarounds like sharing OTPs or physical cards, forcing users to choose between convenience and security.',
    approach: [
      'Decision 1: Supervised Delegation over Hard Limits. I considered strict spend limits, but rejected them because business needs are too fluid. I chose a "supervised delegation" model inspired by a traditional ledger (bahi-khata), allowing staff to spend freely while triggering a live countdown hold mechanism for high-risk transactions.',
      'Decision 2: Transparent Ledger Loops. I rejected standard transaction feeds in favor of a dual-view ledger. It clearly separates "cleared" from "pending supervision", ensuring real-time auditability without visual clutter.'
    ],
    outcome: [
      'Trusted merchant price jumps are automatically held',
      'Mid-hold cancellation prevents unauthorized clearing',
      'Transparent ledger loops for real-time auditability',
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/munim-prototype.html',
    preview: './assets/mockup_munim.png',
    previewAlt: 'Three Munim screens: a BigBasket price jump held for approval, the khata home with spend against the NPCI ceiling, and a payment counting down in the hold window',
    previewPos: 'object-center',
  },
  {
    no: '04',
    title: 'Tuck',
    tagline: 'Why the right bedtime app doesn\'t feel like a wall.',
    year: '2026',
    role: 'PERSONAL • PRODUCT STRATEGY + MOBILE ENGINEERING',
    context:
      'As the Sole Designer & Engineer, I confronted adult doomscrolling. Existing tools—screen-time blockers and app timers—are widely ignored because they rely on restriction.',
    problem:
      'I built two versions of a bedtime app to test a core idea: interrupting scrolling. Both felt like walls. An app cannot fix a problem it makes the user feel guilty for having.',
    approach: [
      'Decision 1: The Caretaker Reframe. I considered building smarter locking mechanics, but rejected them because they bred resentment. I shifted the narrative: instead of the app saying "stop," a mascot says, "I\'m tired. Will you help me sleep?" The user becomes the caretaker, removing the punitive emotional block.',
      'Decision 2: Ceremony-First Overlay. Rather than a sudden lock screen, I designed an overlay that arrives slowly. The screen warms, dims, and slows over time, creating a transition ceremony rather than a harsh interruption.',
      'Decision 3: Monetizing the Morning Insight. I realized the moment of gratitude isn\'t at night—it\'s the next morning. I designed the core value loop around celebrating the morning insight ("You put me to bed at 10:47. Good call."), shifting the monetization value to positive reinforcement.'
    ],
    outcome: [
      'Emotional framing flip: caretaker role vs. punitive block',
      'Ceremony-first overlay design: dim, warm, slow',
      'Monetise the morning insight, not the restriction',
    ],
    stack: ['React Native', 'Kotlin', 'Jetpack Compose', 'Product Strategy'],
    protoUrl: '',
    preview: './assets/mockup_tuck.png',
    previewAlt: 'Three Tuck screens: the bedtime dashboard with Momo, Momo asleep at bedtime, and the morning report',
    previewPos: 'object-center',
  },
  {
    no: '05',
    title: 'The Whole Fruit',
    tagline: 'Brand strategy and packaging system built on restraint.',
    year: '2024',
    role: 'Strategist & Brand Designer',
    context:
      'Wellness and consumer goods rely on loud claims and generic "premium" tropes that erode consumer trust.',
    problem:
      'How can a product communicate distinct value at a glance, then continue delivering on that promise through every brand decision without relying on empty marketing claims?',
    approach: [
      'My M.Des dissertation project. The brief: build a wellness brand confident enough to look expensive without saying "premium" anywhere on the pack. I engineered a type-led system (bespoke mark, disciplined palette, packaging architecture) documented as a strategic positioning framework to demonstrate restraint as a design decision.'
    ],
    outcome: [
      'Comprehensive brand architecture & packaging system',
      'Documented strategic positioning framework for restraint',
      'M.Des dissertation: brand strategy and packaging',
    ],
    stack: ['Figma', 'Illustrator', 'Packaging'],
    protoUrl: '',
    preview: './assets/project_wholefruit.png',
    previewAlt: 'The Whole Fruit packaging architecture and brand identity system',
    previewPos: 'object-center',
    link: 'https://www.behance.net/vishwashmehta',
    linkLabel: 'See Brand System',
  },
  {
    no: '06',
    title: 'Gamut',
    tagline: 'A color-and-type systems engine encoding design judgment into tokens.',
    year: '2025',
    role: 'Founder & Systems Designer',
    context:
      'Product designers and frontend engineers frequently struggle with color accessibility and token architecture, relying on manual calculations.',
    problem:
      'How might design tooling help teams reuse systematic judgment—not just raw hex codes—across growing design systems and themes?',
    approach: [
      'A color-and-type systems engine built from my resource, The Brand Color Bible. Encoded 60-30-10 color rules, ten laws of color, and archetype-driven harmonies directly into the engine so every palette is contrast-checked (WCAG 2.1) in both light and dark before export.'
    ],
    outcome: [
      'Automated dual-mode light/dark contrast verification',
      'Production token export for Tailwind, CSS & JSON',
      'Interactive color and typography engine',
    ],
    stack: ['React', 'Design Tokens', 'Tailwind', 'Color Science'],
    protoUrl: '',
    preview: './assets/project_gamut.png',
    previewAlt: 'Gamut color-and-type design token engine interface',
    previewPos: 'object-top',
    link: 'https://vyshwas.github.io/gamut/',
    linkLabel: 'Launch Token Engine',
  },
]
