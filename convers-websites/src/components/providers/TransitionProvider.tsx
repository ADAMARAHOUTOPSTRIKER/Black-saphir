"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type TransitionContextValue = {
  /** Navigate with the gold overlay wipe. Falls back to a plain push under reduced motion. */
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => {} });

export function usePageTransition() {
  return useContext(TransitionContext);
}

/**
 * Route transitions: a gold sliver + charcoal panel sweep up to cover the
 * page, the route swaps underneath, then both sweep away. The reveal is
 * keyed off the pathname change so it never fires early.
 */
export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef(false);
  const busyRef = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (busyRef.current) return;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }
      busyRef.current = true;
      const panels = overlay.querySelectorAll<HTMLElement>("[data-panel]");
      overlay.style.pointerEvents = "auto";
      gsap
        .timeline({
          onComplete: () => {
            pendingRef.current = true;
            router.push(href);
          },
        })
        .fromTo(
          panels,
          { yPercent: 101 },
          { yPercent: 0, duration: 0.55, ease: "power4.inOut", stagger: 0.08 },
        )
        .fromTo(
          overlay.querySelector("[data-mark]"),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
          "-=0.25",
        );
    },
    [router],
  );

  // Reveal once the new route has actually rendered.
  useEffect(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const panels = overlay.querySelectorAll<HTMLElement>("[data-panel]");

    // Land on the anchor if the target route carried one, else start at top.
    const hashTarget = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    if (hashTarget) hashTarget.scrollIntoView({ behavior: "auto", block: "start" });
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    gsap
      .timeline({
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          busyRef.current = false;
        },
      })
      .to(overlay.querySelector("[data-mark]"), { autoAlpha: 0, duration: 0.2 })
      .to(panels, { yPercent: -101, duration: 0.6, ease: "power4.inOut", stagger: -0.08 }, "<")
      .set(panels, { yPercent: 101 });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-(--z-transition)"
      >
        <div data-panel className="absolute inset-0 translate-y-[101%] bg-accent" />
        <div data-panel className="absolute inset-0 translate-y-[101%] bg-bg">
          <div data-mark className="flex h-full items-center justify-center opacity-0">
            <span className="font-display text-2xl tracking-[0.3em] text-cream">
              CONVERS<span className="pl-1 text-xs text-accent align-super">®</span>
            </span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
