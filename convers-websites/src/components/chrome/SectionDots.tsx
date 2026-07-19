"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";

type SectionInfo = { id: string; label: string };

/**
 * Marsa-style section indicator dots, right edge, desktop only.
 * Scans the page for [data-section] landmarks after mount.
 */
export default function SectionDots() {
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sections are discovered from the DOM, post-mount by nature.
    setSections(nodes.map((n) => ({ id: n.id, label: n.dataset.section ?? n.id })));

    const triggers = nodes.map((node, i) =>
      ScrollTrigger.create({
        trigger: node,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Sections de la page"
      className="fixed right-6 top-1/2 z-(--z-header) hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex"
    >
      {sections.map((section, i) => (
        <button
          key={section.id}
          type="button"
          aria-label={`Aller à ${section.label}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => {
            const el = document.getElementById(section.id);
            if (!el) return;
            if (lenis) lenis.scrollTo(el, { duration: 1.6 });
            else el.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative flex h-4 w-4 items-center justify-center"
        >
          <span
            className={`block rounded-full transition-all duration-500 ${
              i === active
                ? "h-2 w-2 bg-accent shadow-[0_0_10px_2px_rgba(201,162,75,0.4)]"
                : "h-1.5 w-1.5 bg-hairline-strong group-hover:bg-muted"
            }`}
          />
          <span className="pointer-events-none absolute right-6 whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {section.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
