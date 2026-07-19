/**
 * Downloads the Higgsfield-generated media into public/assets/.
 *
 * Why this exists: the assets were generated with the Higgsfield MCP tools
 * from a sandboxed environment whose network egress policy blocks the
 * Higgsfield CDN (d8j0ntlcm91z4.cloudfront.net), so the binaries could not
 * be committed. Run `npm run fetch:assets` once on a machine with normal
 * internet access — it is also wired into `predev`/`prebuild` and no-ops
 * when every file already exists. Fails soft: the site renders labeled
 * placeholder blocks for any missing media.
 *
 * For each image both files are fetched:
 *   <name>.webp     — CDN-optimized, used by the site
 *   <name>-raw.png  — 2752×1536 master, for re-exports
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3GHPoA15zVprBfRKPajGW3fs5DR";

const IMAGES = [
  ["assets/hero/poster", "hf_20260719_101604_c68e7dd7-8ae3-4c81-bf15-4ceb39c2ddfd"],
  ["assets/work/obsidienne-cover", "hf_20260719_101607_efda31f1-d4d7-4479-8a31-68f057c9814c"],
  ["assets/work/marsa-cover", "hf_20260719_101609_651cb7c2-af12-412c-8a43-7e09743759e3"],
  ["assets/work/sentia-cover", "hf_20260719_101611_90597563-8735-43ac-b91b-86789c02da2a"],
  ["assets/work/opticvision-cover", "hf_20260719_101613_1df70339-8535-454a-bcb3-9a3a045ee9d7"],
  ["assets/work/obsidienne-detail", "hf_20260719_102233_a7b04bdb-e866-42fc-a0a7-4d179f898510"],
  ["assets/work/marsa-detail", "hf_20260719_102236_b62ed3d7-7c91-4529-9c71-bfc109a8f2ad"],
  ["assets/work/sentia-detail", "hf_20260719_102241_1d6399c6-a9e2-41bc-9261-6091159e5f07"],
  ["assets/work/opticvision-detail", "hf_20260719_102244_7011c957-79a3-4312-985c-e0fc2ca98492"],
];

const VIDEOS = [
  ["assets/hero/loop.mp4", "hf_20260719_102228_6d3a6f44-07fb-4b8e-b61f-e66d1366069c.mp4"],
  ["assets/showreel/reel.mp4", "hf_20260719_102256_2d89878b-4abf-4940-8e84-eb4528a2d9af.mp4"],
];

const jobs = [];
for (const [dest, id] of IMAGES) {
  jobs.push([`${dest}.webp`, `${CDN}/${id}_min.webp`]);
  jobs.push([`${dest}-raw.png`, `${CDN}/${id}.png`]);
}
for (const [dest, file] of VIDEOS) {
  jobs.push([dest, `${CDN}/${file}`]);
}

let fetched = 0;
let failed = 0;
let skipped = 0;

for (const [dest, url] of jobs) {
  const path = join(ROOT, dest);
  if (existsSync(path)) {
    skipped++;
    continue;
  }
  mkdirSync(dirname(path), { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(path));
    fetched++;
    console.log(`✓ ${dest}`);
  } catch (err) {
    failed++;
    console.warn(`✗ ${dest} — ${err.message ?? err}`);
  }
}

console.log(`\nAssets: ${fetched} fetched, ${skipped} already present, ${failed} failed.`);
if (failed > 0) {
  console.warn(
    "Some assets could not be downloaded (offline or blocked network?).\n" +
      "The site will show labeled placeholders for missing media — run `npm run fetch:assets` again later.",
  );
}
