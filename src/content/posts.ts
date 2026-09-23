/**
 * Blog collection — stands in for Framer's CMS.
 *
 * `/blog/[slug]` builds its static params from this array, so adding a post is
 * a one-file change. Body blocks are a small typed union rather than raw HTML,
 * which keeps rendering type-safe and avoids dangerouslySetInnerHTML.
 */

export type BodyBlock =
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  date: string;
  /** Pre-formatted for display; avoids locale drift between server and client. */
  dateLabel: string;
  excerpt: string;
  /** Gradient angle for the cover art — varies the dark-to-red ramp per post. */
  coverAngle: number;
  body: BodyBlock[];
};

export const blogIntro = {
  title: "The PujoGo Journal",
  body: "Discover pandal guides, Pujo tips, and celebration stories to help you make the most of Durga Puja.",
};

export const posts: Post[] = [
  {
    slug: "a-simple-habit-for-a-calmer-mind",
    title: "A Simple Habit for a Calmer Mind",
    date: "2025-03-01",
    dateLabel: "Mar 1, 2025",
    excerpt:
      "Even five minutes of meditation a day can bring clarity, reduce stress, and help you feel more present.",
    coverAngle: 130,
    body: [
      {
        type: "lead",
        text: "Life moves fast, but your mind doesn't have to. Even just five minutes of meditation a day can bring clarity, reduce stress, and help you feel more present. If you've been thinking about starting a meditation practice but feel like you don't have time, this guide is for you.",
      },
      {
        type: "p",
        text: "We often think of meditation as something that requires dedicated time, a quiet room, and long periods of stillness, but the truth is, even five minutes of mindfulness can reset your mind. Meditation isn't about achieving complete silence—it's about creating space between thoughts and becoming more present in the moment.",
      },
      { type: "h3", text: "Why It Works:" },
      {
        type: "ul",
        items: [
          "Instant Stress Relief – Just a few deep breaths can activate your body's relaxation response, lowering cortisol levels and reducing anxiety.",
          "Consistency Over Length – Studies show that shorter, daily meditation sessions are more effective than long, occasional ones because they help rewire the brain over time.",
          "No Special Setup Needed – You don't need a meditation cushion or a perfect environment—you can meditate anywhere: on the train, during a work break, or even before bed.",
        ],
      },
      { type: "h3", text: "Try This 5-Minute Meditation:" },
      {
        type: "ol",
        items: [
          "Find a quiet place (or simply sit comfortably).",
          "Close your eyes & take a deep breath. Inhale for 4 seconds, hold for 4, and exhale for 6.",
          "Focus on your breath. If your mind wanders, gently bring it back.",
          "Scan your body. Notice any tension and allow it to soften.",
          "Let go of any thoughts. Observe them without judgment and return to your breath.",
        ],
      },
      {
        type: "p",
        text: "Even one session can make a difference. Try it now and feel the shift in your state of mind. Ready to make this a habit? PujoGo's guided 5-minute meditations are designed to fit into any schedule—start today.",
      },
    ],
  },
  {
    slug: "how-conscious-breathing-can-reduce-stress",
    title: "How Conscious Breathing Can Reduce Stress",
    date: "2025-02-18",
    dateLabel: "Feb 18, 2025",
    excerpt:
      "Your breath is the fastest way to tell your nervous system that it is safe to slow down.",
    coverAngle: 150,
    body: [
      {
        type: "lead",
        text: "Your breath is the one part of your nervous system you can steer on purpose. Learning to lengthen an exhale is the fastest way to tell your body that it is safe to slow down.",
      },
      {
        type: "p",
        text: "When you feel under pressure, your breathing becomes shallow and quick without you deciding it should. That pattern keeps your body in a state of alert. Deliberately slowing the breath reverses the signal and brings your heart rate down with it.",
      },
      { type: "h3", text: "A pattern to start with" },
      {
        type: "ol",
        items: [
          "Breathe in through your nose for a count of four.",
          "Hold gently for a count of four.",
          "Release slowly through your mouth for a count of six.",
          "Repeat five times, letting each exhale run a little longer.",
        ],
      },
      {
        type: "p",
        text: "The longer exhale is what does the work. Keep the rhythm comfortable—if you are straining to hold a count, shorten it. Practised daily, this becomes something you can reach for in the middle of a difficult moment.",
      },
    ],
  },
  {
    slug: "small-mindful-habits-that-can-make-a-big-difference",
    title: "Small Mindful Habits That Can Make a Big Difference",
    date: "2025-02-12",
    dateLabel: "Feb 12, 2025",
    excerpt:
      "Lasting change rarely comes from grand gestures. It comes from small habits repeated often.",
    coverAngle: 170,
    body: [
      {
        type: "lead",
        text: "Lasting change rarely comes from grand gestures. It comes from small habits, repeated often enough that they stop feeling like effort.",
      },
      {
        type: "p",
        text: "The most reliable way to build a mindfulness practice is to attach it to something you already do. Habits need an anchor, and your existing routine is full of them.",
      },
      { type: "h3", text: "Habits worth trying" },
      {
        type: "ul",
        items: [
          "Take three slow breaths before you pick up your phone in the morning.",
          "Step outside for two minutes at lunch, without anything to read.",
          "Notice one thing you can hear, see and feel before a meeting starts.",
          "Put your hand on your chest for a moment before you go to sleep.",
        ],
      },
      {
        type: "p",
        text: "None of these take more than a minute. Pick one, attach it to an anchor, and let it settle for a week before adding another.",
      },
    ],
  },
  {
    slug: "how-to-use-meditation-for-better-sleep",
    title: "How to Use Meditation for Better Sleep",
    date: "2025-02-06",
    dateLabel: "Feb 6, 2025",
    excerpt:
      "If your mind gets louder the moment your head hits the pillow, you are not alone.",
    coverAngle: 190,
    body: [
      {
        type: "lead",
        text: "If your mind gets louder the moment your head hits the pillow, you are not alone. Sleep resists effort—the harder you chase it, the further it moves.",
      },
      {
        type: "p",
        text: "The aim of an evening practice is not to force sleep but to lower the noise around it. Give your body a consistent signal that the day is finished and sleep tends to follow on its own.",
      },
      { type: "h3", text: "An evening wind-down" },
      {
        type: "ol",
        items: [
          "Dim the lights an hour before bed so your body starts producing melatonin.",
          "Put screens somewhere else—the notification you are waiting for can wait.",
          "Run a body scan from your feet upward, softening each area as you pass it.",
          "If your thoughts start racing, name them silently and return to your breath.",
        ],
      },
      {
        type: "p",
        text: "Falling asleep partway through is not failing the exercise. That is the exercise working.",
      },
    ],
  },
  {
    slug: "how-to-create-a-mindful-morning-routine",
    title: "How to Create a Mindful Morning Routine",
    date: "2025-02-02",
    dateLabel: "Feb 2, 2025",
    excerpt:
      "How you spend the first ten minutes of your day shapes the mood of the rest of it.",
    coverAngle: 210,
    body: [
      {
        type: "lead",
        text: "How you spend the first ten minutes of your day has more influence on the rest of it than almost anything else you do.",
      },
      {
        type: "p",
        text: "Reaching for your phone before you are fully awake hands your attention to everyone else's priorities. A morning routine is simply a way of keeping the first few minutes for yourself.",
      },
      { type: "h3", text: "Ten minutes, three parts" },
      {
        type: "ol",
        items: [
          "Two minutes of stillness—sit up, feel your feet on the floor, breathe.",
          "Five minutes of guided meditation to set your focus for the day.",
          "Three minutes to write down one thing you are looking forward to.",
        ],
      },
      {
        type: "p",
        text: "Keep it short enough that you will still do it on a bad morning. A routine you can maintain at your busiest is worth more than an ideal one you abandon.",
      },
    ],
  },
  {
    slug: "how-to-release-stress-and-find-inner-peace",
    title: "How to Release Stress and Find Inner Peace",
    date: "2025-01-22",
    dateLabel: "Jan 22, 2025",
    excerpt:
      "Stress is not something to eliminate. It is something to notice earlier and release sooner.",
    coverAngle: 230,
    body: [
      {
        type: "lead",
        text: "Stress is not something to be eliminated. It is a signal—and the goal is to notice it earlier and release it sooner.",
      },
      {
        type: "p",
        text: "Most of us carry tension without registering it: a tight jaw, raised shoulders, a held breath. By the time we notice, it has been building for hours.",
      },
      { type: "h3", text: "Catching it early" },
      {
        type: "ul",
        items: [
          "Check in with your jaw and shoulders a few times a day.",
          "Name what you feel without arguing with it—tension, worry, impatience.",
          "Let one long exhale finish completely before breathing in again.",
          "Move, even briefly. Stress that stays still tends to stay put.",
        ],
      },
      {
        type: "p",
        text: "Inner peace is not the absence of difficulty. It is a shorter distance between noticing tension and letting it go.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Posts other than `slug`, newest first, capped at `limit`. */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}
