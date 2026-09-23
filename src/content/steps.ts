/**
 * "How it works" — three steps. The active index drives both the filled step
 * card and which phone sits on top of the stack.
 *
 * `screen` selects the mockup rendered inside the phone frame.
 */

export type StepScreen = "mood" | "breathe" | "progress";

export type Step = {
  id: string;
  title: string;
  body: string;
  screen: StepScreen;
  /** Resting rotation of this phone in the stack (degrees). */
  rotation: number;
};

export const howItWorksIntro = {
  title: "How it works",
  body: "A few mindful moments can change your day. PujoGo helps you reset, relax, and grow with ease.",
};

export const steps: Step[] = [
  {
    id: "choose",
    title: "Choose How You Feel",
    body: "Start by selecting your current mood—calm, stressed, or in need of focus. PujoGo curates the perfect session for you.",
    screen: "mood",
    rotation: -6,
  },
  {
    id: "listen",
    title: "Listen, Breathe, and Unwind",
    body: "Whether it's a guided meditation, soothing soundscape, or deep breathing session, PujoGo helps you find your balance.",
    screen: "breathe",
    rotation: 9,
  },
  {
    id: "progress",
    title: "Follow Your Progress",
    body: "Build a mindfulness habit with personalized streaks, mood tracking, and insights to help you grow.",
    screen: "progress",
    rotation: 18,
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
