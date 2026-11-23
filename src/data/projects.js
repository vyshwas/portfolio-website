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
    // The 33-second film (narrated, subtitles burned in). Plays only on request: no autoplay, nothing preloaded.
    film: './assets/awara-film.mp4',
    filmPoster: './assets/awara-film-poster.jpg',
    filmLabel: 'The 33-second film',
    filmAlt:
      "A transit-map film: a three-day Jaipur itinerary drawn as coloured routes. When Johri Bazaar peaks in crowds at 17:30 a live healing card offers one swap to Tapri Central, and the route bends instead of recalculating.",
    filmTranscript: [
      "Travel itineraries break the moment you land. Plans change, and schedules shatter.",
      "How do you build a companion that adapts, without the anxiety of recalculation?",
      "Awara heals the day instead. When crowds peak or it rains, it silently absorbs delays, suggesting a single alternative.",
      "Calm daylight colors guide the eye: sand ground, forest routes, sun for the next step, clay for live changes.",
      "Tested across 3 days in Jaipur. Plans that bend with the day.",
    ],
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
    // The 34-second film (narrated, subtitles burned in). Plays only on request: no autoplay, nothing preloaded.
    film: './assets/nocturne-film.mp4',
    filmPoster: './assets/nocturne-film-poster.jpg',
    filmLabel: 'The 34-second film',
    filmAlt:
      "A Swiss-grid film in midnight colours: late-night checkout fees shown up front with waived fees highlighted, then a failed payment that reads \"Our link to the bank timed out\" with the cart held safe for 8 minutes and a retry button.",
    filmTranscript: [
      "At 1:40 in the morning, checkout is where food delivery carts die.",
      "Sudden surcharges turn midnight hesitation into cart abandonment.",
      "Nocturne leads with fee transparency: waived fees shown upfront, not hidden at the end.",
      "When bank rails drop, generic red alarms are rejected.",
      "Instead, a blame-absorbing interface takes the fault: our link timed out, your cart is held.",
      "Calm recovery replaces panic, keeping the order alive.",
      "Trust is won at the point of highest hesitation.",
    ],
  },
  {
    no: '03',
    title: 'Munim',
    tagline: 'Designing the interface for an AI that spends your money over UPI.',
    year: '2026',
    role: 'SOLO CONCEPT • RESEARCH + PRODUCT SYSTEMS + PROTOTYPING',
    context:
      'As the sole designer on this speculative concept (July 2026), I responded to NPCI\'s proposed Unified Agent Protocol: a standard that would let verified AI agents initiate UPI payments within user-defined limits, built on UPI Circle\'s delegated-payments framework (Business Standard, Jul 8 2026). Not affiliated with NPCI. I framed the problem around the munim, the merchant house\'s bookkeeper: he is not handed full authority on day one, he earns it account by account, and every rupee he moves is written in the bahi-khata where the owner can read it. All statistics are from public sources (Business Standard and Outlook Business on the NPCI protocol, NPCI\'s UPI Circle rules, PYMNTS 2026).',
    problem:
      'A UPI push payment has no chargeback rail. On a card network an AI agent\'s mistake becomes a dispute; on UPI it is gone money. And 95 percent of consumers report at least one concern about AI-driven purchasing (PYMNTS, 2026). How does a person grant, supervise, and take back an AI agent\'s authority to spend, when every payment is final?',
    approach: [
      'Decision 1: Per-merchant earned autonomy over day-one full delegation. Every merchant starts supervised: Munim asks, and you approve with your UPI PIN. After three approved payments to the same merchant, Munim proposes upgrading that one merchant to trusted, auto-pay under a cap you set. Blanket autonomy is a hard sell when 95 percent of consumers have at least one concern about AI-driven purchasing, and blanket per-payment approval recreates the notification fatigue that makes delegation pointless. UPI Circle already teaches this split (₹5,000 per payment, ₹15,000 monthly ceiling), so the design extends a mental model Indian users already have, and the prototype keeps NPCI\'s real caps.',
      'Decision 2: A visible 10-minute hold over instant auto-payment. Auto-approved payments sit in a countdown before they execute, with a cancel button. Because UPI payments cannot be reversed, the hold turns the "wait, did it just spend?" anxiety into an undo. The cost is ten minutes of latency on payments that are by definition routine: bills and reorders are never urgent to the minute. I chose latency over irreversibility.',
      'Decision 3: Narrated actions over a silent audit trail. Every ask, hold, and ledger entry leads with a one-line reason in the agent\'s own voice, set in italic serif so its speech has a typographic identity: "This came from a link, not a merchant I know. I did not pay." An unexplained debit from software you authorized is indistinguishable from fraud, and fraud-shaped moments are where delegation dies. Explanations also make refusals legible, which is how the user learns what the agent\'s judgment looks like.',
      'The failure states are the product. The prototype designs the bad days, not just the happy path: a trusted merchant\'s price jumping 33 percent (held, because anomaly beats trust), a payment link arriving over WhatsApp (refused, with the reason in the ledger), a cancel inside the hold window, a cap breach downgrading to an ask, and a one-tap pause plus full revoke. The revoke screen is the thesis in one line: a munim leaves, the ledger remains.',
    ],
    outcome: [
      'A clickable prototype of the whole delegation loop: mandate, asks, holds, anomaly, trust ladder, pause and revoke',
      'Every rupee explained, in the agent\'s own words',
      'Maps onto UPI Circle\'s shipped rails, so it is buildable today',
      'A bahi-khata visual system: ledger paper, rule lines, stamp chips, and IBM Plex Mono for every number',
    ],
    stack: ['Research', 'Product thinking', 'Interface design', 'Working prototype'],
    protoUrl: './assets/munim-prototype.html',
    preview: './assets/mockup_munim.png',
    previewAlt: 'Three Munim screens: a BigBasket price jump held for approval, the khata home with spend against the NPCI ceiling, and a payment counting down in the hold window',
    previewPos: 'object-center',
    // The 33-second film (narrated, subtitles burned in). Plays only on request: no autoplay, nothing preloaded.
    film: './assets/munim-film.mp4',
    filmPoster: './assets/munim-film-poster.jpg',
    filmLabel: 'The 33-second film',
    filmAlt:
      'A short film on a paper desk: a coin slams onto a UPI card that reads FINAL with UNDO crossed out, then a small pixel bookkeeper earns trust at one merchant, waits out a ten-minute hold, refuses a price jump and a WhatsApp link, and is revoked, leaving the ledger behind.',
    filmTranscript: [
      'A UPI payment has no undo.',
      'So how do you let an AI agent spend your money?',
      'Every merchant starts supervised. Three approvals earn its trust.',
      'Even then, each payment waits ten minutes. Cancel any time.',
      'A price jump gets held. A WhatsApp link gets refused, with a reason.',
      'And one tap revokes it all.',
      'A munim leaves. The ledger remains.',
    ],
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
    // The 39-second film (narrated, subtitles burned in). Plays only on request: no autoplay, nothing preloaded.
    film: './assets/tuck-film.mp4',
    filmPoster: './assets/tuck-film-poster.jpg',
    filmLabel: 'The 39-second film',
    filmAlt:
      "A crayon picture-book film on toothy paper: a red STOP screen-time wall is crossed out, then a small sleepy mascot, Momo, yawns and asks \"I'm tired. Will you help me sleep?\", a watercolour night with stars tucks him under a patchwork quilt, and a sunny morning card reads \"You put me to bed at 10:47. Good call.\"",
    filmTranscript: [
      "Screen-time blockers fail because they rely on restriction. You can't fix a habit by making the user feel guilty.",
      "So Tuck rejects the wall. Instead of an app saying stop, a mascot asks for help: I'm tired. Will you help me sleep?",
      "The user becomes the caretaker, removing the emotional block.",
      "A ceremony-first overlay dims, warms, and slows over time, easing the transition into sleep.",
      "The moment of gratitude isn't at night, it's the morning after.",
      "Celebrating the good decision, not penalizing the impulse.",
      "Why the right bedtime app doesn't feel like a wall.",
    ],
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
