/**
 * Downloads the Convers brand-atmosphere media into assets/.
 *
 * Why this exists: these files were generated with the Higgsfield tools from a
 * sandboxed environment whose network egress policy blocks the Higgsfield CDN,
 * so the binaries could not be committed. This script runs automatically in the
 * Vercel build (see vercel.json buildCommand) where the network is open, and can
 * also be run once locally: `node scripts/fetch-assets.mjs`. It no-ops when the
 * files already exist, and the site itself verifies each file before enabling it
 * (missing media falls back to the CSS atmosphere), so this fails soft.
 *
 * Only Convers's own brand-atmosphere media lives here. Portfolio media must be
 * exact captures of the live client sites (see assets/work/README.md), never
 * generated files.
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3GHPoA15zVprBfRKPajGW3fs5DR";

const FILES = [
  // hero atmosphere poster (light still, 2752x1536 master + optimized webp)
  ["assets/img/atmos-poster.webp", `${CDN}/hf_20260719_194433_56359980-fb82-4449-92ac-ba64b1966d96_min.webp`],
  // hero atmosphere loop (6 s, 1080p, silent, start frame = end frame)
  ["assets/video/atmos.mp4", `${CDN}/hf_20260719_212648_2d9f9e84-163d-4c76-903a-9ea8338bb6ae.mp4`],
  // craft demo film poster: exploded camera flat-lay with engraved part captions
  ["assets/img/craft-film-poster.webp", `${CDN}/hf_20260719_224802_94d951d0-d30f-4a09-8535-1cad5992347b_min.webp`],
  // craft demo film (10 s, 1080p, cinematic sound; luxury camera assembles, shoots, disassembles)
  ["assets/video/craft-film.mp4", `${CDN}/CRAFT_FILM_PENDING`]
];

let fetched = 0, skipped = 0, failed = 0;

for (const [dest, url] of FILES) {
  if (url.includes("PENDING")) { continue; }
  const path = join(ROOT, dest);
  if (existsSync(path)) { skipped++; continue; }
  mkdirSync(dirname(path), { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(path));
    fetched++;
    console.log(`fetched ${dest}`);
  } catch (err) {
    failed++;
    console.warn(`failed ${dest}: ${err.message ?? err}`);
  }
}

console.log(`Assets: ${fetched} fetched, ${skipped} already present, ${failed} failed.`);
if (failed > 0) {
  console.warn("Missing media falls back to the CSS atmosphere; re-run later on an open network.");
}
