/**
 * Procedurally generates the texture assets:
 *   public/assets/textures/grain.png — 128px tileable film-grain tile
 *   public/assets/textures/glow.png  — 512px radial gold glow map (WebGL hero)
 * Pure Node (zlib + manual PNG chunks), no dependencies, no network.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "textures");
mkdirSync(OUT, { recursive: true });

// ── minimal PNG encoder ─────────────────────────────────────
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── grain: mid-gray luminance noise (used with mix-blend-overlay) ──
{
  const size = 128;
  const px = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = 128 + Math.round((Math.random() - 0.5) * 110);
    px[i * 4] = v;
    px[i * 4 + 1] = v;
    px[i * 4 + 2] = v;
    px[i * 4 + 3] = 255;
  }
  writeFileSync(join(OUT, "grain.png"), encodePNG(size, size, px));
  console.log("✓ grain.png");
}

// ── glow: radial gold gradient, smoothstep falloff ──
{
  const size = 512;
  const px = Buffer.alloc(size * size * 4);
  const center = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - center, y - center) / center; // 0..~1.41
      const t = Math.max(0, 1 - d);
      const a = t * t * (3 - 2 * t); // smoothstep
      const i = (y * size + x) * 4;
      // blend core (224,188,106) → edge (201,162,75)
      px[i] = Math.round(201 + 23 * a);
      px[i + 1] = Math.round(162 + 26 * a);
      px[i + 2] = Math.round(75 + 31 * a);
      px[i + 3] = Math.round(255 * a);
    }
  }
  writeFileSync(join(OUT, "glow.png"), encodePNG(size, size, px));
  console.log("✓ glow.png");
}
