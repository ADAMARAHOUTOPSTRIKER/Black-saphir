import TransitionLink from "@/components/ui/TransitionLink";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center text-center">
      <p className="eyebrow eyebrow--bare">Erreur 404</p>
      <h1 className="headline mt-6 text-cream" style={{ fontSize: "var(--text-hero)" }}>
        Page <em className="font-light italic">introuvable.</em>
      </h1>
      <p className="mt-6 max-w-sm text-muted">
        Cette page n&apos;existe pas — ou plus. Le meilleur reste à l&apos;accueil.
      </p>
      <TransitionLink href="/" className="btn-pill mt-10" data-cursor="link">
        Retour à l&apos;accueil
      </TransitionLink>
    </section>
  );
}
