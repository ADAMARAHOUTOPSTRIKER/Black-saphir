"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsTouch } from "@/hooks/useIsTouch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Custom cursor: a small dot + trailing ring. Elements opt into contextual
 * states with `data-cursor="view" | "play" | "drag" | "link"` — the ring
 * scales up and shows a label. Disabled on touch devices.
 */
const LABELS: Record<string, string> = {
  view: "Voir",
  play: "Play",
  drag: "Glisser",
  link: "",
};

export default function Cursor() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch || reduced) {
      document.body.dataset.customCursor = "false";
      return;
    }
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.body.dataset.customCursor = "true";
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, force3D: true });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;
    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const setState = (state: string | null) => {
      const active = state !== null;
      const text = state ? (LABELS[state] ?? "") : "";
      label.textContent = text;
      gsap.to(ring, {
        scale: active ? (text ? 3.2 : 1.8) : 1,
        backgroundColor: active ? "rgba(201,162,75,0.92)" : "rgba(201,162,75,0)",
        borderColor: active ? "rgba(201,162,75,0)" : "rgba(244,241,234,0.5)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.25 });
      gsap.to(dot, { scale: active ? 0 : 1, duration: 0.25 });
    };

    // Event delegation keeps this resilient to route changes / re-renders.
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (!target) return setState(null);
      setState(target.dataset.cursor ?? "link");
    };
    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to || !to.closest("[data-cursor], a, button")) setState(null);
    };
    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      document.body.dataset.customCursor = "false";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [isTouch, reduced]);

  if (isTouch || reduced) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-(--z-cursor) h-1.5 w-1.5 rounded-full bg-cream opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-(--z-cursor) flex h-10 w-10 items-center justify-center rounded-full border border-cream/50 opacity-0"
      >
        <span
          ref={labelRef}
          className="text-[9px] font-medium uppercase tracking-[0.14em] text-bg opacity-0"
        />
      </div>
    </>
  );
}
