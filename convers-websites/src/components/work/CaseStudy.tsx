"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useReveal } from "@/hooks/useReveal";
import { MediaImage } from "@/components/ui/Media";
import TransitionLink from "@/components/ui/TransitionLink";
import Magnetic from "@/components/ui/Magnetic";
import type { Project } from "@/lib/data/projects";

/**
 * Case-study template — lighter than the homepage but same DNA:
 * cinematic hero, challenge, approach, two visuals, next project.
 */
export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  /* Hero title reveal + cover parallax */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = prefersReducedMotion();
    const title = root.querySelector<HTMLElement>("[data-case-title]");
    let split: SplitText | null = null;

    const cancel = onIntroDone(() => {
      if (!title) return;
      if (reduced) {
        gsap.set(title, { autoAlpha: 1 });
        return;
      }
      split = SplitText.create(title, { type: "chars" });
      gsap.set(title, { autoAlpha: 1 });
      gsap.from(split.chars, {
        yPercent: 70,
        autoAlpha: 0,
        filter: "blur(8px)",
        duration: 1,
        ease: "power4.out",
        stagger: 0.03,
        delay: 0.15,
      });
    });

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        "[data-case-cover]",
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-case-hero]", start: "top top", end: "bottom top", scrub: true },
        },
      );
    }, root);

    return () => {
      cancel();
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* ── Hero ── */}
      <section data-case-hero className="relative flex min-h-[92svh] items-end overflow-clip">
        <div className="absolute inset-0" data-case-cover>
          <MediaImage
            src={project.cover}
            alt={`${project.title} — visuel principal`}
            label={`${project.title} — cover`}
            className="h-full w-full"
            loading="eager"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,11,13,0.5) 0%, rgba(11,11,13,0.15) 40%, rgba(11,11,13,0.86) 88%, #0b0b0d 100%)",
          }}
        />
        <div className="container-site relative z-(--z-content) pb-20 pt-44">
          <p className="eyebrow">
            {project.sector} · {project.year}
          </p>
          <h1
            data-case-title
            className="headline invisible mt-6 text-cream"
            style={{ fontSize: "var(--text-hero)" }}
          >
            {project.title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-hairline-strong px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cream/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="section-pad">
        <div className="container-site">
          <p
            className="headline invisible max-w-4xl text-cream"
            style={{ fontSize: "var(--text-h3)", lineHeight: 1.3 }}
            data-reveal="lines"
          >
            {project.intro}
          </p>
        </div>
      </section>

      {/* ── Challenge / Approach ── */}
      <section className="border-t border-hairline">
        <div className="container-site grid gap-16 py-24 lg:grid-cols-2">
          <div data-reveal="up">
            <p className="eyebrow">Le défi</p>
            <p className="mt-8 max-w-lg leading-loose text-cream/85">{project.challenge}</p>
          </div>
          <div data-reveal="up" data-reveal-delay="0.12">
            <p className="eyebrow">L&apos;approche</p>
            <p className="mt-8 max-w-lg leading-loose text-cream/85">{project.approach}</p>
          </div>
        </div>
      </section>

      {/* ── Visuals ── */}
      <section className="container-site grid gap-6 pb-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div data-reveal="mask">
          <MediaImage
            src={project.detail}
            alt={`${project.title} — détail`}
            label={`${project.title} — detail`}
            className="aspect-[16/10] w-full"
          />
        </div>
        <div data-reveal="mask" data-reveal-delay="0.1">
          <MediaImage
            src={project.cover}
            alt={`${project.title} — vue alternative`}
            label={`${project.title} — cover`}
            className="aspect-[4/5] w-full"
          />
        </div>
      </section>

      {/* ── Quote ── */}
      {project.quote && (
        <section className="section-pad">
          <div className="container-site text-center">
            <blockquote data-reveal="words" className="invisible">
              <p className="headline mx-auto max-w-3xl text-cream" style={{ fontSize: "var(--text-h2)", lineHeight: 1.15 }}>
                «&nbsp;{project.quote.text}&nbsp;»
              </p>
              <footer className="mt-8 text-[11px] uppercase tracking-[0.3em] text-muted">
                {project.quote.author}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* ── Next project ── */}
      <section className="border-t border-hairline">
        <TransitionLink
          href={`/work/${next.slug}`}
          data-cursor="view"
          className="group block"
          aria-label={`Projet suivant : ${next.title}`}
        >
          <div className="container-site flex flex-col gap-4 py-24 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Projet suivant</p>
              <p
                className="headline mt-4 text-cream transition-colors duration-500 group-hover:text-accent"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {next.title}
              </p>
            </div>
            <Magnetic>
              <span
                aria-hidden
                className="flex h-20 w-20 items-center justify-center rounded-full border border-hairline-strong text-2xl text-cream transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg"
              >
                →
              </span>
            </Magnetic>
          </div>
        </TransitionLink>
      </section>
    </div>
  );
}
