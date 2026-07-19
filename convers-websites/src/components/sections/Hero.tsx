"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { ASSETS } from "@/lib/assets";
import { useIsTouch } from "@/hooks/useIsTouch";
import { usePrefersReducedMotion, prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import TransitionLink from "@/components/ui/TransitionLink";
import Magnetic from "@/components/ui/Magnetic";

// The WebGL scene is code-split and only ever requested on fine-pointer,
// motion-friendly devices.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollProgress = useRef(0);
  const [sceneActive, setSceneActive] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const withScene = !isTouch && !reduced;

  /* Intro timeline — waits for the preloader wipe. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedNow = prefersReducedMotion();
    const title = section.querySelector<HTMLElement>("[data-hero-title]");
    const items = section.querySelectorAll<HTMLElement>("[data-hero-item]");
    let split: SplitText | null = null;
    let tl: gsap.core.Timeline | null = null;

    gsap.set(items, { autoAlpha: 0 });

    const cancel = onIntroDone(() => {
      if (reducedNow || !title) {
        gsap.to(items, { autoAlpha: 1, duration: 0.8, stagger: 0.1 });
        if (title) gsap.set(title, { autoAlpha: 1 });
        return;
      }
      split = SplitText.create(title, { type: "words,chars" });
      gsap.set(title, { autoAlpha: 1 });
      tl = gsap.timeline();
      // Per-word rise with a soft blur — the signature reveal.
      tl.from(split.words, {
        yPercent: 60,
        autoAlpha: 0,
        filter: "blur(10px)",
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
      })
        .to(items, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, "-=0.55")
        .from(
          items,
          { y: 26, duration: 0.9, stagger: 0.12, ease: "power3.out", clearProps: "transform" },
          "<",
        );
    });

    return () => {
      cancel();
      tl?.kill();
      split?.revert();
    };
  }, []);

  /* Scroll behavior: parallax + veil dissolve + scene sleep. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reducedNow = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
        onLeave: () => setSceneActive(false),
        onEnterBack: () => setSceneActive(true),
      });

      if (!reducedNow) {
        gsap.to("[data-hero-content]", {
          yPercent: -14,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "72% top", scrub: true },
        });
        gsap.fromTo(
          "[data-hero-media]",
          { scale: 1 },
          {
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  /* Pause the loop when reduced motion is on. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else video.play().catch(() => {});
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="Accueil"
      aria-label="Convers Websites — studio de création"
      className="relative flex min-h-[100svh] items-center overflow-clip"
    >
      {/* ── Media stack: poster → loop video → WebGL veil → scrims ── */}
      <div data-hero-media className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 110% at 50% 10%, #131318 0%, #0b0b0d 60%, #0b0b0d 100%)",
          }}
        />
        {!videoFailed && !reduced && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={ASSETS.hero.loop}
            poster={ASSETS.hero.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            onError={() => setVideoFailed(true)}
          />
        )}
        {(videoFailed || reduced) && (
          // eslint-disable-next-line @next/next/no-img-element -- poster fallback with graceful onError
          <img
            src={ASSETS.hero.poster}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        )}
      </div>

      {withScene && (
        <div className="absolute inset-0" aria-hidden>
          <HeroScene scrollRef={scrollProgress} active={sceneActive} />
        </div>
      )}

      {/* Cinematic scrim so type always sits on near-black */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,11,13,0.55) 0%, rgba(11,11,13,0.18) 35%, rgba(11,11,13,0.62) 78%, #0b0b0d 100%)",
        }}
      />

      {/* ── Content ── */}
      <div data-hero-content className="container-site relative z-(--z-content) pt-28 pb-36 text-center">
        <p data-hero-item className="eyebrow eyebrow--bare justify-center opacity-0">
          <span className="inline-block h-px w-8 bg-accent align-middle" aria-hidden />
          <span>Studio créatif — Paris · Casablanca</span>
          <span className="inline-block h-px w-8 bg-accent align-middle" aria-hidden />
        </p>

        <h1
          data-hero-title
          className="headline invisible mx-auto mt-8 max-w-6xl text-cream"
          style={{ fontSize: "var(--text-hero)" }}
        >
          L&apos;art de la{" "}
          <em className="font-light italic">
            première impression<span className="text-accent">.</span>
          </em>
        </h1>

        <p data-hero-item className="mx-auto mt-8 max-w-xl text-balance opacity-0 text-lg leading-relaxed text-muted">
          Sites d&apos;exception et films publicitaires cinématiques, pour les marques qui refusent
          l&apos;ordinaire.
        </p>

        <div data-hero-item className="mt-11 flex flex-wrap items-center justify-center gap-5 opacity-0">
          <Magnetic>
            <TransitionLink href="/contact" className="btn-pill btn-pill--solid" data-cursor="link">
              Démarrer un projet
            </TransitionLink>
          </Magnetic>
          <TransitionLink
            href="/#realisations"
            className="link-under text-[12px] uppercase tracking-[0.25em] text-cream/80 hover:text-cream"
          >
            Voir les réalisations
            <span aria-hidden className="text-accent">↓</span>
          </TransitionLink>
        </div>

        {/* Trust row — fades in last */}
        <div
          data-hero-item
          className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-0 text-[11px] uppercase tracking-[0.25em] text-muted"
        >
          <span>
            <span className="text-accent" aria-hidden>★★★★★</span> 5,0 clients
          </span>
          <span className="hidden h-3 w-px bg-hairline-strong sm:block" aria-hidden />
          <span>40+ projets livrés</span>
          <span className="hidden h-3 w-px bg-hairline-strong sm:block" aria-hidden />
          <span>Sites & films — un seul studio</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-item
        className="absolute bottom-8 left-1/2 z-(--z-content) flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted">Faites défiler</span>
        <span className="relative block h-12 w-px overflow-clip bg-hairline">
          <span
            className="absolute left-0 top-0 h-1/2 w-full bg-accent"
            style={{ animation: reduced ? "none" : "cue-drop 1.8s var(--ease-luxe) infinite" }}
          />
        </span>
      </div>
    </section>
  );
}
