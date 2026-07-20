/* CONVERS — main.js
 * Engine: Lenis + GSAP (ScrollTrigger, SplitText, Flip)
 * Everything degrades: reduced motion / save-data / coarse pointer / no JS. */

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ─────────── environment gates ─────────── */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveData     = navigator.connection && navigator.connection.saveData === true;
const finePointer  = matchMedia("(pointer: fine)").matches;
const motionOn     = !reduceMotion && !saveData;

document.body.dataset.motion  = motionOn ? "on" : "off";
document.body.dataset.pointer = finePointer ? "fine" : "coarse";

/* ─────────── lenis smooth scroll ─────────── */
let lenis = null;
if (motionOn && typeof Lenis !== "undefined") {
  lenis = new Lenis({ lerp: 0.11, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* anchor navigation (works with and without lenis) */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = $(a.getAttribute("href"));
  if (!target) return;
  closeMenu();
  if (lenis) {
    e.preventDefault();
    lenis.scrollTo(target, { offset: -92, duration: 1.1 });
  }
});

/* ─────────── i18n ─────────── */
let lang = localStorage.getItem("cw-lang") || "fr";

function applyLang(next) {
  lang = I18N[next] ? next : "fr";
  localStorage.setItem("cw-lang", lang);
  document.documentElement.lang = lang;
  document.body.dataset.lang = lang;
  const dict = I18N[lang];
  $$("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    if (dict[k] !== undefined) el.textContent = dict[k];
  });
  $$("[data-i18n-aria]").forEach((el) => {
    const k = el.dataset.i18nAria;
    if (dict[k] !== undefined) el.setAttribute("aria-label", dict[k]);
  });
  $$("[data-lang-btn]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang))
  );
  renderRowMeta();
  if (openProject) fillCase(openProject);
  document.dispatchEvent(new CustomEvent("cw:lang"));
}
$$("[data-lang-btn]").forEach((b) =>
  b.addEventListener("click", () => applyLang(b.dataset.langBtn))
);

/* ─────────── work index injection ─────────── */
const workIndex = $("#work-index");
const rowByProject = new Map();

CONVERS_DATA.projects.forEach((p) => {
  const li = document.createElement("li");
  li.className = "work-row";
  li.style.setProperty("--p-hue", p.hue);
  li.innerHTML = `
    <a class="work-link" href="${p.url}" target="_blank" rel="noopener"
       data-project="${p.id}" data-cursor="visit"
       aria-label="${p.name}, ${p.sector[lang]}">
      <span class="work-name">${p.name}<span class="work-arrow" aria-hidden="true">↗</span></span>
      <span class="work-meta"></span>
    </a>`;
  workIndex.appendChild(li);
  rowByProject.set(p.id, li);
});

function renderRowMeta() {
  CONVERS_DATA.projects.forEach((p) => {
    const li = rowByProject.get(p.id);
    if (li) $(".work-meta", li).textContent = p.sector[lang];
  });
}

/* row click opens the case panel (plain navigation without JS) */
workIndex.addEventListener("click", (e) => {
  const link = e.target.closest(".work-link");
  if (!link) return;
  e.preventDefault();
  const p = CONVERS_DATA.projects.find((x) => x.id === link.dataset.project);
  if (p) openCase(p, link);
});

/* ─────────── case panel ─────────── */
const caseEl = $("#case");
let openProject = null;
let lastFocus = null;

function fillCase(p) {
  $("#case-sector").textContent = p.sector[lang];
  $("#case-name").textContent = p.name;
  const q = $("#case-quote");
  q.hidden = !p.quote;
  q.textContent = p.quote ? `« ${p.quote} »` : "";
  $("#case-desc").textContent = p.desc[lang];
  $("#case-visit").href = p.url;
  const list = $("#case-services");
  list.innerHTML = "";
  p.services[lang].forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    list.appendChild(li);
  });
  const media = $("#case-media");
  const slot = $("#case-media-slot");
  $(".case-card").style.setProperty("--p-hue", p.hue);
  $$("img,video", media).forEach((n) => n.remove());
  if (p.cover) {
    slot.style.display = "none";
    const img = document.createElement("img");
    img.src = p.cover;
    img.alt = `${p.name}, capture du site`;
    media.appendChild(img);
  } else {
    slot.style.display = "grid";
  }
}

function openCase(p, trigger) {
  openProject = p;
  lastFocus = trigger || document.activeElement;
  fillCase(p);
  hideWorkBg();
  caseEl.classList.add("is-open");
  caseEl.setAttribute("aria-hidden", "false");
  if (lenis) lenis.stop();
  document.documentElement.style.overflow = "hidden";
  if (motionOn) {
    const card = $(".case-card");
    gsap.fromTo($(".case-veil"), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(card,
      { clipPath: "inset(46% 0% 46% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.out" });
    gsap.fromTo($$(".case-info > *", card),
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, delay: 0.18, ease: "power3.out", clearProps: "all" });
  }
  $("#case-close").focus();
}

function closeCase() {
  const done = () => {
    caseEl.classList.remove("is-open");
    caseEl.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
    document.documentElement.style.overflow = "";
    openProject = null;
    if (lastFocus) lastFocus.focus();
  };
  if (motionOn) {
    gsap.to($(".case-card"), { clipPath: "inset(46% 0% 46% 0%)", duration: 0.35, ease: "power3.in" });
    gsap.to($(".case-veil"), { opacity: 0, duration: 0.35, onComplete: done });
  } else done();
}
$("#case-close").addEventListener("click", closeCase);
$("#case-veil").addEventListener("click", closeCase);

/* ─────────── legal modal ─────────── */
const legalEl = $("#legal");
function openLegal() {
  lastFocus = document.activeElement;
  legalEl.classList.add("is-open");
  legalEl.setAttribute("aria-hidden", "false");
  if (lenis) lenis.stop();
  document.documentElement.style.overflow = "hidden";
  if (motionOn) {
    gsap.fromTo($(".legal-veil"), { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo($(".legal-card"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity" });
  }
  $("#legal-close").focus();
}
function closeLegal() {
  legalEl.classList.remove("is-open");
  legalEl.setAttribute("aria-hidden", "true");
  if (lenis) lenis.start();
  document.documentElement.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
$("#legal-open").addEventListener("click", openLegal);
$("#legal-close").addEventListener("click", closeLegal);
$("#legal-veil").addEventListener("click", closeLegal);

/* shared overlay keyboard handling: Esc + focus trap */
document.addEventListener("keydown", (e) => {
  const overlay = caseEl.classList.contains("is-open") ? caseEl
    : legalEl.classList.contains("is-open") ? legalEl
    : $("#mobile-menu").classList.contains("is-open") ? $("#mobile-menu")
    : null;
  if (!overlay) return;
  if (e.key === "Escape") {
    if (overlay === caseEl) closeCase();
    else if (overlay === legalEl) closeLegal();
    else closeMenu();
    return;
  }
  if (e.key === "Tab") {
    const focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', overlay)
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ─────────── mobile menu ─────────── */
const burger = $("#burger");
const mobileMenu = $("#mobile-menu");
function closeMenu() {
  if (!mobileMenu.classList.contains("is-open")) return;
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  burger.setAttribute("aria-expanded", "false");
  if (lenis) lenis.start();
  document.documentElement.style.overflow = "";
}
burger.addEventListener("click", () => {
  const open = mobileMenu.classList.contains("is-open");
  if (open) { closeMenu(); return; }
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  burger.setAttribute("aria-expanded", "true");
  if (lenis) lenis.stop();
  document.documentElement.style.overflow = "hidden";
  if (motionOn) {
    gsap.fromTo($$(".mm-nav a"), { y: 34, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out", clearProps: "all" });
  }
});

/* ─────────── header state ─────────── */
ScrollTrigger.create({
  start: 80,
  end: "max",
  onUpdate: (self) => $("#site-head").classList.toggle("is-scrolled", self.scroll() > 80),
  onEnter: () => $("#site-head").classList.add("is-scrolled"),
  onLeaveBack: () => $("#site-head").classList.remove("is-scrolled")
});

/* ─────────── preloader + hero intro ─────────── */
const preloader = $("#preloader");
const seen = sessionStorage.getItem("cw-pre-seen");

function heroIntro(instant) {
  const subLines = $$(".ht-line");
  if (!motionOn || instant) return;
  try {
    subLines.forEach((l) => (l.style.overflow = "clip"));
    const main = new SplitText(".ht-main", { type: "chars" });
    const sub  = new SplitText(".ht-sub",  { type: "chars" });
    const tl = gsap.timeline();
    tl.from(main.chars, { yPercent: 112, duration: 1, stagger: 0.035, ease: "expo.out" })
      .from(sub.chars,  { yPercent: 112, duration: 0.8, stagger: 0.012, ease: "expo.out" }, "-=0.7")
      .from([".hero-sub", ".hero-ctas"], { y: 26, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", clearProps: "all" }, "-=0.5")
      .add(() => subLines.forEach((l) => (l.style.overflow = "")));
  } catch (err) {
    gsap.from(".hero-inner", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" });
  }
}

/* WhatsApp float entrance (CSS-driven: individual scale/translate properties,
   so it never fights the magnetic quickTo inline transform) */
function waIntro(delay) {
  setTimeout(() => $("#wa-float").classList.add("is-in"), delay * 1000);
}

if (!motionOn || seen) {
  preloader.classList.add("is-done");
  heroIntro(true);
  waIntro(0.6);
} else {
  sessionStorage.setItem("cw-pre-seen", "1");
  const count = { v: 0 };
  const tl = gsap.timeline();
  tl.to(count, {
      v: 100, duration: 0.85, ease: "power2.inOut",
      onUpdate: () => ($("#pre-count").textContent = String(Math.round(count.v)).padStart(2, "0"))
    })
    .to("#pre-fill", { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0)
    .to(".pre-inner", { opacity: 0, y: -14, duration: 0.3, ease: "power2.in" }, "+=0.1")
    .to(preloader, { yPercent: -100, duration: 0.65, ease: "expo.inOut" })
    .add(() => preloader.classList.add("is-done"))
    .add(heroIntro, "-=0.45")
    .add(() => waIntro(0.7));
}

/* ─────────── hero atmosphere ─────────── */
(function atmos() {
  /* grain: one static pass per resize, no animation loop */
  const canvas = $("#atmos-grain");
  const ctx = canvas.getContext("2d");
  function drawGrain() {
    const w = (canvas.width = Math.floor(canvas.offsetWidth / 2));
    const h = (canvas.height = Math.floor(canvas.offsetHeight / 2));
    if (!w || !h) return;
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 26;
    }
    ctx.putImageData(img, 0, 0);
  }
  drawGrain();
  addEventListener("resize", drawGrain, { passive: true });

  if (motionOn) {
    /* slow drift, plus pointer parallax on fine pointers */
    gsap.to(".atmos-aura-a", { xPercent: -6, yPercent: 8, duration: 14, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".atmos-aura-b", { xPercent: 8, yPercent: -6, duration: 11, yoyo: true, repeat: -1, ease: "sine.inOut" });
    if (finePointer) {
      const ax = gsap.quickTo(".atmos-aura-a", "x", { duration: 1.2, ease: "power3.out" });
      const ay = gsap.quickTo(".atmos-aura-a", "y", { duration: 1.2, ease: "power3.out" });
      const bx = gsap.quickTo(".atmos-aura-b", "x", { duration: 1.6, ease: "power3.out" });
      const by = gsap.quickTo(".atmos-aura-b", "y", { duration: 1.6, ease: "power3.out" });
      $("#hero").addEventListener("pointermove", (e) => {
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        ax(nx * -34); ay(ny * -22);
        bx(nx * 26);  by(ny * 18);
      });
    }
  }

  /* optional MacBook stats visual, right side of the hero (manifest-driven) */
  const macSrc = CONVERS_DATA.media.heroMac;
  if (macSrc && matchMedia("(min-width: 1024px)").matches) {
    fetch(macSrc, { method: "HEAD" }).then((r) => {
      if (!r.ok) return;
      const mac = $("#hero-mac");
      mac.src = macSrc;
      mac.hidden = false;
      if (motionOn) {
        gsap.from(mac, { y: 60, opacity: 0, duration: 1.1, delay: 0.9, ease: "power3.out" });
        gsap.to(mac, { y: -14, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
        if (finePointer) {
          const mx = gsap.quickTo(mac, "x", { duration: 1.4, ease: "power3.out" });
          $("#hero").addEventListener("pointermove", (e) => {
            mx((e.clientX / innerWidth - 0.5) * -18);
          });
        }
      }
    }).catch(() => {});
  }

  /* optional brand-atmosphere video (manifest-driven, verified before enabling
     so a missing file quietly falls back to the CSS atmosphere) */
  const src = CONVERS_DATA.media.heroVideo;
  if (src) {
    fetch(src, { method: "HEAD" }).then((r) => {
      if (!r.ok) return;
      const v = $("#atmos-video");
      v.src = src;
      if (CONVERS_DATA.media.heroPoster) v.poster = CONVERS_DATA.media.heroPoster;
      v.hidden = false;
      if (motionOn) {
        ScrollTrigger.create({
          trigger: "#hero", start: "top bottom", end: "bottom top",
          onToggle: (self) => (self.isActive ? v.play().catch(() => {}) : v.pause())
        });
      } else {
        v.preload = "metadata";
      }
    }).catch(() => {});
  }
})();

/* ─────────── reveals ─────────── */
if (motionOn) {
  gsap.set("[data-reveal]", { y: 26, opacity: 0 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, opacity: 1, duration: 0.75, stagger: 0.09, ease: "power3.out", clearProps: "all" })
  });
}

/* ─────────── work section: 3 interactive effects ───────────
 * 1. Background takeover: the hovered project's real capture floods the section.
 * 2. Text scramble: names and nav links decode on hover.
 * 3. Velocity skew: the index leans with scroll speed. */
const workBg = $("#work-bg");
const wbVideo = $("#wb-video");
const wbImg = $("#wb-img");

function hideWorkBg() {
  workBg.classList.remove("is-on");
  wbVideo.pause();
}

if (motionOn && finePointer) {
  /* 1 — background takeover */
  workIndex.addEventListener("pointerover", (e) => {
    const link = e.target.closest(".work-link");
    if (!link) return;
    const p = CONVERS_DATA.projects.find((x) => x.id === link.dataset.project);
    if (!p) return;
    if (p.loop) {
      wbImg.hidden = true;
      if (wbVideo.dataset.src !== p.loop) { wbVideo.src = p.loop; wbVideo.dataset.src = p.loop; }
      wbVideo.hidden = false;
      wbVideo.play().catch(() => {});
    } else if (p.cover) {
      wbVideo.hidden = true; wbVideo.pause();
      wbImg.src = p.cover; wbImg.hidden = false;
    } else {
      hideWorkBg();
      return;
    }
    workBg.classList.add("is-on");
  });
  workIndex.addEventListener("pointerleave", hideWorkBg);

  /* 2 — text scramble (Matrix-style decode) */
  const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#/\\_0123456789";
  function scramble(el) {
    const node = el.firstChild;
    if (!node || node.nodeType !== 3 || el._scrambling) return;
    el._scrambling = true;
    const original = node.nodeValue;
    let frame = 0;
    const total = Math.max(14, original.length * 2);
    (function tick() {
      frame++;
      const reveal = Math.floor(original.length * (frame / total));
      let out = original.slice(0, reveal);
      for (let i = reveal; i < original.length; i++) {
        out += original[i] === " " ? " " : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
      }
      node.nodeValue = out;
      if (frame < total) requestAnimationFrame(tick);
      else { node.nodeValue = original; el._scrambling = false; }
    })();
  }
  workIndex.addEventListener("pointerover", (e) => {
    const name = e.target.closest(".work-link")?.querySelector(".work-name");
    if (name) scramble(name);
  });
  $$(".head-nav a, .mm-nav a").forEach((a) =>
    a.addEventListener("pointerenter", () => scramble(a)));

  /* 3 — velocity skew on the index */
  ScrollTrigger.create({
    trigger: "#realisations", start: "top bottom", end: "bottom top",
    onUpdate: (self) => {
      const lean = gsap.utils.clamp(-6, 6, self.getVelocity() / -350);
      gsap.to(workIndex, { skewY: lean, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      gsap.to(workIndex, { skewY: 0, duration: 0.7, delay: 0.12, ease: "power3.out", overwrite: false });
    }
  });
}

/* ─────────── craft motifs ─────────── */
if (motionOn) {
  /* web: planes assemble on entry, and re-flow (Flip) on hover: the layout rebuilds itself */
  const planes = $$(".cvw-plane");
  gsap.from(planes, {
    x: () => gsap.utils.random(-60, 60),
    y: () => gsap.utils.random(-40, 40),
    rotation: () => gsap.utils.random(-10, 10),
    opacity: 0,
    duration: 0.9, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: ".craft-web", start: "top 78%", once: true }
  });
  const layoutA = [
    { left: "12%", top: "14%", width: "42%", height: "26%" },
    { left: "12%", top: "46%", width: "26%", height: "40%" },
    { left: "44%", top: "46%", width: "44%", height: "18%" },
    { left: "60%", top: "14%", width: "28%", height: "26%" }
  ];
  const layoutB = [
    { left: "12%", top: "14%", width: "26%", height: "72%" },
    { left: "44%", top: "14%", width: "44%", height: "30%" },
    { left: "44%", top: "50%", width: "20%", height: "36%" },
    { left: "70%", top: "50%", width: "18%", height: "36%" }
  ];
  let alt = false;
  $(".craft-web .craft-visual").addEventListener("pointerenter", () => {
    const state = Flip.getState(planes);
    alt = !alt;
    (alt ? layoutB : layoutA).forEach((pos, i) => Object.assign(planes[i].style, pos));
    Flip.from(state, { duration: 0.7, ease: "expo.out", absolute: false });
  });

  /* film: bars draw in, scrub line follows section progress like an edit timeline */
  gsap.from(".cvf-bar", {
    scaleY: 0, transformOrigin: "top",
    duration: 0.7, stagger: 0.07, ease: "power3.out",
    scrollTrigger: { trigger: ".craft-film", start: "top 78%", once: true }
  });
  gsap.fromTo(".cvf-scrub-fill", { scaleX: 0 }, {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: ".craft-film", start: "top 80%", end: "bottom 35%", scrub: 0.6 }
  });
  const orb = $(".cvf-orb");
  orb.parentElement.addEventListener("pointerenter", () => gsap.to(orb, { scale: 0.92, duration: 0.3, ease: "power3.out" }));
  orb.parentElement.addEventListener("pointerleave", () => gsap.to(orb, { scale: 1, duration: 0.45, ease: "power3.out" }));

  /* process line draws with scroll */
  gsap.fromTo("#process-path", { strokeDashoffset: 100 }, {
    strokeDashoffset: 0, ease: "none",
    scrollTrigger: { trigger: ".process-flow", start: "top 75%", end: "bottom 45%", scrub: 0.6 }
  });

  /* staircase steps reveal one by one, driven by the scroll position
     (scrubbed, so they follow the drawn line instead of popping at once) */
  $$(".step").forEach((step) => {
    gsap.fromTo(step,
      { opacity: 0, y: 44, x: -22 },
      { opacity: 1, y: 0, x: 0, ease: "none",
        scrollTrigger: { trigger: step, start: "top 96%", end: "top 62%", scrub: 0.5 } });
  });
}

/* ─────────── marquee (velocity-reactive) ─────────── */
(function marquee() {
  const track = $("#marquee-track");
  if (!track) return;
  /* duplicate content until it covers 2x viewport for a seamless wrap */
  const base = track.innerHTML;
  while (track.scrollWidth < innerWidth * 2.2) track.innerHTML += base;
  if (!motionOn) return;
  const loop = gsap.to(track, { xPercent: -50, duration: 26, repeat: -1, ease: "none" });
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 900);
      gsap.to(loop, { timeScale: boost, duration: 0.3, overwrite: true });
      gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.35, overwrite: false });
    }
  });
})();

/* ─────────── reel (manifest-driven) ─────────── */
(async function reel() {
  const src = CONVERS_DATA.media.reel;
  if (!src) return;
  const ok = await fetch(src, { method: "HEAD" }).then((r) => r.ok).catch(() => false);
  if (!ok) return;
  const section = $("#reel");
  const video = $("#reel-video");
  section.hidden = false;
  video.src = src;
  if (motionOn) {
    ScrollTrigger.create({
      trigger: section, start: "top bottom", end: "bottom top",
      onToggle: (self) => (self.isActive ? video.play().catch(() => {}) : video.pause())
    });
  }
  $("#reel-open").addEventListener("click", () => {
    const stage = $(".reel-stage");
    if (document.fullscreenElement) { document.exitFullscreen(); video.muted = true; return; }
    (stage.requestFullscreen ? stage.requestFullscreen() : Promise.reject()).then(() => {
      video.muted = false; video.play().catch(() => {});
    }).catch(() => { video.muted = !video.muted; });
  });
})();

/* ─────────── craft demo films (manifest-driven, multi-film switcher) ─────────── */
(async function craftFilm() {
  const films = CONVERS_DATA.media.craftFilms || [];
  if (!films.length) return;
  const checks = await Promise.all(films.map((f) =>
    fetch(f.src, { method: "HEAD" }).then((r) => r.ok).catch(() => false)));
  const avail = films.filter((_, i) => checks[i]);
  if (!avail.length) return;
  const stage = $("#craft-film-stage");
  const video = $("#craft-film-video");
  const motif = $(".craft-film .cv-film");
  const switcher = $("#craft-film-switch");

  function showFilm(f) {
    video.pause();
    video.src = f.src;
    video.poster = f.poster || "";
    video.load();
    video.play().catch(() => {});
    $$("button", switcher).forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.film === f.id)));
  }

  if (avail.length > 1) {
    switcher.hidden = false;
    avail.forEach((f) => {
      const b = document.createElement("button");
      b.dataset.film = f.id;
      b.textContent = f.label[lang];
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => showFilm(f));
      switcher.appendChild(b);
    });
    document.addEventListener("cw:lang", () => {
      $$("button", switcher).forEach((b) => {
        const f = avail.find((x) => x.id === b.dataset.film);
        if (f) b.textContent = f.label[lang];
      });
    });
  }

  const first = avail[0];
  video.src = first.src;
  if (first.poster) video.poster = first.poster;
  if (avail.length > 1) {
    const b = $$("button", switcher).find((x) => x.dataset.film === first.id);
    if (b) b.setAttribute("aria-pressed", "true");
  }
  stage.hidden = false;
  $("#craft-film-caption").hidden = false;
  if (motif) motif.style.display = "none";
  if (motionOn) {
    ScrollTrigger.create({
      trigger: stage, start: "top bottom", end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) { video.preload = "metadata"; video.play().catch(() => {}); }
        else video.pause();
      }
    });
    ScrollTrigger.refresh();
  }
  stage.addEventListener("click", () => {
    if (document.fullscreenElement) { document.exitFullscreen(); video.muted = true; return; }
    (stage.requestFullscreen ? stage.requestFullscreen() : Promise.reject()).then(() => {
      video.muted = false; video.currentTime = 0; video.play().catch(() => {});
    }).catch(() => { video.muted = !video.muted; });
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) video.muted = true;
  });
})();

/* ─────────── reviews carousel ─────────── */
(function reviews() {
  const track = $("#reviews-track");
  if (!track || typeof REVIEWS === "undefined" || !REVIEWS.length) return;

  function initials(name) {
    return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }
  function render() {
    track.innerHTML = "";
    REVIEWS.forEach((r) => {
      const li = document.createElement("li");
      li.className = "review-card";
      li.style.setProperty("--p-hue", r.hue);
      const avatar = r.photo
        ? `<img src="${r.photo}" alt="">`
        : `<span aria-hidden="true">${initials(r.name)}</span>`;
      li.innerHTML = `
        <div class="review-stars" aria-label="5/5">★★★★★</div>
        <p class="review-text">${r.text[lang]}</p>
        <div class="review-who">
          <div class="review-avatar">${avatar}</div>
          <div>
            <p class="review-name">${r.name}</p>
            <p class="review-place">${r.place}</p>
          </div>
        </div>`;
      track.appendChild(li);
    });
  }
  /* keep the card nearest to the viewport centre sharp, blur the others */
  let centerRaf = 0;
  function updateCenter() {
    centerRaf = 0;
    const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = null, bestDist = Infinity;
    $$(".review-card", track).forEach((card) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestDist) { bestDist = d; best = card; }
    });
    $$(".review-card", track).forEach((c) => c.classList.toggle("is-center", c === best));
  }
  function queueCenter() {
    if (!centerRaf) centerRaf = requestAnimationFrame(updateCenter);
  }

  render();
  updateCenter();
  track.addEventListener("scroll", queueCenter, { passive: true });
  addEventListener("resize", queueCenter, { passive: true });
  document.addEventListener("cw:lang", () => { render(); updateCenter(); });

  const step = () => {
    const card = $(".review-card", track);
    return card ? card.getBoundingClientRect().width + 24 : 420;
  };
  $("#rev-prev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: motionOn ? "smooth" : "auto" }));
  $("#rev-next").addEventListener("click", () => track.scrollBy({ left: step(), behavior: motionOn ? "smooth" : "auto" }));
})();

/* ─────────── magnetic elements ─────────── */
if (motionOn && finePointer) {
  $$(".magnetic").forEach((el) => {
    const mx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const my = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      mx(gsap.utils.clamp(-10, 10, (e.clientX - r.left - r.width / 2) * 0.18));
      my(gsap.utils.clamp(-8, 8, (e.clientY - r.top - r.height / 2) * 0.22));
    });
    el.addEventListener("pointerleave", () => { mx(0); my(0); });
  });
}

/* ─────────── custom cursor ─────────── */
if (motionOn && finePointer) {
  const cursor = $("#cursor");
  const label = $("#cursor-label");
  const cx = gsap.quickTo(cursor, "left", { duration: 0.18, ease: "power3.out" });
  const cy = gsap.quickTo(cursor, "top",  { duration: 0.18, ease: "power3.out" });
  document.addEventListener("pointermove", (e) => {
    cursor.classList.add("is-active");
    cx(e.clientX); cy(e.clientY);
  });
  document.documentElement.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  document.addEventListener("pointerover", (e) => {
    const tagged = e.target.closest("[data-cursor]");
    if (tagged) {
      label.textContent = CURSOR_LABELS[lang][tagged.dataset.cursor] || "";
      cursor.classList.add("has-label");
    } else {
      cursor.classList.remove("has-label");
    }
  });
}

/* ─────────── init ─────────── */
applyLang(lang);
