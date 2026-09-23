/**
 * FAQ — seven items.
 *
 * ⚠ The QUESTIONS are verbatim from the source. The ANSWERS are not: Framer
 * lazy-mounts answer bodies on click, so they are absent from the published
 * HTML, the page source and the export alike. Every answer below is written in
 * the brand voice as a stand-in and is marked PLACEHOLDER — replace with the
 * real copy when available. Swapping them is a one-file change.
 */

export type FaqItem = { id: string; question: string; answer: string };

export const faqIntro = {
  title: "Frequently asked questions",
  body: "If you can't find what you are looking for don't hesitate to contact us.",
};

export const faq: FaqItem[] = [
  {
    id: "free",
    question: "Is PujoGo free to use?", // verbatim
    // PLACEHOLDER
    answer:
      "Yes. PujoGo's core library of guided meditations, breathing exercises and soundscapes is free forever. A subscription unlocks the full program library, offline downloads and detailed progress insights.",
  },
  {
    id: "experience",
    question: "Do I need experience with meditation to use PujoGo?", // verbatim
    // PLACEHOLDER
    answer:
      "Not at all. PujoGo is built for complete beginners. Start with a three-minute session, follow the voice, and let the app suggest where to go next—there is nothing to learn up front.",
  },
  {
    id: "duration",
    question: "How long should I meditate?", // verbatim
    // PLACEHOLDER
    answer:
      "Five minutes a day is plenty to begin with. Consistency matters far more than length, so a short daily session will do more for you than a long one every now and then.",
  },
  {
    id: "support",
    question: "What kind of support do you offer?", // verbatim
    // PLACEHOLDER
    answer:
      "You can reach us any time through the contact form and we reply within 24 hours. Subscribers also get priority support directly inside the app.",
  },
  {
    id: "cancel",
    question: "How do I cancel my subscription?", // verbatim
    // PLACEHOLDER
    answer:
      "Open Settings → Subscription and tap Cancel, or manage it from your App Store or Google Play account. You keep full access until the end of the billing period.",
  },
  {
    id: "offline",
    question: "Can I use PujoGo offline?", // verbatim
    // PLACEHOLDER
    answer:
      "Yes. Download any session or program ahead of time and it stays available without a connection—useful for flights, commutes and quiet places with poor signal.",
  },
  {
    id: "template",
    question: "How do I get this Framer Template?", // verbatim
    // PLACEHOLDER
    answer:
      "This page is a study rebuild of the original Framer template, created for learning purposes. The original template is available from its author on the Framer marketplace.",
  },
];
