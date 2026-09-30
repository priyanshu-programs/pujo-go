export type FaqItem = { id: string; question: string; answer: string };

export const faqIntro = {
  title: "Frequently asked questions",
  body: "Have a question about your Pujo adventure? Get in touch with our team.",
};

export const faq: FaqItem[] = [
  {
    id: "free",
    question: "Is PujoGo free to get started?",
    answer: "Yes! Download PujoGo for free on Android and start exploring Durga Puja pandals.",
  },
  {
    id: "discover",
    question: "How do I find pandals and plan a route?",
    answer: "Use the map to discover nearby pandals, choose the ones you want to visit, and create a route for your outing.",
  },
  {
    id: "teams",
    question: "Can I play with my friends?",
    answer: "Yes! Form a team with your friends, visit pandals together, and compete to capture pandals during Durga Puja.",
  },
  {
    id: "check-ins",
    question: "What is the difference between a check-in and a capture?",
    answer: "A check-in records a pandal visit. Capturing pandals is part of the team competition. Check the app for the current capture rules and standings.",
  },
  {
    id: "rewards",
    question: "What rewards can I earn?",
    answer: "Rewards can include gift cards, coupons, and vouchers. Some offers are redeemable during Durga Puja, while competition rewards follow after it ends. Check each reward in the app for eligibility and redemption details.",
  },
  {
    id: "platforms",
    question: "Is PujoGo available on iPhone?",
    answer: "PujoGo is currently available on Android. An iPhone version is coming soon—follow our social channels for updates.",
  },
  {
    id: "support",
    question: "How can I get help?",
    answer: "Email support@pujogo.in or use our contact page for help with the app, check-ins, teams, or rewards.",
  },
];
