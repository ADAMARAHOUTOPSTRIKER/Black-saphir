# Convers Websites — site vitrine du studio

Site marketing haut de gamme du studio **Convers Websites** (création de sites d'exception + films publicitaires). Direction artistique « quiet luxury, cinematic dark » : charbon `#0B0B0D`, crème `#F4F1EA`, accent or `#C9A24B`.

## Démarrer

```bash
cd convers-websites
npm install
npm run dev        # → http://localhost:3000
```

`npm run dev` (et `npm run build`) lancent d'abord `scripts/fetch-assets.mjs`, qui télécharge une seule fois les médias générés (Higgsfield) dans `public/assets/`. Sans réseau, le site affiche des blocs charbon étiquetés à la place des médias — relancez `npm run fetch:assets` plus tard.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- **GSAP 3.15** (ScrollTrigger, SplitText) — tout le travail au scroll
- **Lenis** — momentum scroll
- **@react-three/fiber + drei** — le « gold veil » shader du hero (code-splitté, désactivé au tactile et en reduced-motion)
- **Framer Motion** — transitions d'état des composants (menu, carrousel, formulaire)
- Polices variables auto-hébergées (Fraunces / Inter / Oswald via fontsource, `src/fonts/`)

## Structure

```
src/
├─ app/                    # routes : / , /services , /contact , /work/[slug] (×4), 404
├─ components/
│  ├─ chrome/              # Preloader, Cursor, Grain, Header, Footer, SectionDots, FloatingContact
│  ├─ providers/           # SmoothScroll (Lenis), TransitionProvider (wipe or/charbon)
│  ├─ sections/            # une section homepage = un composant (Hero, Manifesto, …)
│  ├─ work/ services/ contact/  # vues des pages internes
│  └─ ui/                  # TransitionLink, Magnetic, Media (fallback des médias)
├─ hooks/                  # useReveal, useMagnetic, useIsTouch, usePrefersReducedMotion
├─ lib/                    # gsap.ts (plugins), assets.ts, intro.ts, data/ (copies éditables)
├─ styles/tokens.css       # LA source des couleurs / échelles / easings — changez l'or ici
└─ fonts/                  # woff2 variables auto-hébergées
scripts/
├─ fetch-assets.mjs        # manifeste + téléchargement des médias générés
└─ make-textures.mjs       # grain.png + glow.png procéduraux (déjà commités)
```

## Où éditer quoi

| Quoi | Où |
| --- | --- |
| Couleurs, échelle typo, easings | `src/styles/tokens.css` |
| Nav, footer, email, réseaux | `src/lib/data/site.ts` |
| Projets / études de cas | `src/lib/data/projects.ts` |
| Médias (hero, covers, showreel) | `public/assets/` + `src/lib/assets.ts` |
| Copies des sections | directement dans `src/components/sections/*` |

## Motion & accessibilité

- `useReveal` : reveals déclaratifs par attribut `data-reveal="up|fade|mask|lines|words"`.
- `prefers-reduced-motion` : Lenis coupé, vidéos remplacées par leurs posters, WebGL désactivé, reveals réduits à des fondus.
- Tactile : curseur custom, hover magnétiques et scène WebGL désactivés ; galerie horizontale → pile verticale.
- Navigation clavier : skip-link, focus visibles or, carrousel témoignages contrôlable.

## Notes assets

- Les images téléchargées existent en deux versions : `<nom>.webp` (servie) et `<nom>-raw.png` (master 2752×1536 pour ré-export). Si un webp paraît doux sur très grand écran, ré-exportez depuis le `-raw.png`.
- `public/.gitignore` exclut les médias téléchargés du dépôt ; pour déployer avec les médias commités, supprimez ces lignes après un `fetch:assets` réussi.
