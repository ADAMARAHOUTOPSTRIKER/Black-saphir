"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TransitionLink from "@/components/ui/TransitionLink";
import Magnetic from "@/components/ui/Magnetic";
import { NAV, SITE } from "@/lib/data/site";
import { useLenis } from "@/components/providers/SmoothScroll";

/**
 * Fixed header: logotype left, spaced-caps nav, gold pill CTA.
 * Blurs in once scrolled; hides on scroll-down, returns on scroll-up.
 */
export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 160);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the menu is open.
  useEffect(() => {
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-(--z-header) transition-[transform,background-color,backdrop-filter] duration-500",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          scrolled && !menuOpen ? "bg-bg/70 backdrop-blur-md" : "bg-transparent",
        ].join(" ")}
        style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
      >
        <div className="container-site flex h-(--header-h) items-center justify-between border-b border-hairline">
          <TransitionLink
            href="/"
            aria-label="Convers Websites — accueil"
            className="font-display text-lg tracking-[0.28em] text-cream"
          >
            {SITE.logotype}
            <span className="pl-1 align-super text-[10px] text-accent">®</span>
          </TransitionLink>

          <nav aria-label="Navigation principale" className="hidden items-center gap-10 lg:flex">
            {NAV.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="link-under text-[11px] font-medium uppercase tracking-[0.28em] text-muted transition-colors duration-300 hover:text-cream"
              >
                {item.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <Magnetic>
                <TransitionLink href="/contact" className="btn-pill" data-cursor="link">
                  Démarrer un projet
                </TransitionLink>
              </Magnetic>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span
                className={`absolute h-px w-6 bg-cream transition-transform duration-300 ${
                  menuOpen ? "rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute h-px w-6 bg-cream transition-transform duration-300 ${
                  menuOpen ? "-rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-(--z-menu) flex flex-col justify-between bg-bg/97 pb-10 pt-32 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Menu mobile" className="container-site flex flex-col gap-2">
              {[{ label: "Accueil", href: "/" }, ...NAV].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 36, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TransitionLink
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display block border-b border-hairline py-4 text-4xl text-cream"
                  >
                    <span className="pr-4 text-xs tracking-[0.3em] text-accent align-middle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </TransitionLink>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="container-site flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-muted"
            >
              <span>{SITE.locations}</span>
              <a href={`mailto:${SITE.email}`} className="text-accent">
                {SITE.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
