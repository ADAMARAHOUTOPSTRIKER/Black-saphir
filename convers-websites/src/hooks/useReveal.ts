"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Declarative scroll reveals. Mark any element inside the scope with:
 *
 *   data-reveal="up"     → y + fade (default)
 *   data-reveal="fade"   → opacity only
 *   data-reveal="mask"   → clip-path curtain from the bottom
 *   data-reveal="lines"  → SplitText line-by-line masked rise
 *   data-reveal="words"  → SplitText per-word rise + blur
 *   data-reveal-delay    → seconds, stagger siblings manually
 *
 * Under prefers-reduced-motion everything collapses to a soft fade.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const reduced = prefersReducedMotion();
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      for (const el of targets) {
        const kind = el.dataset.reveal || "up";
        const delay = parseFloat(el.dataset.revealDelay ?? "0");
        const trigger: ScrollTrigger.Vars = {
          trigger: el,
          start: el.dataset.revealStart ?? "top 88%",
          once: true,
        };

        if (reduced) {
          gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay, scrollTrigger: trigger });
          continue;
        }

        switch (kind) {
          case "fade":
            gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1, delay, scrollTrigger: trigger });
            break;

          case "mask":
            gsap.fromTo(
              el,
              { clipPath: "inset(100% 0% 0% 0%)", y: 24 },
              { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.2, ease: "power4.out", delay, scrollTrigger: trigger },
            );
            break;

          case "lines": {
            const split = SplitText.create(el, {
              type: "lines",
              linesClass: "split-line",
              mask: "lines",
              autoSplit: true,
            });
            splits.push(split);
            gsap.set(el, { autoAlpha: 1 });
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1,
              ease: "power4.out",
              stagger: 0.09,
              delay,
              scrollTrigger: trigger,
            });
            break;
          }

          case "words": {
            const split = SplitText.create(el, { type: "words" });
            splits.push(split);
            gsap.set(el, { autoAlpha: 1 });
            gsap.from(split.words, {
              autoAlpha: 0,
              y: 28,
              filter: "blur(6px)",
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.045,
              delay,
              scrollTrigger: trigger,
            });
            break;
          }

          default:
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 44 },
              { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", delay, scrollTrigger: trigger },
            );
        }
      }
    }, root);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [scope]);
}
