"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import TransitionLink from "@/components/ui/TransitionLink";
import { useReveal } from "@/hooks/useReveal";
import { useIsTouch } from "@/hooks/useIsTouch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SERVICES = [
  {
    number: "01",
    title: "Création de sites",
    lead: "Des sites pensés comme des expériences — dessinés pour marquer, construits pour convertir.",
    items: ["Sites vitrines d'exception", "E-commerce sensoriel", "Expériences 3D & WebGL", "SEO & performance"],
  },
  {
    number: "02",
    title: "Films publicitaires",
    lead: "Des images qui font battre les marques — du spot produit au film de marque cinématique.",
    items: ["Films de marque", "Publicités produit", "Contenu social & campagnes", "Motion design & IA cinématique"],
  },
] as const;

function ServiceCard({ service, delay }: { service: (typeof SERVICES)[number]; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  // Limited 3D tilt + a gold halo that follows the cursor.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouch || reduced) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 5);
    rotateX.set((0.5 - py) * 5);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      data-reveal="up"
      data-reveal-delay={String(delay)}
      className="group"
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative overflow-clip border border-hairline bg-surface p-9 transition-colors duration-500 hover:border-accent/40 md:p-14"
      >
        {/* Cursor-following halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(28rem circle at var(--mx, 50%) var(--my, 50%), rgba(201,162,75,0.09), transparent 65%)",
          }}
        />
        {/* Top hairline that draws in gold on hover */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 group-hover:scale-x-100"
          style={{ transitionTimingFunction: "var(--ease-luxe)" }}
        />

        <div className="flex items-start justify-between">
          <span className="font-display text-sm italic text-accent">({service.number})</span>
          <span
            aria-hidden
            className="text-muted transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
          >
            ↗
          </span>
        </div>

        <h3 className="headline mt-10 text-cream" style={{ fontSize: "var(--text-h3)" }}>
          {service.title}
        </h3>
        <p className="mt-5 max-w-md leading-relaxed text-muted">{service.lead}</p>

        <ul className="mt-10">
          {service.items.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between border-t border-hairline py-4 text-sm text-cream/85 transition-[padding-left] duration-300 hover:pl-2"
            >
              {item}
              <span aria-hidden className="h-1 w-1 rounded-full bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </li>
          ))}
        </ul>

        <TransitionLink
          href="/services"
          className="link-under mt-10 inline-flex text-[11px] uppercase tracking-[0.28em] text-accent"
          data-cursor="view"
        >
          Explorer <span aria-hidden>→</span>
        </TransitionLink>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  return (
    <section ref={sectionRef} id="services" data-section="Services" className="section-pad relative">
      <div className="container-site">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow" data-reveal="fade">Ce que nous faisons</p>
            <h2 className="headline mt-6 text-cream" style={{ fontSize: "var(--text-h2)" }} data-reveal="lines">
              Deux métiers.
              <br />
              Une exigence.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted" data-reveal="up">
            Votre site et vos films naissent au même endroit — même direction artistique, même
            niveau d&apos;exigence, zéro dilution.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.number} service={s} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
