/* ═══════════════════════════════════════════════════
   BLACK SAPHIR — main.js
   Preloader · i18n · film scroll-scrub · carousel ·
   product modal · micro-interactions
   ═══════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─────────── i18n dictionary ─────────── */
const I18N = {
  fr: {
    enter: "Entrer",
    nav_film: "Le Film", nav_collection: "La Collection", nav_maison: "La Maison", nav_visite: "Nous Trouver",
    hero_over: "Haute Joaillerie",
    hero_sub: "L'éclat n'attend que vous.",
    scroll: "Faites défiler",
    cap1_t: "Tout commence par une pierre", cap1_p: "Un diamant taille brillant, choisi entre mille.",
    cap2_t: "L'or répond à son appel", cap2_p: "Une chaîne d'or 18 carats, forgée à la main.",
    cap3_t: "L'union parfaite", cap3_p: "Le Solitaire BLACK SAPHIR. Une pièce. Une vie.",
    col_over: "La Collection", col_title: "Pièces d'exception",
    col_hint: "Glissez pour explorer — touchez pour découvrir",
    maison_over: "La Maison",
    maison_quote: "« Un bijou n'est pas un objet. C'est un instant devenu éternel. »",
    maison_p1: "Née d'une passion pour la lumière, la maison BLACK SAPHIR sélectionne chaque pierre à la main et confie l'or à des artisans dont le savoir-faire se transmet depuis des générations.",
    maison_p2: "Chaque création est unique, numérotée et accompagnée de son certificat. Ici, le luxe ne se montre pas — il se ressent.",
    stat1: "Or certifié", stat2: "Diamants certifiés", stat3: "Pièces uniques",
    vis_over: "Nous Trouver", vis_title: "La Boutique",
    vis_addr: "Adresse de la boutique — à confirmer",
    vis_hours: "Lun – Sam · 10h00 – 19h00",
    vis_btn: "Itinéraire",
    foot_tag: "Haute Joaillerie — Paris", foot_rights: "Tous droits réservés",
    modal_over: "BLACK SAPHIR — Pièce d'exception",
    modal_cta: "Réserver un rendez-vous privé",
    price_request: "Prix sur demande",
    d_metal: "Métal", d_stone: "Pierre", d_cert: "Certificat", d_made: "Fabrication",
    made_hand: "Façonné à la main", cert_incl: "Inclus",
  },
  en: {
    enter: "Enter",
    nav_film: "The Film", nav_collection: "The Collection", nav_maison: "The House", nav_visite: "Find Us",
    hero_over: "High Jewelry",
    hero_sub: "Brilliance awaits you.",
    scroll: "Scroll",
    cap1_t: "It begins with a stone", cap1_p: "A brilliant-cut diamond, chosen among thousands.",
    cap2_t: "Gold answers its call", cap2_p: "An 18-karat gold chain, forged by hand.",
    cap3_t: "The perfect union", cap3_p: "The BLACK SAPHIR Solitaire. One piece. One lifetime.",
    col_over: "The Collection", col_title: "Exceptional pieces",
    col_hint: "Drag to explore — tap to discover",
    maison_over: "The House",
    maison_quote: "“A jewel is not an object. It is a moment made eternal.”",
    maison_p1: "Born of a passion for light, the house of BLACK SAPHIR hand-selects every stone and entrusts its gold to artisans whose craft has been passed down for generations.",
    maison_p2: "Every creation is unique, numbered and delivered with its certificate. Here, luxury is not shown — it is felt.",
    stat1: "Certified gold", stat2: "Certified diamonds", stat3: "Unique pieces",
    vis_over: "Find Us", vis_title: "The Boutique",
    vis_addr: "Boutique address — to be confirmed",
    vis_hours: "Mon – Sat · 10 AM – 7 PM",
    vis_btn: "Directions",
    foot_tag: "High Jewelry — Paris", foot_rights: "All rights reserved",
    modal_over: "BLACK SAPHIR — Exceptional piece",
    modal_cta: "Book a private appointment",
    price_request: "Price on request",
    d_metal: "Metal", d_stone: "Stone", d_cert: "Certificate", d_made: "Craftsmanship",
    made_hand: "Handcrafted", cert_incl: "Included",
  },
};

let LANG = localStorage.getItem("bs-lang") || "fr";

/* ─────────── Product catalogue ───────────
   `img` points at the real product photos hosted on the CDN. If a CDN link
   ever changes, the card falls back to `fallback` (a local film crop) so the
   site never shows a broken image. To make the photos permanent, download
   them and commit to assets/products/, then point `img` at the local path. */
const CDN = "https://d2ol7oe51mr4n9.cloudfront.net/user_3GHPoA15zVprBfRKPajGW3fs5DR";
const PRODUCTS = [
  {
    id: "jonc-eternite", img: `${CDN}/2dcbc1e9-3d61-4af7-baa7-843825e769e7.png`, fallback: "assets/products/jonc-eternite.svg", price: 2900,
    name: { fr: "Jonc Éternité", en: "Eternity Bangle" },
    cat: { fr: "Bracelet — diamants pavés", en: "Bracelet — pavé diamonds" },
    desc: {
      fr: "Un jonc d'or jaune 18 carats serti d'une ligne continue de diamants, retenu par sa chaînette de sécurité. La lumière en orbite autour du poignet.",
      en: "An 18k yellow gold bangle set with a continuous line of diamonds, secured by its safety chain. Light in orbit around the wrist.",
    },
    details: { metal: { fr: "Or jaune 18k", en: "18k yellow gold" }, stone: { fr: "Diamants ronds, serti grain", en: "Round diamonds, bead set" } },
  },
  {
    id: "couronne-marquises", img: `${CDN}/e4480694-ebb8-4434-8e62-6e3ed4f988f0.png`, fallback: "assets/products/couronne-marquises.svg", price: 1450,
    name: { fr: "Couronne de Marquises", en: "Marquise Crown" },
    cat: { fr: "Boucle d'oreille — puce", en: "Earring — stud" },
    desc: {
      fr: "Cinq diamants taille marquise déployés en éventail, comme une aile de lumière posée sur le lobe. Se porte seule ou en paire.",
      en: "Five marquise-cut diamonds fanned like a wing of light resting on the lobe. Worn alone or as a pair.",
    },
    details: { metal: { fr: "Or jaune 18k", en: "18k yellow gold" }, stone: { fr: "Diamants taille marquise", en: "Marquise-cut diamonds" } },
  },
  {
    id: "croisee-etoiles", img: `${CDN}/8e8ca963-e5ed-4f17-8fc8-751738fadf25.png`, fallback: "assets/products/croisee-etoiles.svg", price: 1900,
    name: { fr: "Croisée d'Étoiles", en: "Starlight Crossing" },
    cat: { fr: "Bague — croisement pavé", en: "Ring — pavé crossover" },
    desc: {
      fr: "Deux anneaux qui se croisent sans jamais se refermer — l'un d'or poli, l'autre pavé de diamants. Une géométrie libre, un éclat permanent.",
      en: "Two bands crossing without ever closing — one in polished gold, the other pavéd with diamonds. Free geometry, permanent brilliance.",
    },
    details: { metal: { fr: "Or jaune 18k", en: "18k yellow gold" }, stone: { fr: "Diamants ronds pavés", en: "Pavé-set round diamonds" } },
  },
  {
    id: "vague-baguette", img: `${CDN}/7116b162-f3d3-4d89-acd6-931b7d6a2654.png`, fallback: "assets/products/vague-baguette.svg", price: 2600,
    name: { fr: "Vague Baguette", en: "Baguette Wave" },
    cat: { fr: "Collier — barre de diamants", en: "Necklace — diamond bar" },
    desc: {
      fr: "Neuf diamants taille baguette sertis en ondulation sur une chaîne d'or forcée. Une vague de lumière suspendue à la clavicule.",
      en: "Nine baguette-cut diamonds set in a gentle wave on a gold belcher chain. A wave of light suspended at the collarbone.",
    },
    details: { metal: { fr: "Or jaune 18k", en: "18k yellow gold" }, stone: { fr: "Diamants taille baguette", en: "Baguette-cut diamonds" } },
  },
];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const t = (k) => (I18N[LANG] && I18N[LANG][k]) || k;
const fmtPrice = (p) => p == null ? t("price_request")
  : new Intl.NumberFormat(LANG === "fr" ? "fr-FR" : "en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p);

/* ─────────── Language ─────────── */
function applyLang() {
  document.documentElement.lang = LANG;
  document.body.dataset.lang = LANG;
  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$("[data-lang-btn]").forEach((b) => b.classList.toggle("active", b.dataset.langBtn === LANG));
  renderCards();
  localStorage.setItem("bs-lang", LANG);
}
$$("[data-lang-btn]").forEach((b) =>
  b.addEventListener("click", () => { LANG = b.dataset.langBtn; applyLang(); })
);

/* ─────────── Film frames preload ─────────── */
const FRAME_COUNT = 126;
const frames = [];
let framesLoaded = 0;

function preloadFrames(onProgress, onDone) {
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.src = `assets/frames/frame_${String(i).padStart(3, "0")}.webp`;
    img.onload = img.onerror = () => {
      framesLoaded++;
      onProgress(framesLoaded / FRAME_COUNT);
      if (framesLoaded === FRAME_COUNT) onDone();
    };
    frames.push(img);
  }
}

/* ─────────── Preloader / enter ─────────── */
const preFill = $("#pre-fill"), preCount = $("#pre-count"), enterBtn = $("#enter-btn"), preloader = $("#preloader");

preloadFrames(
  (p) => {
    preFill.style.width = `${Math.round(p * 100)}%`;
    preCount.textContent = `${Math.round(p * 100)}%`;
  },
  () => {
    enterBtn.disabled = false;
    enterBtn.classList.add("ready");
    preCount.textContent = "100%";
  }
);

enterBtn.addEventListener("click", () => {
  preloader.classList.add("done");
  document.body.classList.add("entered");
  introTimeline();
});

/* Optional opening picture: if assets/img/opening.webp exists it becomes
   the backdrop of the brand opening (replacing the film's first frame). */
(function loadOpeningImage() {
  const img = new Image();
  img.src = "assets/img/opening.webp";
  img.onload = () => {
    const bg = $("#film-brand-bg");
    if (bg) { bg.style.backgroundImage = `url(${img.src})`; bg.classList.add("on"); }
  };
})();

/* ─────────── Hero intro ─────────── */
function introTimeline() {
  const title = $("#hero-title");
  const text = title.textContent;
  title.innerHTML = [...text].map((c) =>
    c === " " || c === " " ? "&nbsp;" : `<span class="char">${c}</span>`).join("");
  gsap.timeline()
    .from(".hero-over", { y: 24, opacity: 0, duration: 1, ease: "power3.out" }, 0.2)
    .from("#hero-title .char", { y: 90, opacity: 0, rotateX: -50, stagger: 0.045, duration: 1.2, ease: "power4.out" }, 0.35)
    .from(".hero-sub", { y: 24, opacity: 0, duration: 1, ease: "power3.out" }, 1.1)
    .from(".scroll-cue", { opacity: 0, duration: 1.2 }, 1.5);
}

/* ─────────── Film scroll-scrub ─────────── */
const filmCanvas = $("#film-canvas");
const fctx = filmCanvas.getContext("2d");
let targetFrame = 0, currentFrame = -1, renderedFrame = -1;

function sizeFilmCanvas() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  filmCanvas.width = innerWidth * dpr;
  filmCanvas.height = innerHeight * dpr;
  renderedFrame = -1; // force redraw
}
sizeFilmCanvas();
addEventListener("resize", sizeFilmCanvas);

function drawFrame(i) {
  const img = frames[i];
  if (!img || !img.naturalWidth) return;
  const cw = filmCanvas.width, ch = filmCanvas.height;
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  fctx.fillStyle = "#fdfdfb";
  fctx.fillRect(0, 0, cw, ch);
  fctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

ScrollTrigger.create({
  trigger: "#film",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => { targetFrame = self.progress * (FRAME_COUNT - 1); },
});

/* brand name opens the film, then dissolves as the story begins */
gsap.timeline({
  scrollTrigger: { trigger: "#film", start: "top top", end: "bottom bottom", scrub: true },
})
  .to("#film-brand", { opacity: 0, ease: "none", duration: 0.07 }, 0.015)
  .set("#film-brand", { visibility: "hidden" }, 0.09)
  .to({}, { duration: 0.91 }, 0.09);

(function filmLoop() {
  // eased scrubbing for a silky feel
  currentFrame += (targetFrame - currentFrame) * 0.16;
  if (Math.abs(targetFrame - currentFrame) < 0.02) currentFrame = targetFrame;
  const i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(currentFrame)));
  if (i !== renderedFrame) { drawFrame(i); renderedFrame = i; }
  requestAnimationFrame(filmLoop);
})();

/* film captions tied to scroll beats */
const capRanges = [ [0.12, 0.34], [0.4, 0.64], [0.72, 0.98] ];
$$(".film-caption").forEach((cap, idx) => {
  const [a, b] = capRanges[idx];
  const fade = (b - a) * 0.3;
  const tl = gsap.timeline({
    scrollTrigger: { trigger: "#film", start: "top top", end: "bottom bottom", scrub: true },
  })
    .set(cap, { visibility: "visible" }, 0)
    .fromTo(cap, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: fade, ease: "none" }, a)
    .to(cap, { opacity: idx === 2 ? 1 : 0, y: idx === 2 ? 0 : -30, duration: fade, ease: "none" }, b - fade);
  // pad every timeline to duration 1 so timeline time === scroll progress
  tl.to({}, { duration: Math.max(0.001, 1 - b) }, b);
});

/* ─────────── Header on scroll ─────────── */
const head = $("#site-head");
addEventListener("scroll", () => head.classList.toggle("scrolled", scrollY > 40), { passive: true });

/* ─────────── Reveal animations ─────────── */
$$(".reveal").forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 86%" },
  });
});

/* ─────────── Collection carousel (drag both directions) ─────────── */
const carousel = $("#carousel"), track = $("#carousel-track"), carFill = $("#car-fill");
let trackX = 0, dragStartX = 0, dragStartTrackX = 0, dragging = false, dragged = 0, velocity = 0, lastMoveX = 0, lastMoveT = 0, momentumRaf = null;

function renderCards() {
  track.innerHTML = PRODUCTS.map((p, i) => `
    <article class="product-card" data-idx="${i}">
      <div class="card-visual">
        <img src="${p.img}" alt="${p.name[LANG]}" draggable="false" loading="lazy"
             onerror="this.onerror=null;this.src='${p.fallback}'">
        <span class="card-shine"></span>
      </div>
      <div class="card-info">
        <h3 class="card-name">${p.name[LANG]}</h3>
        <p class="card-cat">${p.cat[LANG]}</p>
        <p class="card-price">${fmtPrice(p.price)}</p>
      </div>
    </article>`).join("");
  $$(".product-card", track).forEach((card) => {
    card.addEventListener("click", () => { if (Math.abs(dragged) < 6) openModal(+card.dataset.idx); });
  });
  clampTrack();
}

function maxScroll() { return Math.max(0, track.scrollWidth - carousel.clientWidth); }
function setTrack(x) {
  trackX = Math.max(-maxScroll(), Math.min(0, x));
  track.style.transform = `translateX(${trackX}px)`;
  const m = maxScroll();
  carFill.style.width = m ? `${10 + (-trackX / m) * 90}%` : "100%";
}
function clampTrack() { setTrack(trackX); }

/* NB: no setPointerCapture here — capturing retargets the click event
   to the carousel and would swallow product-card clicks. */
carousel.addEventListener("pointerdown", (e) => {
  dragging = true; dragged = 0;
  dragStartX = e.clientX; dragStartTrackX = trackX;
  lastMoveX = e.clientX; lastMoveT = performance.now(); velocity = 0;
  cancelAnimationFrame(momentumRaf);
  addEventListener("pointermove", onDragMove);
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);
});
function onDragMove(e) {
  if (!dragging) return;
  dragged = e.clientX - dragStartX;
  if (Math.abs(dragged) > 6) carousel.classList.add("dragging");
  const now = performance.now();
  velocity = (e.clientX - lastMoveX) / Math.max(1, now - lastMoveT) * 16;
  lastMoveX = e.clientX; lastMoveT = now;
  setTrack(dragStartTrackX + dragged);
}
function endDrag() {
  if (!dragging) return;
  dragging = false;
  carousel.classList.remove("dragging");
  removeEventListener("pointermove", onDragMove);
  removeEventListener("pointerup", endDrag);
  removeEventListener("pointercancel", endDrag);
  // momentum glide
  (function glide() {
    velocity *= 0.94;
    if (Math.abs(velocity) > 0.3) { setTrack(trackX + velocity); momentumRaf = requestAnimationFrame(glide); }
  })();
}
carousel.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); setTrack(trackX - e.deltaX); }
}, { passive: false });

const cardStep = () => ($(".product-card")?.offsetWidth || 300) + 30;
$("#car-prev").onclick = () => smoothTrack(trackX + cardStep() * 2);
$("#car-next").onclick = () => smoothTrack(trackX - cardStep() * 2);
function smoothTrack(to) {
  const o = { v: trackX };
  gsap.to(o, { v: to, duration: .8, ease: "power3.out", onUpdate: () => setTrack(o.v) });
}
addEventListener("resize", clampTrack);

/* ─────────── Product modal ─────────── */
const modal = $("#product-modal"), modalImg = $("#modal-img");
let currentProduct = null;

function openModal(idx) {
  const p = PRODUCTS[idx];
  currentProduct = p;
  modalImg.onerror = () => { modalImg.onerror = null; modalImg.src = p.fallback; };
  modalImg.src = p.img;
  modalImg.alt = p.name[LANG];
  $("#modal-name").textContent = p.name[LANG];
  $("#modal-price").textContent = fmtPrice(p.price);
  $("#modal-desc").textContent = p.desc[LANG];
  $("#modal-details").innerHTML = `
    <li><span>${t("d_metal")}</span><b>${p.details.metal[LANG]}</b></li>
    <li><span>${t("d_stone")}</span><b>${p.details.stone[LANG]}</b></li>
    <li><span>${t("d_cert")}</span><b>${t("cert_incl")}</b></li>
    <li><span>${t("d_made")}</span><b>${t("made_hand")}</b></li>`;
  $("#modal-cta").href = `mailto:contact@blacksaphir.com?subject=${encodeURIComponent("BLACK SAPHIR — " + p.name[LANG])}`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
$("#modal-close").addEventListener("click", closeModal);
$("#modal-veil").addEventListener("click", closeModal);
addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ─────────── Custom cursor ─────────── */
const dot = $("#cursor-dot"), ring = $("#cursor-ring");
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let rx = 0, ry = 0, mx = 0, my = 0;
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  (function ringLoop() {
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ringLoop);
  })();
  addEventListener("mouseover", (e) => {
    document.body.classList.toggle("cursor-hover",
      !!e.target.closest("a, button, .product-card, .carousel"));
  });
}

/* ─────────── init ─────────── */
applyLang();
