"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Full-screen film grain. The tile is a tiny procedural PNG
 * (public/assets/textures/grain.png); the drift animation is a cheap
 * transform on an oversized layer. Static under reduced motion.
 */
export default function Grain() {
  const reduced = usePrefersReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-(--z-grain) overflow-clip">
      <div
        className="absolute -inset-[10%] opacity-[0.055] mix-blend-overlay"
        style={{
          backgroundImage: "url(/assets/textures/grain.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          animation: reduced ? "none" : "grain-shift 0.9s steps(4) infinite",
        }}
      />
    </div>
  );
}
