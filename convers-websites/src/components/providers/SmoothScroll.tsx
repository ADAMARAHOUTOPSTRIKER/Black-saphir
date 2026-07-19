"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const LenisContext = createContext<Lenis | null>(null);

/** Access the Lenis instance (null under reduced motion / before mount). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Site-wide buttery scroll. Lenis drives the scroll position and feeds
 * ScrollTrigger through GSAP's ticker so pins/scrubs stay in sync.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      anchors: false,
    });

    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    rafRef.current = raf;
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis can only exist client-side; one intentional post-mount render.
    setLenis(instance);
    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
