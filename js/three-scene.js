/* ═══════════════════════════════════════════════════
   BLACK SAPHIR — three-scene.js
   · Hero: interactive black sapphire (procedural brilliant cut)
   · Modal: procedural 3D gold pieces (bangles) viewer
   Exposed as window.BS3D { showProduct, stopProduct }
   ═══════════════════════════════════════════════════ */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* ─────────── shared helpers ─────────── */

function makeRenderer(canvas, alpha = true) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.15;
  return r;
}

/* one env map per renderer — a PMREM texture cannot be shared
   across WebGL contexts (it renders black in the other context) */
function envMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  return pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
}

/* Brilliant-cut gem geometry: table → crown → girdle → pavilion → culet */
function gemGeometry() {
  const N = 16, verts = [];
  const ring = (r, y, rot = 0) =>
    Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2 + rot;
      return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    });
  const table = ring(0.52, 0.5, Math.PI / N);
  const crown = ring(0.94, 0.22);
  const girdle = ring(1.0, 0.0, Math.PI / N);
  const pav = ring(0.62, -0.5);
  const apexTop = new THREE.Vector3(0, 0.5, 0);
  const culet = new THREE.Vector3(0, -1.05, 0);

  const tri = (a, b, c) => verts.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    tri(apexTop, table[j], table[i]);                       // flat table fan
    tri(table[i], table[j], crown[i]);                      // table → crown
    tri(table[j], crown[j], crown[i]);
    tri(crown[i], crown[j], girdle[i]);                     // crown → girdle
    tri(crown[j], girdle[j], girdle[i]);
    tri(girdle[i], girdle[j], pav[i]);                      // girdle → pavilion
    tri(girdle[j], pav[j], pav[i]);
    tri(pav[i], pav[j], culet);                             // pavilion → culet
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  g.computeVertexNormals(); // non-indexed → faceted normals
  return g;
}

const GOLD = () => new THREE.MeshPhysicalMaterial({
  color: 0xd9b45e, metalness: 1, roughness: 0.16,
  clearcoat: 0.6, clearcoatRoughness: 0.25,
});

/* ═══════════ HERO GEM ═══════════ */
const heroCanvas = document.getElementById("gem-canvas");
if (heroCanvas) {
  const renderer = makeRenderer(heroCanvas);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  cam.position.set(0, 0.2, 6);
  scene.environment = envMap(renderer);

  // black sapphire — deep midnight blue, glassy
  const gem = new THREE.Mesh(gemGeometry(), new THREE.MeshPhysicalMaterial({
    color: 0x1f2a55, metalness: 0.05, roughness: 0.03,
    transmission: 0.88, thickness: 1.4, ior: 1.76,
    clearcoat: 1, clearcoatRoughness: 0.03,
    specularIntensity: 1.6, envMapIntensity: 2.4,
  }));
  gem.scale.setScalar(0.7);
  gem.position.y = -0.95; // sits below the title and subtitle
  scene.add(gem);

  // gold glitter dust drifting around the gem
  const COUNT = 260;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 11;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xc6a55c, size: 0.035, transparent: true, opacity: 0.75,
    sizeAttenuation: true, depthWrite: false,
  }));
  scene.add(dust);

  const key = new THREE.DirectionalLight(0xfff3d6, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.5));

  let mx = 0, my = 0;
  addEventListener("pointermove", (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  function size() {
    const w = heroCanvas.clientWidth || innerWidth;
    const h = heroCanvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }
  size();
  addEventListener("resize", size);

  const clock = new THREE.Clock();
  let heroVisible = true;
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting), { threshold: 0 })
    .observe(heroCanvas);

  (function loop() {
    requestAnimationFrame(loop);
    if (!heroVisible) return;
    const t = clock.getElapsedTime();
    gem.rotation.y = t * 0.35 + mx * 0.6;
    gem.rotation.x = 0.35 + Math.sin(t * 0.4) * 0.1 + my * 0.25;
    gem.position.y = -0.95 + Math.sin(t * 0.8) * 0.1;
    dust.rotation.y = t * 0.03;
    renderer.render(scene, cam);
  })();
}

/* ═══════════ MODAL PRODUCT VIEWER ═══════════ */
const modalCanvas = document.getElementById("modal-3d");
let mv = null; // { renderer, scene, cam, controls, group, raf }

function buildPiece(kind) {
  const g = new THREE.Group();
  if (kind === "gem") {
    const stone = new THREE.Mesh(gemGeometry(), new THREE.MeshPhysicalMaterial({
      color: 0xf4f6fa, metalness: 0, roughness: 0.02,
      transmission: 0.95, thickness: 1.8, ior: 2.4,
      clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2,
    }));
    // four gold prongs + basket
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const prong = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.7, 4, 10), GOLD());
      prong.position.set(Math.cos(a) * 0.95, -0.05, Math.sin(a) * 0.95);
      prong.rotation.z = Math.cos(a) * 0.28;
      prong.rotation.x = -Math.sin(a) * 0.28;
      g.add(prong);
    }
    const basket = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.05, 12, 48), GOLD());
    basket.rotation.x = Math.PI / 2;
    basket.position.y = -0.28;
    g.add(stone, basket);
  } else if (kind === "bangle-triple") {
    [-0.42, 0, 0.42].forEach((y, i) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.075, 24, 100), GOLD());
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = (i - 1) * 0.16;
      ring.position.y = y;
      g.add(ring);
    });
  } else if (kind === "bangle-stud") {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.09, 24, 100), GOLD());
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const stud = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.17, 4), GOLD());
      stud.position.set(Math.cos(a) * 1.15, 0, Math.sin(a) * 1.15);
      stud.lookAt(Math.cos(a) * 3, 0, Math.sin(a) * 3);
      stud.rotateX(Math.PI / 2);
      g.add(stud);
    }
  } else if (kind === "bangle-twist") {
    [-0.34, 0, 0.34].forEach((y) => {
      const ring = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.1, 0.055, 220, 14, 16, 1), GOLD());
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      ring.scale.y = 0.55;
      g.add(ring);
    });
  }
  return g;
}

window.BS3D = {
  showProduct(kind) {
    if (!modalCanvas) return;
    this.stopProduct();
    const renderer = makeRenderer(modalCanvas);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f4ee);
    scene.environment = envMap(renderer);
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    cam.position.set(0, 0.8, 4.2);
    const controls = new OrbitControls(cam, modalCanvas);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;
    controls.minDistance = 2.2;
    controls.maxDistance = 8;

    const key = new THREE.DirectionalLight(0xfff3d6, 1.8);
    key.position.set(3, 5, 4);
    scene.add(key, new THREE.AmbientLight(0xffffff, 0.55));

    const group = buildPiece(kind);
    scene.add(group);

    const size = () => {
      const w = modalCanvas.clientWidth || 500, h = modalCanvas.clientHeight || 500;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    size();
    const onResize = () => size();
    addEventListener("resize", onResize);

    let raf;
    (function loop() {
      raf = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, cam);
      mv && (mv.raf = raf);
    })();
    mv = { renderer, controls, raf, onResize };
  },
  stopProduct() {
    if (!mv) return;
    cancelAnimationFrame(mv.raf);
    removeEventListener("resize", mv.onResize);
    mv.controls.dispose();
    mv.renderer.dispose();
    mv = null;
  },
};
