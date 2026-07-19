"use client";

import { useRef } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import { SITE } from "@/lib/data/site";
import { useReveal } from "@/hooks/useReveal";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Création de sites", href: "/services" },
      { label: "Films publicitaires", href: "/services" },
      { label: "Direction artistique", href: "/services" },
      { label: "3D & WebGL", href: "/services" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Manifeste", href: "/#studio" },
      { label: "Processus", href: "/#processus" },
      { label: "Témoignages", href: "/#temoignages" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Réalisations",
    links: [
      { label: "Obsidienne", href: "/work/obsidienne" },
      { label: "Marsa — Club Nautique", href: "/work/marsa" },
      { label: "Sentia", href: "/work/sentia" },
      { label: "OpticVision", href: "/work/opticvision" },
    ],
  },
] as const;

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <footer ref={ref} className="relative overflow-clip border-t border-hairline bg-surface">
      {/* Ambient gold breath in the backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)" }}
      />

      <div className="container-site relative">
        <div className="grid gap-14 py-20 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
          <div data-reveal="up">
            <TransitionLink href="/" className="font-display text-2xl tracking-[0.28em] text-cream">
              {SITE.logotype}
              <span className="pl-1 align-super text-xs text-accent">®</span>
            </TransitionLink>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              Sites d&apos;exception et films publicitaires cinématiques, pour les marques qui
              refusent l&apos;ordinaire.
            </p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-muted">{SITE.locations}</p>
            <a
              href={`mailto:${SITE.email}`}
              className="link-under mt-3 inline-block text-sm text-accent"
            >
              {SITE.email}
            </a>
          </div>

          {COLUMNS.map((col, i) => (
            <nav key={col.title} aria-label={col.title} data-reveal="up" data-reveal-delay={String(0.08 * (i + 1))}>
              <h3 className="eyebrow eyebrow--bare mb-6">{col.title}</h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <TransitionLink
                      href={link.href}
                      className="link-under text-sm text-cream/80 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-6 border-t border-hairline py-8 text-[11px] uppercase tracking-[0.22em] text-muted md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} {SITE.name} — Tous droits réservés</span>
          <div className="flex gap-7">
            {SITE.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-under transition-colors hover:text-cream"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
