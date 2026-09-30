/**
 * "How it works" — three steps. The active index drives both the filled step
 * card and which phone sits on top of the stack.
 *
 * `screen` selects the mockup rendered inside the phone frame.
 *
 * NOTE: fan geometry (rotation / scale / offset / z-index) lives in
 * `PHONE_FAN` inside `HowItWorks.tsx`, keyed by *rank* (0 = front, 1 = middle,
 * 2 = back) rather than by step, so any step can become the front phone
 * without breaking the fan direction.
 */

export type StepScreen = "mood" | "breathe" | "progress";

export type Step = {
  id: string;
  title: string;
  body: string;
  screen: StepScreen;
};

export const howItWorksIntro = {
  title: "How it works",
  body: "Turn your pandal hopping into a Pujo adventure. Plan your route, compete with your team, and earn rewards along the way.",
};

export const steps: Step[] = [
  {
    id: "choose",
    title: "Plan your Pujo",
    body: "Discover nearby pandals, pick the ones you want to visit, and create a route for your Pujo outing.",
    screen: "mood",
  },
  {
    id: "listen",
    title: "Capture pandals",
    body: "Visit pandals, check in, and team up to compete for captures during Durga Puja.",
    screen: "breathe",
  },
  {
    id: "progress",
    title: "Earn rewards",
    body: "Put your pandal visits to work. Compete for gift cards, coupons, and vouchers, and check the app for available rewards and redemption details.",
    screen: "progress",
  },
];

/** Mood rows inside the "Choose How You Feel" screen. */
export const moods = [
  { emoji: "😌", label: "Calm", hint: "Maintain a peaceful state" },
  { emoji: "😣", label: "Stressed", hint: "Reduce tension and anxiety" },
  { emoji: "🫠", label: "Restless", hint: "Slow down and refocus" },
  { emoji: "😴", label: "Sleepy", hint: "Wind down for better rest" },
  { emoji: "🫤", label: "Unmotivated", hint: "Wind down for better rest" },
];
