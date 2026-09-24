export const projects = [
  {
    no: '01',
    title: 'Nocturne',
    tagline: 'Designing checkout trust at the point of highest hesitation.',
    year: '2024',
    role: 'CONCEPT · PRODUCT STRATEGY + INTERACTION',
    context:
      'Late-night checkout flows for food delivery often suffer from high cart abandonment due to last-minute fees and payment anxiety.',
    problem:
      'When a payment fails or extra fees are added at the very end, generic red error messages and sudden price jumps destroy trust. Users feel cheated, resulting in high abandonment at the highest-friction step of the funnel.',
    approach:
      'I designed a checkout experience optimized to preserve trust. The UI actively absorbs blame for failures with empathetic error states, proactively explains late-night surges ("Night owl fee waived"), and highlights UPI-first payment methods with clear, contextual trust cues right above the CTA.',
    outcome: [
      'Itemised transparency with proactive fee waivers',
      '"Blame-absorbing" failure states that guide recovery',
      'Strategic trust markers at peak hesitation moments',
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/nocturne-prototype.html',
    preview: './assets/project_nocturne_checkout.png',
    previewAlt:
      'Nocturne blame-absorbing checkout error receipt with saved order and state recovery',
    previewPos: 'object-[center_42%]',
  },
  {
    no: '02',
    title: 'Munim',
    tagline: 'Making agentic finance understandable without hiding control.',
    year: '2024',
    role: 'ACADEMIC · PRODUCT SYSTEMS + PROTOTYPING',
    context:
      'Small businesses and households often need to delegate digital payments to staff or family members without handing over full banking access.',
    problem:
      'Current delegation relies on sharing OTPs, physical cards, or screenshots. These workarounds are highly insecure, unscalable, and lack accountability, forcing users to choose between convenience and security.',
    approach:
      'Munim introduces a "supervised delegation" model inspired by the traditional \'bahi-khata\' (ledger). It features a robust mandate system, supervised payment requests via a secure UPI PIN sheet, and a live countdown hold mechanism for high-risk transactions.',
    outcome: [
      'Trusted merchant price jumps are automatically held',
      'Mid-hold cancellation prevents unauthorized clearing',
      'Transparent ledger loops for real-time auditability',
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/munim-prototype.html',
    preview: './assets/project_munim.png',
    previewAlt:
      'Munim ledger showing spend against a fixed NPCI delegation ceiling',
    previewPos: 'object-top',
  },
  {
    no: '03',
    title: 'Awara',
    tagline: 'Turning research into a living travel companion.',
    year: '2025',
    role: 'CLIENT · RESEARCH + SYSTEMS DESIGN',
    context:
      'Travel planning apps treat itineraries as static documents that are generated once before the trip and rarely updated.',
    problem:
      'Once a traveler arrives, plans inevitably change due to weather, delays, or spontaneity. Most tools fail to adapt, leaving users with a broken schedule and forcing them back to manual searching in maps and browsers.',
    approach:
      'Awara acts as an active travel companion. It continuously adapts the schedule as the day unfolds. If a user spends too long at a museum, the app proactively suggests adjusting the next activity, seamlessly recalculating travel times and options.',
    outcome: [
      'Live, context-aware itinerary that heals itself',
      'Adjust sheet with proactive, localized alternatives',
      'Striking vermilion-and-ink editorial visual system',
    ],
    stack: ['Figma', 'Protopie'],
    protoUrl: './assets/awara-prototype.html',
    preview: './assets/project_awara_itinerary.png',
    previewAlt:
      'Awara living adaptive itinerary timeline showing Day 1 Old City Jaipur schedule and adjust sheets',
    previewPos: 'object-[center_12%]',
  },
  {
    no: '04',
    title: 'The Whole Fruit',
    tagline: 'Brand strategy and packaging system built on restraint.',
    year: '2024',
    role: 'Strategist & Brand Designer',
    context:
      'Wellness and consumer goods rely on loud claims and generic "premium" tropes that erode consumer trust.',
    problem:
      'How can a product communicate distinct value at a glance; then continue delivering on that promise through every brand decision without relying on empty marketing claims?',
    approach:
      'My M.Des dissertation project. The brief: build a wellness brand confident enough to look expensive without saying "premium" anywhere on the pack. I engineered a type-led system (bespoke mark, disciplined palette, packaging architecture) documented as a strategic positioning framework to demonstrate restraint as a design decision.',
    outcome: [
      'Comprehensive brand architecture & packaging system',
      'Documented strategic positioning framework for restraint',
      'M.Des dissertation: brand strategy and packaging',
    ],
    stack: ['Figma', 'Illustrator', 'Packaging'],
    protoUrl: '',
    preview: './assets/project_wholefruit.png',
    previewAlt:
      'The Whole Fruit packaging architecture and brand identity system',
    previewPos: 'object-center',
    link: 'https://www.behance.net/vishwashmehta',
    linkLabel: 'See Brand System ↗',
  },
  {
    no: '06',
    title: 'Tuck',
    tagline: 'Why the right bedtime app doesn\'t feel like a wall.',
    year: '2026',
    role: 'PERSONAL · PRODUCT STRATEGY + MOBILE ENGINEERING',
    context:
      'Doomscrolling at night is a well-documented problem. The tools built to address it — screen-time blockers, app timers, parental controls repurposed for adults — are widely available and widely ignored.',
    problem:
      'I built two versions of a bedtime app to test the same core idea: a screen overlay that interrupts scrolling and invites you to put the phone down. Both felt like walls. Every existing blocker treats the behaviour as a rule violation. The emotional output is resentment, not relief. An app cannot fix a problem it makes the user feel guilty for having.',
    approach:
      'The insight came from reframing who is asking. Instead of the app saying "stop," the mascot says "I\'m tired. Will you help me sleep?" The user becomes the caretaker — not the one being controlled. The overlay should arrive slowly: the screen warms, dims, slows. Not snap in like a lock. The second insight is that the gratitude moment belongs the next morning, not at the point of interruption: "You put me to bed at 10:47. You slept 7 hours. Good call." Charge for the morning insight and the identity it creates. Not the nighttime restriction.',
    outcome: [
      'Emotional framing flip: caretaker role vs. punitive block',
      'Ceremony-first overlay design: dim, warm, slow',
      'Monetise the morning insight, not the restriction',
    ],
    stack: ['React Native', 'Kotlin', 'Jetpack Compose', 'Product Strategy'],
    protoUrl: '',
    preview: './assets/project_tuck.svg',
    previewAlt: 'Tuck — Pip mascot sleeping on a warm dark phone screen',
    previewPos: 'object-center',
  },
  {
    no: '05',
    title: 'Gamut',
    tagline:
      'A color-and-type systems engine encoding design judgment into tokens.',
    year: '2025',
    role: 'Founder & Systems Designer',
    context:
      'Product designers and frontend engineers frequently struggle with color accessibility and token architecture, relying on manual calculations or trial-and-error across themes.',
    problem:
      'How might design tooling help teams reuse systematic judgment; not just raw hex codes; across growing design systems and themes?',
    approach:
      'A color-and-type systems engine built from my resource, The Brand Color Bible. Encoded 60-30-10 color rules, ten laws of color, and archetype-driven harmonies directly into the engine so every palette is contrast-checked (WCAG 2.1) in both light and dark before export. Includes a generator, real-time fixer, and design token exporter.',
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
    linkLabel: 'Launch Token Engine ↗',
  },
]
