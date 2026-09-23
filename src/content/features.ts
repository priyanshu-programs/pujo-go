/**
 * The feature bento. Mirrors the source layout: three rows of two tiles, where
 * tiles split their row by flex-grow ratio (row 2 is 1:2, the rest 1:1).
 * `visual` selects which mockup component renders inside the tile.
 */

export type FeatureVisual =
  | "photoStack"
  | "community"
  | "leaderboard"
  | "phoneTrio"
  | "cardPair"
  | "notifications";

export type Feature = {
  id: string;
  title: string;
  body: string;
  visual: FeatureVisual;
  /** flex-grow within the row. */
  grow: 1 | 2;
  /**
   * Where the tile's fade mask starts, in percent. The phone fan is far taller
   * than its band and needs to start fading sooner than the other visuals do;
   * everything else takes the default.
   */
  maskStop?: number;
};

export const featuresIntro = {
  title: ["Your Puja Adventure", "Starts Here!"],
  body: "Whether you’re chasing the biggest pandals, finding hidden Pujo gems, or simply soaking in the spirit of the city, PujoGo helps you discover, plan, and celebrate Durga Puja—so you can spend less time figuring things out and more time making memories.",
};

const locations: Feature = {
  id: "locations",
  title: "Remember your locations",
  body: "Save your favorite meditation spots, whether it's your cozy reading nook, a quiet park, or a peaceful beach.",
  visual: "photoStack",
  grow: 1,
};

const community: Feature = {
  id: "community",
  title: "Find Your Pujo People",
  body: "Meet fellow pandal hoppers, share your discoveries, and celebrate Kolkata’s Pujo together.",
  visual: "community",
  grow: 1,
};

const leaderboards: Feature = {
  id: "leaderboards",
  title: "Climb in leaderboards",
  body: "Compete with thousands of Pandal hoppers. Claim rare achievements and bring ultimate glory to your club!",
  visual: "leaderboard",
  grow: 1,
};

const daily: Feature = {
  id: "daily",
  title: "Daily meditations tailored for you",
  body: "Choose from structured programs designed for better sleep, stress relief, or focus. Each program evolves with your progress, keeping you engaged and motivated.",
  visual: "phoneTrio",
  grow: 2,
  maskStop: 57,
};

/** Two rows of two, plus a final full-width row. */
export const featureRows: Feature[][] = [
  [locations, community],
  [leaderboards, daily],
];

/**
 * Leaderboard rows inside the "Climb in leaderboards" tile: Pujo committees
 * ranked by "Glory" points. `emoji` + `ring` are placeholder badge art —
 * see FeatureVisuals.tsx for why these stand in for the real icon set.
 */
export const leaderboard = [
  { rank: 1, name: "MISSION 100", glory: 23442, emoji: "🐙", ring: "#7dd3d8" },
  { rank: 2, name: "Team SEB'S", glory: 21376, emoji: "🦊", ring: "#f5a623" },
  { rank: 3, name: "Pujopaglu", glory: 11340, emoji: "🌍", ring: "#4a90d9" },
  { rank: 4, name: "Pujor Paglamo", glory: 6697, emoji: "🦄", ring: "#e17fd8" },
  { rank: 5, name: "Bablu Superstar", glory: 4370, emoji: "😎", ring: "#f2c14e" },
  { rank: 6, name: "Naskar's", glory: 2304, emoji: "🦊", ring: "#e8734a" },
  { rank: 7, name: "pujohunterzz", glory: 2037, emoji: "🤖", ring: "#8a8f98" },
];

/** Toasts inside the "A nudge when you need it most." tile. */
export const notifications = [
  {
    title: "Yoga class nere you!",
    time: "12:41 AM",
    body: "Cafe Yoga has a class near you.",
    opacity: 0.6,
  },
  {
    title: "Perfect time for relaxation",
    time: "10:41 AM",
    body: "Take 5 minutes for yourself",
    opacity: 0.8,
  },
  {
    title: "Congratulate yourself on great day",
    time: "20:41 AM",
    body: "You've had the most meditations today",
    opacity: 1,
  },
];
