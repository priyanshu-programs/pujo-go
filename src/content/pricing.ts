/**
 * Pricing page — three plans, verbatim from the source (including the source's
 * own quirk that Starter and Growth are both priced $9/month).
 */

export type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

export const pricingIntro = {
  title: "Pricing",
  body: "Got any questions? Reach out to us and we'll reply in 25 hours.",
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter plan",
    price: "$9 /month",
    features: [
      "5 users",
      "Basic AI analytics",
      "10 GB of storage",
      "Access to all core features",
    ],
    cta: { label: "Get started", href: "/#cta" },
  },
  {
    id: "growth",
    name: "Growth plan",
    price: "$9 /month",
    features: [
      "25 users",
      "Advanced AI analytics",
      "10 GB of storage",
      "Enhanced security",
    ],
    cta: { label: "Get started", href: "/#cta" },
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise plan",
    price: "Contact sales",
    features: [
      "Unlimited users",
      "Full AI analytics",
      "Advanced security",
      "24/7 priority support",
    ],
    cta: { label: "Contact us", href: "/contact" },
  },
];
