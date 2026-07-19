"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Pinned manifesto: the statement is split into words and "inks in" from
 * muted to cream as you scroll, one beat per word — the section stays
 * pinned for the duration of the read.
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const statement = section.querySelector<HTMLElement>("[data-statement]");
    if (!statement) return;

    if (prefersReducedMotion()) {
      gsap.set(statement, { autoAlpha: 1 });
      return;
    }

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(statement, { type: "words" });
      gsap.set(statement, { autoAlpha: 1 });
      gsap.set(split.words, { opacity: 0.14 });
      // Scrubbed word-by-word fill while the section is pinned.
      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="studio"
      data-section="Studio"
      className="relative flex min-h-screen items-center overflow-clip"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
      />
      <div className="container-site relative py-32">
        <p className="eyebrow">Le studio</p>
        <p
          data-statement
          className="headline invisible mt-10 max-w-5xl text-cream"
          style={{ fontSize: "var(--text-h2)", lineHeight: 1.18 }}
        >
          Un site n&apos;est pas une page. C&apos;est une première poignée de main. Nous créons des
          expériences qui donnent envie de rester — et des films qui donnent envie de revenir.
        </p>
        <p className="mt-12 max-w-md text-sm leading-relaxed text-muted">
          Convers Websites — le digital, traité comme un objet rare. Une seule équipe pour votre
          site et vos films&nbsp;: une signature cohérente, du premier pixel à la dernière image.
        </p>
      </div>
    </section>
  );
}
