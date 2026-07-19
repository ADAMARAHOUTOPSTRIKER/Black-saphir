"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Magnetic from "@/components/ui/Magnetic";

/**
 * The video half of the brand: a cinematic band that grows to full bleed
 * as it enters, then plays the reel with sound on click.
 */
export default function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { scale: 0.9, borderRadius: "1.25rem" },
        {
          scale: 1,
          borderRadius: "0rem",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 85%", end: "top 15%", scrub: 0.5 },
        },
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const start = () => {
    const video = videoRef.current;
    if (!video || failed) return;
    video.currentTime = 0;
    video.muted = false;
    video.controls = true;
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setFailed(true));
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.controls = false;
    setPlaying(false);
  };

  return (
    <section
      ref={sectionRef}
      id="showreel"
      data-section="Showreel"
      className="section-pad relative overflow-clip"
    >
      <div className="container-site mb-12 flex items-end justify-between">
        <div>
          <p className="eyebrow">Le film d&apos;abord</p>
          <h2 className="headline-condensed mt-6 text-cream" style={{ fontSize: "var(--text-h2)" }}>
            Showreel
            <span className="text-accent">.</span>
          </h2>
        </div>
        <p className="hidden text-[11px] uppercase tracking-[0.3em] text-muted md:block">
          Publicité · Marque · Motion — 2026
        </p>
      </div>

      <div ref={frameRef} className="relative mx-auto aspect-video w-full max-w-[110rem] overflow-clip bg-surface">
        {failed ? (
          <div
            role="img"
            aria-label="Showreel Convers Websites"
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "radial-gradient(120% 120% at 30% 20%, #1a1a21 0%, #101014 55%, #0b0b0d 100%)",
            }}
          >
            <span className="px-6 text-center text-[10px] uppercase tracking-[0.3em] text-muted">
              Showreel — reel.mp4
              <br />
              <span className="text-accent/70">npm run fetch:assets</span>
            </span>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={ASSETS.showreel.reel}
            poster={ASSETS.showreel.poster}
            preload="metadata"
            playsInline
            onError={() => setFailed(true)}
            onEnded={stop}
            aria-label="Showreel — films publicitaires Convers Websites"
          />
        )}

        {/* Dark cinematic framing + play affordance */}
        {!playing && (
          <button
            type="button"
            onClick={start}
            data-cursor="play"
            aria-label="Lire le showreel avec le son"
            className="group absolute inset-0 flex items-center justify-center bg-bg/35 transition-colors duration-500 hover:bg-bg/20"
          >
            <Magnetic strength={22}>
              <span className="accent-glow relative flex h-24 w-24 items-center justify-center rounded-full border border-accent/70 bg-bg/60 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 md:h-28 md:w-28">
                <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden className="translate-x-0.5 text-cream">
                  <path d="M0 0 L22 13 L0 26 Z" fill="currentColor" />
                </svg>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-accent/30"
                  style={{ animation: "ping-slow 2.6s var(--ease-out-expo) infinite" }}
                />
              </span>
            </Magnetic>
            <span className="absolute bottom-8 text-[11px] uppercase tracking-[0.35em] text-cream/80">
              Lire avec le son
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
