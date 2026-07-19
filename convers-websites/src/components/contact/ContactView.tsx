"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";
import Magnetic from "@/components/ui/Magnetic";
import { SITE } from "@/lib/data/site";

type Errors = Partial<Record<"name" | "email" | "type" | "message", string>>;

const PROJECT_TYPES = ["Site", "Film publicitaire", "Site + film", "Autre"] as const;
const BUDGETS = ["< 10 k€", "10 – 25 k€", "25 – 50 k€", "> 50 k€", "À définir"] as const;

const FIELD_CLASSES =
  "peer w-full border-b border-hairline-strong bg-transparent py-4 text-cream placeholder-transparent outline-none transition-colors duration-300 focus:border-accent";
const LABEL_CLASSES =
  "pointer-events-none absolute left-0 top-4 text-sm text-muted transition-all duration-300 " +
  "peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm " +
  "peer-focus:-top-3 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-accent " +
  "peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]";

export default function ContactView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [type, setType] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  useReveal(rootRef);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = "Dites-nous qui vous êtes.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Cette adresse ne semble pas valide.";
    if (!type) next.type = "Choisissez un type de projet.";
    if (message.length < 20) next.message = "Quelques mots de plus — 20 caractères minimum.";

    setErrors(next);
    if (Object.keys(next).length === 0) {
      // Pas de backend branché : on confirme localement et on garde un
      // relais mailto visible dans l'écran de succès.
      setSent(true);
    }
  };

  return (
    <div ref={rootRef}>
      <section className="relative overflow-clip pb-28 pt-48">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/4 right-0 h-[40rem] w-[40rem] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)" }}
        />
        <div className="container-site relative grid gap-20 lg:grid-cols-[1fr_1.2fr]">
          {/* Left — invitation */}
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="headline invisible mt-8 text-cream" style={{ fontSize: "var(--text-hero)" }} data-reveal="words">
              Parlons de <em className="font-light italic">votre projet.</em>
            </h1>
            <p className="mt-10 max-w-md leading-relaxed text-muted" data-reveal="up">
              Un brief de trois lignes suffit pour commencer. Nous répondons sous 48&nbsp;h — avec
              de vraies questions, pas un devis automatique.
            </p>
            <div className="mt-14 space-y-3 text-sm" data-reveal="up" data-reveal-delay="0.1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Directement</p>
              <p>
                <a href={`mailto:${SITE.email}`} className="link-under text-cream">
                  {SITE.email}
                </a>
              </p>
              <p>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="link-under text-cream">
                  {SITE.phone}
                </a>
              </p>
              <p className="pt-4 text-[10px] uppercase tracking-[0.3em] text-muted">{SITE.locations}</p>
            </div>
          </div>

          {/* Right — form / success */}
          <div className="relative min-h-[34rem]" data-reveal="up" data-reveal-delay="0.15">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col items-start justify-center border border-hairline bg-surface p-12"
                >
                  <span className="accent-glow flex h-16 w-16 items-center justify-center rounded-full border border-accent text-accent" aria-hidden>
                    ✓
                  </span>
                  <p className="headline mt-8 text-cream" style={{ fontSize: "var(--text-h3)" }}>
                    Message bien reçu.
                  </p>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                    Nous revenons vers vous sous 48&nbsp;h. Pour joindre des références ou un
                    cahier des charges, écrivez-nous directement&nbsp;:
                  </p>
                  <a href={`mailto:${SITE.email}`} className="link-under mt-6 text-accent">
                    {SITE.email}
                  </a>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={onSubmit}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-10"
                >
                  <div className="grid gap-10 md:grid-cols-2">
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Nom"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "err-name" : undefined}
                        className={FIELD_CLASSES}
                      />
                      <label htmlFor="name" className={LABEL_CLASSES}>
                        Votre nom *
                      </label>
                      {errors.name && (
                        <p id="err-name" role="alert" className="mt-2 text-xs text-accent">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "err-email" : undefined}
                        className={FIELD_CLASSES}
                      />
                      <label htmlFor="email" className={LABEL_CLASSES}>
                        Votre email *
                      </label>
                      {errors.email && (
                        <p id="err-email" role="alert" className="mt-2 text-xs text-accent">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Société"
                      autoComplete="organization"
                      className={FIELD_CLASSES}
                    />
                    <label htmlFor="company" className={LABEL_CLASSES}>
                      Votre marque / société
                    </label>
                  </div>

                  {/* Project type — pill radio group */}
                  <fieldset>
                    <legend className="text-[10px] uppercase tracking-[0.3em] text-muted">
                      Type de projet *
                    </legend>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {PROJECT_TYPES.map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-full border px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-accent ${
                            type === option
                              ? "border-accent bg-accent text-bg"
                              : "border-hairline-strong text-muted hover:border-accent/60 hover:text-cream"
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={option}
                            checked={type === option}
                            onChange={() => setType(option)}
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.type && (
                      <p role="alert" className="mt-3 text-xs text-accent">
                        {errors.type}
                      </p>
                    )}
                  </fieldset>

                  {/* Budget */}
                  <fieldset>
                    <legend className="text-[10px] uppercase tracking-[0.3em] text-muted">Budget indicatif</legend>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {BUDGETS.map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-full border px-5 py-2.5 text-xs tracking-[0.1em] transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-accent ${
                            budget === option
                              ? "border-accent text-accent"
                              : "border-hairline-strong text-muted hover:border-accent/60 hover:text-cream"
                          }`}
                        >
                          <input
                            type="radio"
                            name="budget"
                            value={option}
                            checked={budget === option}
                            onChange={() => setBudget(option)}
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Message"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "err-message" : undefined}
                      className={`${FIELD_CLASSES} resize-none`}
                    />
                    <label htmlFor="message" className={LABEL_CLASSES}>
                      Votre projet, en quelques lignes *
                    </label>
                    {errors.message && (
                      <p id="err-message" role="alert" className="mt-2 text-xs text-accent">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Magnetic strength={20}>
                    <button type="submit" className="btn-pill btn-pill--solid !px-12" data-cursor="link">
                      Envoyer
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
