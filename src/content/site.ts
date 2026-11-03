/**
 * Global site chrome: nav, footer columns, socials, CTA destinations.
 *
 * Note on anchors: the source site emits *relative* hrefs (`./#features`), which
 * resolve to dead anchors from any sub-route. We use absolute `/#features` so
 * section nav works from every page.
 */

export type NavLink = { label: string; href: string };

export const storeLinks = {
  google: "https://play.google.com/store/apps/details?id=app.asur.slayers",
};

export const siteConfig = {
  name: "PujoGo",
  tagline: "West Bengal's Largest Durga Puja Competition Is Here.",
  description:
    "PujoGo helps you discover, plan, and celebrate Durga Puja — find pandals, compete with your club, and climb the leaderboard.",
  trustBadge: "Trusted by 100 000+ users",
};

export const navLinks: NavLink[] = [
  { label: "How It Works", href: "/#howitworks" },
  { label: "Features", href: "/#features" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
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
  secondaryCta: { label: "Watch Video", href: "/#cta-phones" },
};

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/#hero" },
      { label: "Features", href: "/#features" },
      { label: "Testimonials", href: "/#testimonials" },
      { label: "How it works", href: "/#howitworks" },
      { label: "Team", href: "/team" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/pujogo.in/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/share/1CbDPY8rbS/", icon: "facebook" },
  { label: "X (Twitter)", href: "https://x.com/pujogoers", icon: "twitter" },
] as const;

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Delete Account", href: "/delete-account" },
];
