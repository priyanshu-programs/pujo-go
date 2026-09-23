/**
 * Global site chrome: nav, footer columns, socials, CTA destinations.
 *
 * Note on anchors: the source site emits *relative* hrefs (`./#features`), which
 * resolve to dead anchors from any sub-route. We use absolute `/#features` so
 * section nav works from every page.
 */

export type NavLink = { label: string; href: string };

export const storeLinks = {
  apple: "https://www.apple.com/app-store/",
  google: "https://play.google.com/store/search?q=pujo+go&c=apps",
};

export const siteConfig = {
  name: "PujoGo",
  tagline: "West Bengal's Largest Durga Puja Competition Is Here.",
  description:
    "PujoGo helps you discover, plan, and celebrate Durga Puja — find pandals, compete with your club, and climb the leaderboard.",
  trustBadge: "Trusted by 100 000+ users",
};

export const navLinks: NavLink[] = [
  { label: "Lorem", href: "/#features" },
  { label: "Ipsum", href: "/#testimonials" },
  { label: "Dolor", href: "/#howitworks" },
  { label: "Amet", href: "/#faq" },
];

export const navCta: NavLink = { label: "Play Store", href: storeLinks.google };

/**
 * Hero copy. The Figma frame ships lorem ipsum placeholders; they live here so
 * real copy can be dropped in without touching the layout.
 */
export const heroContent = {
  /* The two headline lines, rendered one above the other in the hero. */
  headline: {
    top: "EI PUJOTEY,",
    bottom: "PUJOGO?",
  },
  introLede:
    "West Bengal's Largest Durga Puja Competition Is Here & Kolkata Is Ready!",
  socialProof: {
    line1: "Total Check-Ins:",
    line2: "5,300+ users across Kolkata",
  },
  asideLede: "Compete For Your Club, Capture Pandals, & Climb The Leaderboard.",
  avatarCount: "+5.2K",
  primaryCta: { label: "Play Store", href: storeLinks.google },
  secondaryCta: { label: "Watch Video", href: "/#howitworks" },
};

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/#hero" },
      { label: "Features", href: "/#features" },
      { label: "Testimonials", href: "/#testimonials" },
      { label: "How it works", href: "/#howitworks" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Blog",
    links: [{ label: "Blog", href: "/blog" }],
  },
];

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Threads", href: "https://threads.net", icon: "threads" },
] as const;

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Terms & Conditions", href: "/terms" },
];
