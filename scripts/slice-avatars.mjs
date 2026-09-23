import sharp from "sharp";
import path from "path";
import fs from "fs";

const SRC = "public/Avatar images.png";
const OUT_DIR = "public/Images/community";
const COLS = 3, ROWS = 2;

async function main() {
  const img = sharp(SRC);
  const { width, height } = await img.metadata();
  const cellW = width / COLS;
  const cellH = height / ROWS;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Raw pixel buffer to find non-white (circle) bounds per cell.
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const { width: W, channels } = info;

  function isWhite(x, y) {
    const idx = (y * W + x) * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    return r > 245 && g > 245 && b > 245;
  }

  let index = 1;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x0 = Math.round(col * cellW);
      const y0 = Math.round(row * cellH);
      const x1 = Math.round((col + 1) * cellW);
      const y1 = Math.round((row + 1) * cellH);

      let minX = x1, maxX = x0, minY = y1, maxY = y0;
      // Sample every 2px for speed.
      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          if (!isWhite(x, y)) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const w = maxX - minX;
      const h = maxY - minY;
      const diameter = Math.max(w, h);
      const cx = Math.round((minX + maxX) / 2);
      const cy = Math.round((minY + maxY) / 2);
      const radius = Math.ceil(diameter / 2) + 2; // small pad
      const left = Math.max(x0, cx - radius);
      const top = Math.max(y0, cy - radius);
      const size = Math.min(radius * 2, x1 - left, y1 - top);

      console.log(`cell ${index}: bounds x[${minX},${maxX}] y[${minY},${maxY}] -> crop ${size}x${size} at (${left},${top})`);

      const outPath = path.join(OUT_DIR, `avatar-${index}.webp`);

      // Circular mask
      const maskSvg = Buffer.from(
        `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
      );

      await sharp(SRC)
        .extract({ left, top, width: size, height: size })
        .composite([{ input: maskSvg, blend: "dest-in" }])
        .webp({ quality: 82 })
        .toFile(outPath);

      index++;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
