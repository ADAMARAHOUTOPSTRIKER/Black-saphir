/* CONVERS — content manifest.
 * projects[].cover / .loop and media.* stay null until the exact captures of the
 * live sites are added (no generated replicas, per brand rule). The UI upgrades
 * itself automatically when a path is filled in. */

const CONVERS_DATA = {
  media: {
    /* Files are fetched by scripts/fetch-assets.mjs (runs automatically in the
     * Vercel build). main.js verifies each file exists before enabling it, so
     * a missing file simply falls back to the CSS atmosphere. */
    heroVideo: "assets/video/atmos.mp4",   // brand-atmosphere loop, 16:9, silent
    heroPoster: "assets/img/atmos-poster.webp",
    reel: null,                            // stays null until a real-work montage exists
    /* In-house demo advertisement films for the "Films publicitaires" craft.
     * Same storyboard each time: exploded flat-lay on black, mid-air self
     * assembly, one action beat, return and disassembly; engraved part
     * captions live on the poster stills. */
    craftFilms: [
      {
        id: "camera",
        label: { fr: "Caméra", en: "Camera" },
        src: "assets/video/craft-film.mp4",
        poster: "assets/img/craft-film-poster.webp"
      },
      {
        id: "montre",
        label: { fr: "Montre", en: "Watch" },
        src: "assets/video/craft-film-montre.mp4",
        poster: "assets/img/craft-film-montre-poster.webp"
      }
    ]
  },

  projects: [
    {
      id: "blacksaphir",
      name: "Black Saphir",
      url: "https://black-saphir.vercel.app/",
      hue: "var(--p-saphir)",
      sector: { fr: "Haute joaillerie", en: "Fine jewelry" },
      services: {
        fr: ["Site vitrine", "Film au défilement", "Direction artistique"],
        en: ["Brand website", "Scroll driven film", "Art direction"]
      },
      desc: {
        fr: "Une maison de joaillerie racontée image par image : le solitaire naît sous vos yeux au fil du défilement.",
        en: "A jewelry house told frame by frame: the solitaire takes shape as you scroll."
      },
      quote: "L'éclat n'attend que vous.",
      cover: "assets/work/blacksaphir-cover.webp",
      loop: "assets/work/blacksaphir-loop.webm"
    },
    {
      id: "marsa",
      name: "Marsa",
      url: "https://nautical-club-4ild-8ufvl7r1o-convers.vercel.app/",
      hue: "var(--p-marsa)",
      sector: { fr: "Club nautique, Casablanca", en: "Nautical club, Casablanca" },
      services: {
        fr: ["Site vitrine", "Film d'ambiance", "Identité visuelle"],
        en: ["Brand website", "Mood film", "Visual identity"]
      },
      desc: {
        fr: "L'océan comme art de vivre, raconté par un film plein écran et une lumière de fin de journée.",
        en: "The ocean as a way of living, told through a full screen film and end of day light."
      },
      quote: "L'océan comme art de vivre.",
      cover: "assets/work/marsa-cover.webp",
      loop: "assets/work/marsa-loop.webm"
    },
    {
      id: "opticvision",
      name: "OpticVision",
      url: "https://optic-steel.vercel.app/",
      hue: "var(--p-optic)",
      sector: { fr: "Optique & lunetterie", en: "Eyewear" },
      services: {
        fr: ["Site de marque", "Film produit", "Design d'interface"],
        en: ["Brand website", "Product film", "Interface design"]
      },
      desc: {
        fr: "Une maison d'optique suspendue dans les nuages. La monture y devient un objet rare.",
        en: "An eyewear house suspended in the clouds. The frame becomes a rare object."
      },
      quote: "La vision, sculptée comme un objet rare.",
      cover: null,  // OpticVision: live link only, per client decision
      loop: null
    },
    {
      id: "sentia",
      name: "Sentia",
      url: "https://sentia-pi.vercel.app/",
      hue: "var(--p-sentia)",
      sector: { fr: "Parfumerie", en: "Fine fragrance" },
      services: {
        fr: ["Site de marque", "Film produit", "Direction artistique"],
        en: ["Brand website", "Product film", "Art direction"]
      },
      desc: {
        fr: "Ananas, vanille, fumée blanche : le parfum se voit avant de se sentir.",
        en: "Pineapple, vanilla, white smoke: the fragrance is seen before it is smelled."
      },
      quote: "L'art de se souvenir par les sens.",
      cover: "assets/work/sentia-cover.webp",
      loop: "assets/work/sentia-loop.webm"
    }
  ]
};

/* ─────────── i18n ───────────
 * FR is the source of truth and lives in the HTML. EN overrides below. */
const I18N = {
  fr: {
    skip: "Aller au contenu",
    nav_work: "Réalisations", nav_studio: "Studio", nav_contact: "Contact",
    cta_project: "Démarrer un projet",
    hero_sub: "Nous concevons des sites immersifs et des films publicitaires qui font vivre les marques.",
    hero_cta: "Voir les réalisations",
    reel_hint: "Showreel",
    work_over: "Réalisations",
    work_title: "Quatre marques, quatre expériences.",
    work_note: "Chaque site est en ligne. Survolez, entrez, visitez.",
    srv_title: "Deux métiers, une même exigence.",
    srv1_t: "Sites web",
    srv1_p: "Conception, design et développement de sites immersifs, pensés pour l'émotion autant que pour la performance.",
    srv1_l1: "Direction artistique", srv1_l2: "Design d'interface", srv1_l3: "Développement & motion", srv1_l4: "Expériences 3D", srv1_l5: "Performance & SEO",
    srv2_t: "Films publicitaires",
    srv2_p: "Des films courts qui donnent une voix à votre marque, du concept au montage final.",
    srv2_l1: "Concept & script", srv2_l2: "Image & génération", srv2_l3: "Montage & étalonnage", srv2_l4: "Habillage sonore", srv2_l5: "Déclinaisons réseaux",
    srv2_demo: "Film de démonstration, réalisé par le studio. Cliquez pour le son.",
    prc_title: "Comment nous travaillons",
    prc1_t: "Cadrage", prc1_p: "Nous écoutons, puis nous définissons le cap : audience, intention, ton.",
    prc2_t: "Design & motion", prc2_p: "Direction artistique, prototypes, et chaque animation justifiée par le sens.",
    prc3_t: "Mise en ligne", prc3_p: "Tests, performance, lancement. Puis nous restons à vos côtés.",
    man_quote: "Un site ne doit pas seulement s'afficher. Il doit se vivre.",
    ct_lead: "Un site, un film, ou les deux ?",
    case_visit: "Visiter le site",
    case_pending: "Capture exacte en cours d'intégration. Le site, lui, est déjà en ligne.",
    foot_tag: "Sites web & films publicitaires",
    foot_tel: "Téléphone",
    foot_legal: "Mentions légales",
    lg_title: "Mentions légales",
    lg_ed: "Éditeur",
    lg_dir: "Directeur de la publication",
    lg_dir_v: "Convers-Websites (à compléter : nom du responsable)",
    lg_host: "Hébergement",
    lg_data: "Données personnelles",
    lg_data_v: "Ce site ne dépose aucun cookie et ne collecte aucune donnée de navigation. La préférence de langue est enregistrée uniquement sur votre appareil."
  },
  en: {
    skip: "Skip to content",
    nav_work: "Work", nav_studio: "Studio", nav_contact: "Contact",
    cta_project: "Start a project",
    hero_sub: "We design immersive websites and advertising films that bring brands to life.",
    hero_cta: "See the work",
    reel_hint: "Showreel",
    work_over: "Selected work",
    work_title: "Four brands, four experiences.",
    work_note: "Every site is live. Hover, enter, visit.",
    srv_title: "Two crafts, one standard.",
    srv1_t: "Websites",
    srv1_p: "Design and development of immersive websites, built for emotion as much as for performance.",
    srv1_l1: "Art direction", srv1_l2: "Interface design", srv1_l3: "Development & motion", srv1_l4: "3D experiences", srv1_l5: "Performance & SEO",
    srv2_t: "Advertising films",
    srv2_p: "Short films that give your brand a voice, from concept to final cut.",
    srv2_l1: "Concept & script", srv2_l2: "Footage & generation", srv2_l3: "Editing & grading", srv2_l4: "Sound design", srv2_l5: "Social formats",
    srv2_demo: "Demo film, made in-house by the studio. Click for sound.",
    prc_title: "How we work",
    prc1_t: "Framing", prc1_p: "We listen, then we set the course: audience, intention, tone.",
    prc2_t: "Design & motion", prc2_p: "Art direction, prototypes, and every animation justified by meaning.",
    prc3_t: "Launch", prc3_p: "Testing, performance, release. Then we stay by your side.",
    man_quote: "A website should not only be seen. It should be experienced.",
    ct_lead: "A website, a film, or both?",
    case_visit: "Visit the site",
    case_pending: "Exact capture on its way. The site itself is already live.",
    foot_tag: "Websites & advertising films",
    foot_tel: "Phone",
    foot_legal: "Legal notice",
    lg_title: "Legal notice",
    lg_ed: "Publisher",
    lg_dir: "Publishing director",
    lg_dir_v: "Convers-Websites (to complete: name of the person in charge)",
    lg_host: "Hosting",
    lg_data: "Personal data",
    lg_data_v: "This site sets no cookies and collects no browsing data. Your language preference is stored on your device only."
  }
};

const CURSOR_LABELS = {
  fr: { play: "LIRE", visit: "VISITER", write: "HELLO", close: "FERMER" },
  en: { play: "PLAY", visit: "VISIT", write: "HELLO", close: "CLOSE" }
};
