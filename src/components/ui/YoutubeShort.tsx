"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * YouTube Short as a phone screen. Rests on a local poster with a big
 * Shorts-style play button in the middle; tapping the video plays it (with
 * sound) and tapping again pauses. A small button toggles sound.
 *
 * The embed's own UI (title bar, grey play circle, prev/next, watermark) lives
 * in a cross-origin iframe and can't be styled away, so we hide it instead:
 *  - no `playlist` param (that is what adds prev/next); looping is done by hand
 *    on the "ended" state;
 *  - an opaque poster covers the iframe whenever it isn't playing, which is
 *    when YouTube draws its paused UI;
 *  - the iframe is taller than the screen so its top and bottom (title flash at
 *    start, bottom-right watermark) are cropped by the parent's overflow.
 * Driven through the IFrame API's postMessage protocol (`enablejsapi=1`).
 */
const YT_ORIGIN = "https://www.youtube-nocookie.com";
const POSTER_SRC = "/Images/demos/yt-short-poster.jpg";

/** YouTube Shorts mark: red tilted "S" with a white play triangle. */
function ShortsPlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#ff0000"
        d="M17.77 10.32l-1.2-.5L18 9.06a3.74 3.74 0 0 0-3.5-6.62L6 6.94a3.74 3.74 0 0 0 .23 6.74l1.2.49L6 14.93a3.75 3.75 0 0 0 3.5 6.63l8.5-4.5a3.74 3.74 0 0 0-.23-6.74z"
      />
      <path fill="#fff" d="M10 14.65v-5.3L15 12l-5 2.65z" />
    </svg>
  );
}

export function YoutubeShort({ id }: { id: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Once the visitor has played or toggled sound, later plays keep their choice.
  const soundChosenRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const send = useCallback((func: string, args: unknown[] = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      YT_ORIGIN,
    );
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || typeof e.data !== "string") return;
      let data: { event?: string; info?: { playerState?: number; muted?: boolean } };
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      const info = data.info;
      if (data.event !== "infoDelivery" || !info) return;

      if (typeof info.playerState === "number") {
        if (info.playerState === 1) setPlaying(true);
        else if (info.playerState === 2) setPlaying(false);
        else if (info.playerState === 0) {
          // Ended: loop by hand (the `loop` param needs `playlist`, which adds prev/next).
          send("seekTo", [0, true]);
          send("playVideo");
        }
      }
      if (typeof info.muted === "boolean") setMuted(info.muted);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [send]);

  const togglePlay = () => {
    if (!playing && !soundChosenRef.current) {
      // First play: sound on by default (the tap is the user gesture that allows it).
      soundChosenRef.current = true;
      send("unMute");
      setMuted(false);
    }
    send(playing ? "pauseVideo" : "playVideo");
    setPlaying(!playing);
  };

  const src =
    `${YT_ORIGIN}/embed/${id}` +
    `?controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3` +
    `&disablekb=1&fs=0&enablejsapi=1`;

  return (
    <div className="absolute inset-0 isolate">
      <iframe
        ref={frameRef}
        src={src}
        title="PujoGo demo video"
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        tabIndex={-1}
        onLoad={() =>
          // Subscribe to state/mute updates from the player.
          frameRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: "listening", id }),
            YT_ORIGIN,
          )
        }
        className="pointer-events-none absolute left-1/2 max-w-none -translate-x-1/2 border-0"
        // 122% tall, centered: crops ~11% off the top and bottom (title, watermark).
        style={{ aspectRatio: "9 / 16", height: "122%", top: "-11%" }}
      />

      {/* Opaque while not playing, hiding YouTube's paused UI. */}
      <div
        className={`pointer-events-none absolute inset-0 z-[5] bg-black transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100"}`}
      >
        <Image src={POSTER_SRC} alt="" fill sizes="(min-width: 1600px) 20vw, 320px" className="object-cover" />
      </div>

      {/* Whole screen is the play/pause target; the Shorts mark shows while paused. */}
      <button
        type="button"
        aria-label={playing ? "Pause video" : "Play video"}
        onClick={togglePlay}
        className="absolute inset-0 z-[6] flex cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
      >
        <ShortsPlayIcon
          className={`size-[26%] drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-200 ${playing ? "scale-90 opacity-0" : "opacity-100 hover:scale-105"}`}
        />
      </button>

      <button
        type="button"
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        onClick={() => {
          soundChosenRef.current = true;
          send(muted ? "unMute" : "mute");
          setMuted(!muted);
        }}
        className="absolute bottom-[5%] right-[6%] z-10 flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
          <path d="M3 9.5v5h4l5 4v-13l-5 4z" />
          {muted ? (
            <path d="m15.3 9.7 1.4-1.4 2.3 2.3 2.3-2.3 1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3z" />
          ) : (
            <path d="M15.5 8.5a5 5 0 0 1 0 7l-1.2-1.2a3.3 3.3 0 0 0 0-4.6zM18 6a8.5 8.5 0 0 1 0 12l-1.2-1.2a6.8 6.8 0 0 0 0-9.6z" />
          )}
        </svg>
      </button>
    </div>
  );
}
