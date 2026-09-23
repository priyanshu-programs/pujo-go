import { PhoneStatusBar } from "@/components/ui/PhoneFrame";
import { moods } from "@/content/steps";

/**
 * In-app screens recreated in markup rather than hotlinked from the source's
 * CDN. Each one fills a PhoneFrame.
 */

/** "How are you feeling today?" — the mood picker. */
export function MoodScreen() {
  return (
    <div className="flex h-full flex-col">
      <PhoneStatusBar />
      <p className="px-[8%] pt-[6%] font-display text-[13px] leading-tight text-ink">
        How are you
        <br />
        feeling today?
      </p>
      <div className="mt-[5%] flex flex-col gap-[3%] px-[6%]">
        {moods.map((mood) => (
          <div
            key={mood.label}
            className="flex items-center gap-[4%] rounded-full bg-surface/80 px-[4%] py-[3%] shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          >
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-blush text-[11px]">
              {mood.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[8px] font-bold text-ink">
                {mood.label}
              </span>
              <span className="block truncate text-[6px] text-muted">
                {mood.hint}
              </span>
            </span>
            <span className="text-[8px] text-muted">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "Breathe out…" — concentric rings mid-session. */
export function BreatheScreen() {
  return (
    <div className="flex h-full flex-col">
      <PhoneStatusBar />
      <p className="px-[8%] pt-[6%] font-display text-[13px] text-ink">
        Breathe out...
      </p>
      <div className="relative flex flex-1 items-center justify-center">
        {[100, 74, 48].map((size, i) => (
          <span
            key={size}
            aria-hidden="true"
            className="absolute rounded-full border border-ink/15"
            style={{
              width: `${size}%`,
              aspectRatio: "1",
              opacity: 0.6 - i * 0.15,
            }}
          />
        ))}
        <span
          aria-hidden="true"
          className="absolute rounded-full bg-gradient-to-b from-accent/80 to-blush"
          style={{ width: "34%", aspectRatio: "1" }}
        />
      </div>
      <div className="px-[8%] pb-[10%] text-center">
        <span className="text-[7px] font-bold text-muted">03:24 remaining</span>
      </div>
    </div>
  );
}

/** Streak calendar — the screen shown in the hero. */
export function ProgressScreen() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const highlighted = new Set([3, 11, 16, 24]);

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-surface to-paper text-white">
      <PhoneStatusBar />
      <div className="px-[8%] pt-[6%]">
        <p className="text-[6px] font-bold uppercase tracking-[0.08em] text-white/50">
          June 2025
        </p>
        <p className="mt-[2%] font-display text-[14px] leading-tight">
          18 meditations
          <br />
          completed
        </p>
      </div>
      <div className="mt-[6%] grid grid-cols-7 gap-y-[6px] px-[7%]">
        {days.map((d) => (
          <span
            key={d}
            className="text-center text-[6px] font-bold text-white/40"
          >
            {d}
          </span>
        ))}
        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
          <span
            key={day}
            className={`mx-auto flex h-[13px] w-[13px] items-center justify-center rounded-full text-[6px] ${
              highlighted.has(day)
                ? "bg-blush font-bold text-ink"
                : "text-white/55"
            }`}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Generic session-list screen used to fill secondary phones. */
export function SessionsScreen() {
  const sessions = [
    { title: "Morning reset", length: "5 min" },
    { title: "Deep focus", length: "12 min" },
    { title: "Unwind", length: "8 min" },
    { title: "Sleep drift", length: "20 min" },
  ];

  return (
    <div className="flex h-full flex-col">
      <PhoneStatusBar />
      <p className="px-[8%] pt-[6%] font-display text-[13px] text-ink">
        Today for you
      </p>
      <div className="mt-[5%] flex flex-col gap-[3%] px-[6%]">
        {sessions.map((s) => (
          <div
            key={s.title}
            className="flex items-center justify-between rounded-[10px] bg-surface/80 px-[5%] py-[4%]"
          >
            <span className="text-[8px] font-bold text-ink">{s.title}</span>
            <span className="text-[6px] text-muted">{s.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const screenMap = {
  mood: MoodScreen,
  breathe: BreatheScreen,
  progress: ProgressScreen,
  sessions: SessionsScreen,
} as const;
