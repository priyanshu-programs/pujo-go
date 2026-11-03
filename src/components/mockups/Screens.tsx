import Image from "next/image";
import { DemoVideo } from "@/components/ui/DemoVideo";
import { PhoneStatusBar } from "@/components/ui/PhoneFrame";
import { YoutubeShort } from "@/components/ui/YoutubeShort";
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
      <p className="px-[8%] pt-[6%] font-display text-[0.8125rem] leading-tight text-ink">
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
            <span className="flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full bg-blush text-[0.6875rem]">
              {mood.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.5rem] font-bold text-ink">
                {mood.label}
              </span>
              <span className="block truncate text-[0.375rem] text-muted">
                {mood.hint}
              </span>
            </span>
            <span className="text-[0.5rem] text-muted">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Walkthrough encoded from the hosted GIF by `npm run demos` (see
 *  scripts/convert-demos.mjs): ~0.5MB MP4 in place of a 4–19MB GIF. Rests on
 *  its poster; plays only while `playing`. */
function Demo({ name, playing }: { name: string; playing: boolean }) {
  return (
    <DemoVideo
      src={`/Images/demos/${name}.mp4`}
      poster={`/Images/demos/${name}-poster.jpg`}
      playing={playing}
      rate={1}
      fit="cover"
    />
  );
}

export function MoodDemoScreen({ playing = false }: { playing?: boolean }) {
  return <Demo name="mood" playing={playing} />;
}

export function DiscoverDemoScreen({ playing = false }: { playing?: boolean }) {
  return <Demo name="discover" playing={playing} />;
}

export function ToiletDemoScreen({ playing = false }: { playing?: boolean }) {
  return <Demo name="toilet" playing={playing} />;
}

export function ChooseDemoScreen({ playing = false }: { playing?: boolean }) {
  return <Demo name="choose" playing={playing} />;
}

export function ListenDemoScreen({ playing = false }: { playing?: boolean }) {
  return <Demo name="listen" playing={playing} />;
}

export function ProgressDemoScreen({ playing = false }: { playing?: boolean }) {
  return <Demo name="progress" playing={playing} />;
}

/** Recorded breathing-session walkthrough (half speed); plays only while `playing`. */
export function BreatheDemoScreen({ playing = false }: { playing?: boolean }) {
  return (
    <DemoVideo
      src="/Images/breathe-demo.mp4"
      poster="/Images/breathe-demo-poster.jpg"
      playing={playing}
    />
  );
}

/** YouTube Short as a phone screen, with play/pause and sound buttons (see ui/YoutubeShort). */
export function YoutubeShortScreen({ id }: { id: string }) {
  return <YoutubeShort id={id} />;
}

/** Static app screenshot, drawn as a PhoneFrame underlay so it fills the whole
 *  screen edge-to-edge, bezel over it, not around it. */
function StaticScreen({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1600px) 20vw, 320px"
        className="object-cover"
      />
    </div>
  );
}

export function GetStartedLeftScreen() {
  return <StaticScreen src="/Images/get-started-left.avif" />;
}

export function GetStartedRightScreen() {
  return <StaticScreen src="/Images/get-started-right.avif" />;
}

/** Streak calendar — the screen shown in the hero. */
export function ProgressScreen() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const highlighted = new Set([3, 11, 16, 24]);

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-surface to-paper text-white">
      <PhoneStatusBar />
      <div className="px-[8%] pt-[6%]">
        <p className="text-[0.375rem] font-bold uppercase tracking-[0.08em] text-white/50">
          June 2025
        </p>
        <p className="mt-[2%] font-display text-[0.875rem] leading-tight">
          18 meditations
          <br />
          completed
        </p>
      </div>
      <div className="mt-[6%] grid grid-cols-7 gap-y-[0.375rem] px-[7%]">
        {days.map((d) => (
          <span
            key={d}
            className="text-center text-[0.375rem] font-bold text-white/40"
          >
            {d}
          </span>
        ))}
        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
          <span
            key={day}
            className={`mx-auto flex h-[0.8125rem] w-[0.8125rem] items-center justify-center rounded-full text-[0.375rem] ${
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
      <p className="px-[8%] pt-[6%] font-display text-[0.8125rem] text-ink">
        Today for you
      </p>
      <div className="mt-[5%] flex flex-col gap-[3%] px-[6%]">
        {sessions.map((s) => (
          <div
            key={s.title}
            className="flex items-center justify-between rounded-[10px] bg-surface/80 px-[5%] py-[4%]"
          >
            <span className="text-[0.5rem] font-bold text-ink">{s.title}</span>
            <span className="text-[0.375rem] text-muted">{s.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const screenMap = {
  mood: ChooseDemoScreen,
  breathe: ListenDemoScreen,
  progress: ProgressDemoScreen,
  sessions: SessionsScreen,
} as const;
