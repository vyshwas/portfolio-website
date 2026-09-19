import { projects } from "./projects.js";
// Editorial summaries of existing project material; no inferred impact metrics.
const notes = {
  Awara: {
    slug: "awara",
    outcome: [
      "An itinerary timeline with activity and travel context",
      "An adjustment flow with local alternatives",
      "A consistent visual system across the prototype",
    ],
    kind: "Client project",
    discipline: "Research · Product design",
    headline: "Good trips don’t follow a script.",
    summary:
      "An adaptive travel companion that helps people rework their day when plans change.",
    contribution:
      "Research, itinerary systems, interaction design and prototyping",
    evidence:
      "Explore the day plan, open an activity, and try the adjustment flow.",
    boundary:
      "Interactive prototype. These scenarios demonstrate the intended experience; live travel services and automatic replanning are not connected.",
    steps: [
      [
        "The friction",
        "A schedule can look perfect before a trip and become useless after one delay. The design challenge was to keep the day understandable as it changes.",
      ],
      [
        "The decision",
        "Make the itinerary a living timeline. Put the next activity, travel time and alternatives together, so a change can happen in context.",
      ],
      [
        "The interaction",
        "An adjustment sheet gives the traveler local alternatives while keeping the rest of the day in view. The person remains in control of the plan.",
      ],
    ],
  },
  Munim: {
    slug: "munim",
    outcome: [
      "A visible ledger and supervised payment request flow",
      "Demonstrated approval, hold and cancellation states",
      "Explicit delegation limits in the interface",
    ],
    kind: "Academic project",
    discipline: "Product systems · Fintech",
    headline: "Delegate the payment. Keep the control.",
    summary:
      "A supervised payment system with spending limits, visible requests and a way to stop a risky transaction.",
    contribution:
      "Product systems, delegation model, interaction design and prototyping",
    evidence:
      "Request a payment from the ledger, inspect the approval flow, and return to the transaction history.",
    boundary:
      "Academic prototype with simulated payment states. No banking service is connected and no money moves.",
    steps: [
      [
        "The friction",
        "Giving someone permission to pay should not require handing over unrestricted access. Shared credentials also make responsibility difficult to trace.",
      ],
      [
        "The decision",
        "Use explicit mandates and a familiar ledger to separate permission from payment. Show what is allowed, what needs approval and what has happened.",
      ],
      [
        "The interaction",
        "Payment requests lead to a supervised approval sheet. A hold and cancellation path make unusual transactions reviewable before they clear in the simulation.",
      ],
    ],
  },
  Nocturne: {
    slug: "nocturne",
    outcome: [
      "Itemised fees and contextual payment guidance",
      "Simulated payment success and failure states",
      "Recovery messages that preserve order context",
    ],
    kind: "Independent concept",
    discipline: "Interaction design · Commerce",
    headline: "A failed payment shouldn’t feel like a dead end.",
    summary:
      "A late-night checkout concept that makes fees clear and helps people recover when payment goes wrong.",
    contribution:
      "Product strategy, checkout flows, error states and prototyping",
    evidence:
      "Switch the simulated payment outcome and try the checkout and recovery states.",
    boundary:
      "Independent concept with simulated checkout outcomes. No live orders, payment processing or measured conversion results.",
    steps: [
      [
        "The friction",
        "An unexpected fee or an unexplained payment failure can undo the confidence built through the rest of checkout.",
      ],
      [
        "The decision",
        "Show an itemised total and explain fees before the commitment. Make recovery language specific, calm and free of blame.",
      ],
      [
        "The interaction",
        "The prototype keeps the order visible through payment states and offers a clear next action when a payment fails.",
      ],
    ],
  },
  Gamut: {
    slug: "gamut",
    outcome: [
      "Light and dark contrast checking workflows",
      "CSS, Tailwind and JSON token export",
      "A connected color and typography interface",
    ],
    kind: "Self-directed tool",
    discipline: "Design systems · Engineering",
    headline: "From a good palette to a usable system.",
    summary:
      "A color and typography tool that turns design rules into contrast checks and exportable tokens.",
    contribution:
      "Color rules, system architecture, interface design and React development",
    evidence:
      "Open the engine to explore palette generation, contrast fixes and token exports.",
    boundary:
      "An independently built design tool. The case study documents its capabilities, not adoption or business-impact metrics.",
    steps: [
      [
        "The friction",
        "A collection of colors is not yet a design system. A team still has to assign roles, check contrast and carry the decisions into code.",
      ],
      [
        "The decision",
        "Encode rules from The Brand Color Bible into the workflow, pairing color and typography choices with light and dark contrast checks.",
      ],
      [
        "The implementation",
        "A React interface connects palette generation, a real-time fixer and export formats for CSS, Tailwind and JSON.",
      ],
    ],
  },
  "The Whole Fruit": {
    slug: "the-whole-fruit",
    outcome: [
      "Brand architecture and packaging design",
      "A documented positioning framework",
      "An M.Des dissertation on brand strategy and packaging",
    ],
    kind: "M.Des dissertation",
    discipline: "Brand strategy · Packaging",
    headline: "Let the product do the talking.",
    summary:
      "A wellness identity and packaging system built around a clear position and deliberate restraint.",
    contribution:
      "Positioning, brand architecture, visual identity and packaging",
    evidence:
      "Inspect the identity and packaging system, then explore the design portfolio on Behance.",
    boundary:
      "M.Des dissertation project. Brand and packaging work is presented without sales or market-performance claims.",
    steps: [
      [
        "The friction",
        "Wellness packaging often competes through claims. The challenge was to give the product a distinct, coherent position without adding more noise.",
      ],
      [
        "The decision",
        "Build the identity around a bespoke mark, disciplined typography and a restrained palette. Let the information hierarchy carry the value.",
      ],
      [
        "The system",
        "Translate the positioning into consistent packaging architecture, so each brand decision belongs to the same family.",
      ],
    ],
  },
};
export const portfolio = [
  "Awara",
  "Munim",
  "Nocturne",
  "Gamut",
  "The Whole Fruit",
].map((title) => ({
  ...projects.find((p) => p.title === title),
  ...notes[title],
}));
