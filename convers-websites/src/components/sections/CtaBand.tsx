"use client";

import { useRef } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import Magnetic from "@/components/ui/Magnetic";
import { useReveal } from "@/hooks/useReveal";

/** Closing act: one line, one button, a breath of gold. */
export default function CtaBand() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="contact-cta"
      data-section="Contact"
      className="relative overflow-clip border-t border-hairline"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(ellipse, var(--accent) 0%, transparent 62%)" }}
      />
      <div className="container-site relative flex flex-col items-center py-36 text-center md:py-48">
        <p className="eyebrow eyebrow--bare" data-reveal="fade">
          Un projet en tête&nbsp;?
        </p>
        <h2
          className="headline invisible mt-8 max-w-4xl text-cream"
          style={{ fontSize: "var(--text-hero)" }}
          data-reveal="words"
        >
          Donnons vie à <em className="font-light italic">vos idées.</em>
        </h2>
        <p className="mt-8 max-w-md text-balance leading-relaxed text-muted" data-reveal="up" data-reveal-delay="0.15">
          Racontez-nous votre marque. Nous répondons sous 48 h, avec un premier regard honnête sur
          votre projet.
        </p>
        <div className="mt-12" data-reveal="up" data-reveal-delay="0.25">
          <Magnetic strength={26}>
            <TransitionLink
              href="/contact"
              className="btn-pill btn-pill--solid accent-glow !px-12 !py-5 text-sm"
              data-cursor="link"
            >
              Démarrer un projet
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
