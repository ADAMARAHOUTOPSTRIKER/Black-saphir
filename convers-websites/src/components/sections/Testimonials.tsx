"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const QUOTES = [
  {
    text: "Convers a compris Obsidienne mieux que nous. Le configurateur 3D a doublé nos demandes d'essai en trois mois.",
    author: "A. Benali",
    role: "Directeur, Obsidienne",
  },
  {
    text: "Le site respire comme notre club. Nos membres nous disent qu'ils retrouvent l'océan à l'écran.",
    author: "S. El Fassi",
    role: "Fondatrice, Marsa — Club Nautique",
  },
  {
    text: "Un e-commerce qui vend sans crier. Panier moyen en hausse de 40 % dès le premier trimestre.",
    author: "C. Laurent",
    role: "CEO, Sentia",
  },
  {
    text: "Ils ont fait de nos montures des objets d'art. Le film de lancement a porté toute la campagne.",
    author: "M. Duret",
    role: "Direction, OpticVision",
  },
] as const;

/** Auto-advancing quote carousel — restrained, keyboard-friendly. */
export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  useReveal(sectionRef);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + QUOTES.length) % QUOTES.length);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [paused, reduced, go]);

  const quote = QUOTES[index];

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      data-section="Témoignages"
      className="section-pad border-t border-hairline"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-site">
        <p className="eyebrow" data-reveal="fade">Ils nous font confiance</p>

        <div
          className="relative mt-14 min-h-[16rem] md:min-h-[14rem]"
          role="group"
          aria-roledescription="carrousel"
          aria-label="Témoignages clients"
          data-reveal="fade"
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              aria-live="polite"
            >
              <p className="headline max-w-4xl text-cream" style={{ fontSize: "var(--text-h3)", lineHeight: 1.25 }}>
                <span aria-hidden className="pr-3 font-display italic text-accent">«</span>
                {quote.text}
                <span aria-hidden className="pl-2 font-display italic text-accent">»</span>
              </p>
              <footer className="mt-8 text-[11px] uppercase tracking-[0.28em] text-muted">
                <span className="text-cream">{quote.author}</span>
                <span aria-hidden className="mx-3 text-accent">—</span>
                {quote.role}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center gap-6" data-reveal="fade">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Témoignage précédent"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong text-cream transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Témoignage suivant"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong text-cream transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            →
          </button>
          <div className="ml-4 flex gap-2.5" role="tablist" aria-label="Choisir un témoignage">
            {QUOTES.map((q, i) => (
              <button
                key={q.author}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Témoignage de ${q.author}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-accent" : "w-3 bg-hairline-strong hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
