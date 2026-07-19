"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Branded intro: logotype + progress hairline, then a two-panel wipe.
 * Total budget ≈ 1.7s. Shown once per browser session; afterwards the
 * hero animates immediately.
 */
export default function Preloader() {
  // Rendered by default so the very first paint is the branded cover —
  // never a flash of the unrevealed page.
  const [show, setShow] = useState(true);
  const [run, setRun] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("convers:intro");
    /* eslint-disable react-hooks/set-state-in-effect -- sessionStorage is browser-only; the intro decision must happen post-mount. */
    if (seen || prefersReducedMotion()) {
      markIntroDone();
      setShow(false);
    } else {
      setRun(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!run) return;
    const root = rootRef.current;
    const count = countRef.current;
    const fill = fillRef.current;
    if (!root || !count || !fill) return;

    document.documentElement.setAttribute("data-intro-active", "true");
    const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
    const progress = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("convers:intro", "1");
        markIntroDone();
        setShow(false);
      },
    });

    tl.fromTo(
      letters,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.035 },
      0,
    )
      .to(
        progress,
        {
          value: 100,
          duration: 0.9,
          ease: "power2.inOut",
          onUpdate: () => {
            count.textContent = `${Math.round(progress.value)}%`;
            fill.style.transform = `scaleX(${progress.value / 100})`;
          },
        },
        0.15,
      )
      // Curtain: content sinks, then the whole panel wipes upward.
      .to(root.querySelector("[data-inner]"), { yPercent: -20, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, ">-0.05")
      .to(root, { yPercent: -100, duration: 0.65, ease: "power4.inOut" }, "<0.15");

    return () => {
      tl.kill();
      document.documentElement.removeAttribute("data-intro-active");
    };
  }, [run]);

  if (!show) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-(--z-preloader) flex items-center justify-center bg-bg" aria-hidden>
      <div data-inner className="flex w-[min(20rem,80vw)] flex-col items-center gap-8">
        <div className="overflow-clip">
          <div className="font-display text-3xl tracking-[0.3em] text-cream">
            {"CONVERS".split("").map((letter, i) => (
              <span key={i} data-letter className="inline-block">
                {letter}
              </span>
            ))}
            <span data-letter className="inline-block -translate-y-2 pl-1 text-sm text-accent">
              ®
            </span>
          </div>
        </div>
        <div className="h-px w-full bg-hairline">
          <div ref={fillRef} className="h-full w-full origin-left scale-x-0 bg-accent" />
        </div>
        <span ref={countRef} className="text-[11px] tracking-[0.35em] text-muted">
          0%
        </span>
      </div>
    </div>
  );
}
