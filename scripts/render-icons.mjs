/**
 * Rasterizes public/icon.svg into the PWA PNG icons using sharp (already a
 * Next.js dependency). Run: node scripts/render-icons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const svg = await readFile(path.join(root, "public/icon.svg"));

await sharp(svg).resize(192, 192).png().toFile(path.join(root, "public/icon-192.png"));
await sharp(svg).resize(512, 512).png().toFile(path.join(root, "public/icon-512.png"));

// Maskable: full-bleed indigo background with the mark inside the safe zone
// (central ~80%), so Android adaptive-icon cropping never cuts the flag.
const mark = await sharp(svg).resize(400, 400).png().toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: "#4F46E5" },
})
  .composite([{ input: mark, top: 56, left: 56 }])
  .png()
  .toFile(path.join(root, "public/icon-maskable-512.png"));

// favicon.ico (32px) for legacy browsers
await sharp(svg).resize(32, 32).png().toFile(path.join(root, "public/favicon-32.png"));
console.log("icons rendered: icon-192.png, icon-512.png, icon-maskable-512.png, favicon-32.png");
