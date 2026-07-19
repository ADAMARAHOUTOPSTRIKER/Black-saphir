"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useReveal } from "@/hooks/useReveal";

const STATS = [
  { value: 40, suffix: "+", label: "Projets livrés", decimals: 0 },
  { value: 98, suffix: "%", label: "Clients satisfaits", decimals: 0 },
  { value: 12, suffix: "", label: "Secteurs d'activité", decimals: 0 },
  { value: 5.0, suffix: "", label: "Note moyenne", decimals: 1 },
] as const;

const BADGES = ["Awwwards", "CSS Design Awards", "Behance", "GSAP Showcase"] as const;

/** Proof: counters that count up once in view + a quiet badge strip. */
export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count ?? "0");
        const decimals = parseInt(el.dataset.decimals ?? "0", 10);
        const format = (v: number) =>
          v.toFixed(decimals).replace(".", ","); // French decimal comma
        if (reduced) {
          el.textContent = format(target);
          return;
        }
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = format(state.value);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="chiffres" data-section="Chiffres" className="section-pad border-t border-hairline bg-surface/40">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-y-14 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-reveal="up"
              data-reveal-delay={String(i * 0.08)}
              className={i > 0 ? "lg:border-l lg:border-hairline lg:pl-10" : ""}
            >
              <p className="font-display text-6xl font-light text-cream md:text-7xl">
                <span data-count={stat.value} data-decimals={stat.decimals}>
                  0
                </span>
                <span className="text-accent">{stat.suffix}</span>
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div
          data-reveal="fade"
          data-reveal-delay="0.2"
          className="mt-20 flex flex-wrap items-center gap-x-12 gap-y-4 border-t border-hairline pt-10"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-muted">Présents sur</span>
          {BADGES.map((badge) => (
            <span key={badge} className="font-display text-lg italic text-cream/60 transition-colors duration-300 hover:text-accent">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
