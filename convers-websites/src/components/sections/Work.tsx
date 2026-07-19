"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/lib/data/projects";
import TransitionLink from "@/components/ui/TransitionLink";
import { MediaImage } from "@/components/ui/Media";
import { useReveal } from "@/hooks/useReveal";

/**
 * Selected work. Desktop fine-pointer: the section pins and the gallery
 * travels horizontally with a per-cover counter-parallax. Mobile /
 * reduced motion: a calm vertical stack with standard reveals.
 */
export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useReveal(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
      () => {
        const getDistance = () => track.scrollWidth - window.innerWidth;
        // Main horizontal drive — scroll distance mirrors track length 1:1.
        const drive = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        // Covers drift against the travel for depth.
        track.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                containerAnimation: drive,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="realisations"
      data-section="Réalisations"
      className="relative overflow-clip border-y border-hairline bg-surface/40"
    >
      <div
        ref={trackRef}
        className="flex w-full flex-col lg:h-screen lg:w-max lg:flex-row lg:items-center"
      >
        {/* Intro panel */}
        <div className="container-site flex flex-col justify-center py-24 lg:h-full lg:w-[38vw] lg:flex-none lg:py-0">
          <p className="eyebrow" data-reveal="fade">Réalisations</p>
          <h2 className="headline mt-6 text-cream" style={{ fontSize: "var(--text-h2)" }} data-reveal="lines">
            Une sélection,
            <br />
            <em className="font-light italic">rien de plus.</em>
          </h2>
          <p className="mt-8 max-w-xs text-sm leading-relaxed text-muted" data-reveal="up">
            Quatre univers, une même signature. Faites défiler — chaque projet s&apos;ouvre sur son
            étude de cas.
          </p>
          <p className="mt-12 hidden items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted lg:flex" aria-hidden>
            <span className="h-px w-10 bg-accent" />
            Défilement horizontal
          </p>
        </div>

        {/* Project panels */}
        {PROJECTS.map((project, i) => (
          <article
            key={project.slug}
            className="container-site pb-20 lg:h-full lg:w-[62vw] lg:flex-none lg:px-[4vw] lg:py-0"
          >
            <TransitionLink
              href={`/work/${project.slug}`}
              data-cursor="view"
              className="group flex h-full flex-col justify-center outline-offset-8"
              aria-label={`${project.title} — voir l'étude de cas`}
            >
              <div data-reveal="mask" className="relative">
                <div className="relative aspect-[16/10] overflow-clip lg:aspect-[16/9] lg:max-h-[58vh]">
                  {/* data-parallax wrapper drifts ±7% against the gallery travel;
                      the cover is over-scaled so no edges ever show. */}
                  <div data-parallax className="absolute inset-0">
                    <MediaImage
                      src={project.cover}
                      alt={`${project.title} — ${project.sector}`}
                      label={`${project.title} — cover`}
                      className="h-full w-full"
                      imgClassName="scale-[1.18] transition-transform duration-[1.4s] group-hover:scale-[1.1]"
                      style={{ transitionTimingFunction: "var(--ease-luxe)" }}
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-20"
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="font-display text-sm italic text-accent">
                    ({String(i + 1).padStart(2, "0")})
                  </span>
                  <h3 className="headline mt-2 inline-block pl-0 text-cream lg:pl-4" style={{ fontSize: "var(--text-h3)" }}>
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-muted">{project.pitch}</p>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label="Étiquettes">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-hairline px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 group-hover:border-accent/40 group-hover:text-cream/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </TransitionLink>
          </article>
        ))}

        {/* Outro panel — invitation */}
        <div className="container-site hidden h-full w-[30vw] flex-none flex-col items-start justify-center lg:flex">
          <p className="headline max-w-[16ch] text-cream" style={{ fontSize: "var(--text-h3)" }}>
            Votre projet, <em className="font-light italic">le prochain&nbsp;?</em>
          </p>
          <TransitionLink
            href="/contact"
            className="link-under mt-8 text-[11px] uppercase tracking-[0.28em] text-accent"
          >
            Parlons-en <span aria-hidden>→</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
