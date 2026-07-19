"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useReveal } from "@/hooks/useReveal";
import TransitionLink from "@/components/ui/TransitionLink";
import Magnetic from "@/components/ui/Magnetic";

const PILLARS = [
  {
    number: "01",
    title: "Création de sites",
    intro:
      "Un site Convers n'est pas un gabarit rempli — c'est une pièce dessinée sur mesure, du premier wireframe au dernier easing. Nous concevons des expériences qui font ressentir la marque en trois secondes, puis la font comprendre en trente.",
    capabilities: [
      ["Sites vitrines d'exception", "L'image de marque portée à l'écran — éditorial, cinématique, inoubliable."],
      ["E-commerce sensoriel", "Vendre sans crier : parcours courts, matière, lumière, conversion."],
      ["Expériences 3D & WebGL", "Configurateurs, objets manipulables, shaders — la technologie au service de l'émotion."],
      ["SEO & performance", "La beauté n'excuse rien : Core Web Vitals, accessibilité, référencement."],
    ],
  },
  {
    number: "02",
    title: "Films publicitaires",
    intro:
      "La moitié cinéma du studio. Films de marque, spots produit, contenus sociaux : nous écrivons, cadrons et produisons des images qui donnent aux marques un battement de plus.",
    capabilities: [
      ["Films de marque", "Le manifeste de votre maison, en mouvement — 45 secondes qui restent."],
      ["Publicités produit", "L'objet magnifié : lumière sculptée, macro, matière."],
      ["Contenu social & campagnes", "Des déclinaisons pensées par plateforme, jamais recadrées à la hâte."],
      ["Motion design & IA cinématique", "Génération photoréaliste, motion, compositing — la nouvelle grammaire du studio."],
    ],
  },
] as const;

export default function ServicesView() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const title = root.querySelector<HTMLElement>("[data-page-title]");
    let split: SplitText | null = null;
    const cancel = onIntroDone(() => {
      if (!title) return;
      if (prefersReducedMotion()) {
        gsap.set(title, { autoAlpha: 1 });
        return;
      }
      split = SplitText.create(title, { type: "words" });
      gsap.set(title, { autoAlpha: 1 });
      gsap.from(split.words, {
        yPercent: 60,
        autoAlpha: 0,
        filter: "blur(8px)",
        duration: 1,
        ease: "power4.out",
        stagger: 0.07,
        delay: 0.1,
      });
    });
    return () => {
      cancel();
      split?.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className="relative overflow-clip pb-24 pt-48">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/3 left-1/2 h-[50rem] w-[70rem] -translate-x-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, var(--accent) 0%, transparent 62%)" }}
        />
        <div className="container-site relative">
          <p className="eyebrow">Services</p>
          <h1 data-page-title className="headline invisible mt-8 max-w-4xl text-cream" style={{ fontSize: "var(--text-hero)" }}>
            Deux métiers, <em className="font-light italic">une signature.</em>
          </h1>
          <p className="mt-10 max-w-xl leading-relaxed text-muted" data-reveal="up">
            Le site raconte, le film émeut — et chez Convers, les deux naissent de la même main.
            Une direction artistique unique, portée du premier pixel à la dernière image.
          </p>
        </div>
      </section>

      {/* Pillars */}
      {PILLARS.map((pillar, i) => (
        <section key={pillar.number} className="border-t border-hairline">
          <div className="container-site grid gap-14 py-24 lg:grid-cols-[1fr_1.3fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <span className="font-display text-sm italic text-accent" data-reveal="fade">
                ({pillar.number})
              </span>
              <h2 className="headline mt-4 text-cream" style={{ fontSize: "var(--text-h2)" }} data-reveal="lines">
                {pillar.title}
              </h2>
              <p className="mt-8 max-w-md leading-loose text-muted" data-reveal="up">
                {pillar.intro}
              </p>
            </div>
            <dl>
              {pillar.capabilities.map(([name, desc], j) => (
                <div
                  key={name}
                  className="group border-t border-hairline py-8 transition-[padding-left] duration-500 hover:pl-4"
                  data-reveal="up"
                  data-reveal-delay={String(j * 0.06)}
                >
                  <dt className="flex items-baseline justify-between gap-6">
                    <span className="font-display text-2xl text-cream md:text-3xl">{name}</span>
                    <span aria-hidden className="text-muted transition-colors duration-300 group-hover:text-accent">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                  </dt>
                  <dd className="mt-3 max-w-md text-sm leading-relaxed text-muted">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
          {i === 0 && (
            <div aria-hidden className="container-site">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            </div>
          )}
        </section>
      ))}

      {/* CTA */}
      <section className="border-t border-hairline">
        <div className="container-site flex flex-col items-start gap-8 py-28 md:flex-row md:items-center md:justify-between">
          <p className="headline max-w-xl text-cream" style={{ fontSize: "var(--text-h3)" }} data-reveal="lines">
            Un site, un film — <em className="font-light italic">ou les deux&nbsp;?</em>
          </p>
          <div data-reveal="up">
            <Magnetic>
              <TransitionLink href="/contact" className="btn-pill" data-cursor="link">
                Démarrer un projet
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
