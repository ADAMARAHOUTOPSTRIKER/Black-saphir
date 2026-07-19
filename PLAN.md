# CONVERS — Website Redesign Plan

Brand: **Convers-Websites** (websites + advertisement films).
Goal: an Awwwards-grade agency site where the site itself is the proof of craft.
Reference: developios.com (structure + conversion logic only; its visual DNA was not
observable from this environment). Governing skills: `design-taste-frontend` + `hallmark`.

Status: PLAN ONLY. No production code until the user approves.

---

## 1. Concept

**"The agency whose site is the demo."**
Developios' strongest move (verified): their portfolio is live products, not screenshots.
Convers already has that: four live, cinematic sites (Obsidienne, Marsa, OpticVision,
Sentia). The redesign is built around making visitors *feel* those sites — real captures,
live links, motion everywhere — while the agency site itself demonstrates the same
level of craft it sells.

Narrative arc of the page: arrive inside a film → watch the reel → touch the real work
(live) → understand the two crafts (sites / films) → see the process → contact.

## 2. Design direction (formal skill picks)

### design-taste-frontend
- **Design Read:** "Agency landing for FR-market businesses buying premium websites
  and ad films, with a cinematic studio language, leaning toward dark editorial +
  kinetic type + GSAP choreography."
- **Dials:** `DESIGN_VARIANCE: 9 · MOTION_INTENSITY: 8 · VISUAL_DENSITY: 3`
  (Landing - Agency/creative preset).
- Hard rules inherited: hero stack ≤ 4 text elements, zero em-dashes in page copy,
  eyebrow rationing (≤ 1 per 3 sections), one accent color locked page-wide, no AI-purple,
  no three-equal-cards, WCAG AA, `prefers-reduced-motion` everywhere, 100dvh not 100vh.

### hallmark
- **Genre:** atmospheric. **Theme route:** custom (bespoke) — brief carries explicit
  creative-intent signals (award-level, experimental, brand-specific).
- **Diversification vs previous run in this repo (Black Saphir: light paper /
  high-contrast serif / warm gold):** new build differs on all three axes —
  dark paper / grotesk-display sans / cool accent.
- **Macrostructure:** bespoke, nearest family = Marquee Hero + filmstrip work spine.
- **Nav:** N9 edge-aligned minimal with N10 scroll-morph behavior (compresses to a
  floating chip after the hero). **Footer:** Ft5 Statement.
- Token discipline: every color/font via `tokens.css` custom properties, no inline hex.
  Stamp + `.hallmark/log.json` entry at build time. 58-gate slop test run mid-build
  (after Phase 3) and again at ship, plus the taste-skill Pre-Flight Check.

### Proposed identity tokens (NEEDS USER APPROVAL)
- **Wordmark:** `CONVERS` (display), descriptor "Websites & Films" underneath.
  The hyphenated "Convers-Websites" is kept for legal/footer/SEO text.
- **Paper:** deep neutral charcoal `oklch(14% 0.008 260)` (never pure #000).
- **Ink:** warm off-white `oklch(96% 0.005 90)`.
- **Accent (single, locked):** electric blue `oklch(65% 0.19 255)` — deliberately
  distinct from all four portfolio pieces (Obsidienne red, Marsa/Sentia gold,
  OpticVision sky) so their colors pop inside a neutral frame.
- **Type (self-hosted, license-safe, FR-subset):**
  display = Clash Display (Fontshare), body = Satoshi (Fontshare),
  meta/mono = Space Mono. 2+1 discipline, roman-only headings.

## 3. Site architecture (one-pager, FR default + EN switch)

0. **Preloader** — counter + wordmark, ≤ 1.2 s, choreographed handoff into hero
   (one GSAP master timeline). Skipped on repeat visits (sessionStorage).
1. **Hero** — kinetic type "CONVERS" with masked line reveals (SplitText, real text
   in DOM); background: one Higgsfield cinematic abstract loop (studio light /
   dark chrome fluid) behind a scrim, poster-first for LCP; magnetic CTA
   "Voir le reel"; sound toggle lives in nav. Max 4 text elements.
2. **Showreel** — inline muted loop that FLIP-expands to fullscreen with sound
   (if a licensed track is supplied; otherwise designed-silent). Reel content =
   screen captures of the real sites + user-supplied ad clips. Scroll locked while open.
3. **Réalisations (signature section)** — typographic project index; hovering a row
   spawns a cursor-following video ghost playing a *real screen-recorded loop* of that
   site; click = shared-element expansion into a case panel: exact full screenshot,
   3 facts (sector, deliverables, year), and "Visiter le site" linking to the live URL
   (the developios live-demo move). Projects: Obsidienne, Marsa Club Nautique,
   OpticVision, Sentia (+ Black Saphir pending approval). Mobile: tap-to-preview
   stacked cards; keyboard accessible list.
4. **Services** — two crafts only: "Sites web" / "Films publicitaires". Asymmetric
   split, clip-path wipe reveals (editing-suite metaphor); each card carries a live
   micro-demo of the craft itself.
5. **Process** — 3 steps, verb-first labels (no "Step 1/2/3" pattern), s-curve
   layout, scroll-driven line draw.
6. **Manifesto strip** — one velocity-reactive marquee (the only marquee on the page).
7. **Contact** — oversized typographic CTA, one intent ("Démarrer un projet") used
   page-wide; real lead channel (form service / WhatsApp / Calendly, user to pick);
   Ft5 statement footer with legal links.

Not carried over from developios: percent-claim headlines, "AI-Native" labeling,
badge walls (all flagged as boilerplate in research; hallmark gate 46 also bans
invented metrics/testimonials, so proof = real work only).

## 4. Interaction & motion system

- **Foundation:** Lenis smooth scroll synced to GSAP ScrollTrigger. All GSAP plugins
  now free (SplitText, Flip, Draggable + Inertia) and vendored like the current site.
- **One signature interaction, executed deeply:** the work index (hover video ghost +
  Flip expansion). Everything else stays quiet: micro-tilts, magnetic play CTAs only,
  clip-path reveals, inner-parallax on media, velocity marquee.
- **Contextual cursor:** builds on the existing Black Saphir cursor; morphs to
  "▶ Lire" over video surfaces, "Visiter" over case links. Desktop only.
- **Three.js:** optional single moment (hero type grain/displacement shader).
  Recommendation: ship GSAP-only first (zero-build vanilla stack, mobile stability),
  add the shader as Phase-5 enhancement only if approved. Fallbacks specified for
  no-WebGL, context-loss, `saveData`, and low-power devices.
- **Reduced motion (mandatory):** static poster hero + plain vertical work list +
  instant reveals; every pinned/scrubbed pattern collapses gracefully. Keyboard
  operability + focus management for the case panels and reel player.

## 5. Asset pipeline

**Portfolio media = exact real captures only (user requirement: no replicas, no AI).**
- Preferred: user supplies the four live URLs → Playwright/Chromium captures
  pixel-exact stills (2880×1620) and 3-5 s screen-recorded loops (compressed WebM/MP4,
  ≤ 2 MB each). OpticVision URL already visible: optic-steel.vercel.app.
- Alternative: user commits the original image files to the repo (chat attachments
  do not land on disk in this environment).

**Higgsfield generation = brand atmosphere only, never presented as client work.**
Manifest (all with `get_cost` preflight, audio explicitly off, ceiling proposed
~120 of the 210.3 available credits, cheapest-model-first):
- A1 hero loop: 5 s cinematic abstract, 16:9 + 9:16 (reframe), loop-friendly
  (start≈end), upscale only if needed.
- A2 two service stills (web craft / film craft abstractions).
- A3 grain/texture plate + OG share image (1200×630).
- A4 (only if Three.js approved) generate_3d "C" glyph mesh.
Post-gen: ffmpeg transcode/compress locally (fallback: pre-sized generation + reframe).

## 6. Content, copy, legal

- FR copy rendered in HTML (crawlable), EN via the existing i18n mechanism.
- No invented metrics, clients, or testimonials. Real facts from the user or nothing.
- Real contact details required before ship (current repo has placeholders).
- French commercial site obligations: mentions légales + privacy section, GDPR-safe
  analytics choice (Plausible or none), no consent-requiring embeds by default.
- SEO: new title/meta/OG per language, Organization + Service structured data,
  og:image from A3, sitemap/robots.

## 7. Performance & QA budget (hard numbers)

- LCP < 2.5 s (poster-first hero, video after LCP), CLS < 0.1, initial payload
  ≤ 2.5 MB, each video loop ≤ 2 MB, 60 fps scroll on mid-tier hardware, DPR capped.
- Preloader ≤ 1.2 s, skipped on revisit.
- Test matrix: Chrome/Firefox/Safari desktop + iOS Safari (muted+playsinline,
  canvas memory limits) + Android Chrome; widths 320/375/414/768/1440 screenshot-
  verified; Lighthouse ≥ 90 perf / ≥ 95 a11y.
- Gates: hallmark 58-gate slop test (mid-build + ship) and taste-skill Pre-Flight
  Check (ship). `overflow-x: clip` at root; no two-line CTAs; `minmax(0,1fr)` grids.

## 8. Build phases (each ends with visual proof for approval)

- **P0 Intake & brand lock** — URLs/files received; approve tokens (name rendering,
  accent, type); deliver token block + type specimen + hero style-frame.
- **P1 Engine** — branch reset to new IA; tokens.css; Lenis+GSAP wiring; nav/footer;
  reduced-motion architecture. (Black Saphir stays intact on `main`; tag before ship.)
- **P2 Hero + preloader + reel moment.**
- **P3 Work section** (signature interaction) with exact captures. → mid-build slop test.
- **P4 Services, process, manifesto, contact, i18n, legal.**
- **P5 Asset final pass** — Higgsfield gens, compression, optional Three.js moment.
- **P6 Hardening** — full gate runs, Lighthouse, cross-browser/width matrix, fix loop.
- **P7 Ship** — push branch, PR on request, deploy per chosen host.

## 9. Open decisions (user)

1. Live URLs of the 4 sites (+ may Black Saphir be case study #5?) and any real
   ad-video files for the reel.
2. Name rendering ("CONVERS" wordmark?) + approve/adjust dark-studio + electric-blue
   direction; any existing logo/colors.
3. FR-default + EN confirmed? Real contact details + preferred lead channel
   (form service / WhatsApp / Calendly / email).
4. One-pager with case panels (recommended) vs multi-page. Hosting target
   (GitHub Pages / Netlify / Vercel / other) + domain.
5. Higgsfield spend ceiling (proposed ≤ 120 credits) and reel sound: licensed track
   supplied, or designed-silent.
6. Three.js hero shader: yes as enhancement, or GSAP-only (recommended baseline).
