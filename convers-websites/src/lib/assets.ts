/**
 * Central asset map. Every generated medium lives in public/assets/
 * (populated by `npm run fetch:assets`). Swap files there — or paths
 * here — to rebrand without touching components.
 */
export const ASSETS = {
  hero: {
    poster: "/assets/hero/poster.webp",
    loop: "/assets/hero/loop.mp4",
  },
  showreel: {
    reel: "/assets/showreel/reel.mp4",
    poster: "/assets/work/obsidienne-cover.webp",
  },
  textures: {
    grain: "/assets/textures/grain.png",
    glow: "/assets/textures/glow.png",
  },
} as const;
