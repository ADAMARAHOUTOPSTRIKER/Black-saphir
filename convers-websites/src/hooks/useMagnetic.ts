"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "./usePrefersReducedMotion";
import { isTouchDevice } from "./useIsTouch";

/**
 * Magnetic hover: the element leans toward the cursor while hovered and
 * springs back on leave. `strength` is the max translation in px.
 * Inert on touch devices and under reduced motion.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 18) {
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice() || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
}
