"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useReveal } from "@/hooks/useReveal";

const STEPS = [
  {
    number: "01",
    title: "Immersion",
    body: "Écoute, audit, positionnement. Nous entrons dans votre univers avant d'en dessiner le moindre pixel.",
  },
  {
    number: "02",
    title: "Direction artistique",
    body: "Territoires visuels, moodboards, prototypes animés. La signature se décide ici — avant la production.",
  },
  {
    number: "03",
    title: "Production",
    body: "Design, développement, tournage et génération. Chaque détail est poli jusqu'à l'évidence.",
  },
  {
    number: "04",
    title: "Lancement",
    body: "Mise en ligne, mesure, optimisation. Et un accompagnement qui ne s'arrête pas au jour J.",
  },
] as const;

/**
 * Delivery process: sticky heading on the left, a vertical timeline on the
 * right whose gold spine draws with the scroll while each step's number
 * rolls in like an odometer.
 */
export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      // Gold spine draws down as the list scrolls through the viewport.
      gsap.fromTo(
        "[data-spine]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-steps]",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        },
      );
      // Big numbers roll up digit by digit when their card arrives.
      section.querySelectorAll<HTMLElement>("[data-step-number]").forEach((el) => {
        const split = SplitText.create(el, { type: "chars", mask: "chars" });
        splits.push(split);
        gsap.from(split.chars, {
          yPercent: 105,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, section);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="processus" data-section="Processus" className="section-pad border-t border-hairline">
      <div className="container-site grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow" data-reveal="fade">Notre méthode</p>
          <h2 className="headline mt-6 text-cream" style={{ fontSize: "var(--text-h2)" }} data-reveal="lines">
            Quatre actes,
            <br />
            <em className="font-light italic">aucun hasard.</em>
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted" data-reveal="up">
            Un processus court, tenu, sans tunnel opaque&nbsp;: vous voyez le projet avancer à
            chaque acte — et vous validez l&apos;essentiel, jamais des détails cosmétiques.
          </p>
        </div>

        <div data-steps className="relative pl-10 md:pl-16">
          {/* Timeline spine */}
          <span aria-hidden className="absolute left-0 top-2 h-full w-px bg-hairline" />
          <span
            data-spine
            aria-hidden
            className="absolute left-0 top-2 h-full w-px origin-top scale-y-0 bg-accent"
          />

          <ol className="space-y-20">
            {STEPS.map((step, i) => (
              <li key={step.number} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-10 top-3 h-2 w-2 -translate-x-1/2 rounded-full border border-accent bg-bg md:-left-16"
                />
                <div data-reveal="up" data-reveal-delay={String(i * 0.05)}>
                  <span
                    data-step-number
                    aria-hidden
                    className="font-display block text-6xl font-light italic text-accent/85 md:text-7xl"
                  >
                    {step.number}
                  </span>
                  <h3 className="headline mt-4 text-cream" style={{ fontSize: "var(--text-h3)" }}>
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
