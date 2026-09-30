// One-off: pulls the hosted demo GIFs and re-encodes each as a small MP4 plus
// a first-frame poster in public/Images/demos/. A 19MB GIF comes out around
// 1MB. Re-run with `npm run demos` after swapping a GIF on postimg.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import ffmpeg from "ffmpeg-static";

const DEMO_SOURCES = {
  mood: "https://i.postimg.cc/rs98qpY1/normal-screen-(1).gif",
  discover: "https://i.postimg.cc/KFy4pLSc/discover.gif",
  toilet: "https://i.postimg.cc/8k1ppRNd/toilet.gif",
  choose: "https://i.postimg.cc/hnYwZCWM/screen-1-(1).gif",
  listen: "https://i.postimg.cc/gp4RG5kS/screen-2-(1).gif",
  progress: "https://i.postimg.cc/zzPVKsV4/screen-3-(1).gif",
};

const out = join(process.cwd(), "public", "Images", "demos");
mkdirSync(out, { recursive: true });

const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;

for (const [name, url] of Object.entries(DEMO_SOURCES)) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: ${res.status} fetching ${url}`);
  const gif = join(tmpdir(), `demo-${name}.gif`);
  writeFileSync(gif, Buffer.from(await res.arrayBuffer()));

  const mp4 = join(out, `${name}.mp4`);
  const poster = join(out, `${name}-poster.jpg`);

  // Even dimensions are required by yuv420p; 400px wide matches the source.
  execFileSync(ffmpeg, [
    "-y", "-loglevel", "error", "-i", gif,
    "-vf", "scale=400:-2:flags=lanczos,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "28",
    "-movflags", "+faststart", "-an", mp4,
  ]);
  execFileSync(ffmpeg, [
    "-y", "-loglevel", "error", "-i", gif,
    "-vf", "scale=400:-2:flags=lanczos", "-frames:v", "1", "-q:v", "4", poster,
  ]);

  console.log(`${name}: ${kb(gif)} gif -> ${kb(mp4)} mp4 + ${kb(poster)} poster`);
  rmSync(gif);
}
