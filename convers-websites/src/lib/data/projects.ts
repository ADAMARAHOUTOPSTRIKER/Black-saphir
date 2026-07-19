/** The studio's selected work. Order = display order everywhere. */

export type Project = {
  slug: string;
  title: string;
  /** Short qualifier under the title (sector). */
  sector: string;
  /** One-line pitch used in the gallery. */
  pitch: string;
  tags: string[];
  year: string;
  cover: string;
  detail: string;
  /** Case-study copy. */
  intro: string;
  challenge: string;
  approach: string;
  quote?: { text: string; author: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "obsidienne",
    title: "Obsidienne",
    sector: "Concession automobile de luxe",
    pitch: "Un configurateur 3D temps réel — le client fait tourner un vrai modèle du bout des doigts.",
    tags: ["3D / WebGL", "Automobile", "Site vitrine"],
    year: "2025",
    cover: "/assets/work/obsidienne-cover.webp",
    detail: "/assets/work/obsidienne-detail.webp",
    intro:
      "Pour Obsidienne, concession spécialisée dans le grand tourisme, la vitrine digitale devait provoquer la même montée d'adrénaline que l'entrée dans le showroom.",
    challenge:
      "Vendre une voiture d'exception en ligne, c'est vendre une émotion avant une fiche technique. Le site devait faire ressentir la matière — le carbone, le cuir, la laque noire — sans jamais ressembler à un catalogue constructeur.",
    approach:
      "Nous avons construit un configurateur 3D temps réel en WebGL : le visiteur fait pivoter le modèle du bout des doigts, change la teinte, la sellerie, les jantes — et la lumière du studio répond à chaque geste. Autour de cette pièce maîtresse, une direction artistique noir profond et or, des transitions cinématiques et une typographie condensée, monumentale.",
    quote: {
      text: "Votre vitrine. Leur premier essai.",
      author: "Concept directeur du site Obsidienne",
    },
  },
  {
    slug: "marsa",
    title: "Marsa — Club Nautique",
    sector: "Club nautique haut de gamme · Casablanca",
    pitch: "Une expérience éditoriale cinématique — l'océan comme art de vivre.",
    tags: ["Hospitality", "Éditorial", "Cinématique"],
    year: "2025",
    cover: "/assets/work/marsa-cover.webp",
    detail: "/assets/work/marsa-detail.webp",
    intro:
      "Marsa réunit une marina privée, un club house et une école de voile face à l'Atlantique. Le site devait donner envie d'appartenir — avant même la première visite.",
    challenge:
      "Traduire en ligne le calme d'un club privé : pas de démonstration, pas de surenchère. Il fallait un rythme lent, éditorial, où chaque écran respire comme une double page de revue.",
    approach:
      "Une narration au défilement, portée par des images plein cadre à l'heure bleue et une serif racée. Les sections glissent comme une houle légère, les capitales espacées signent chaque chapitre — CASABLANCA · MAROC — et l'or vient souligner l'essentiel, jamais plus.",
    quote: {
      text: "L'océan comme art de vivre.",
      author: "Manifeste du club Marsa",
    },
  },
  {
    slug: "sentia",
    title: "Sentia",
    sector: "Maison de parfum",
    pitch: "Un e-commerce sensoriel, aux visuels produit photoréalistes.",
    tags: ["E-commerce", "Beauté / Luxe", "Direction artistique"],
    year: "2024",
    cover: "/assets/work/sentia-cover.webp",
    detail: "/assets/work/sentia-detail.webp",
    intro:
      "Sentia compose des parfums de niche en séries numérotées. La maison voulait un écrin digital à la hauteur de ses flacons — et vendre sans jamais paraître vendre.",
    challenge:
      "Faire sentir un parfum à travers un écran. L'e-commerce devait rester sensoriel de la première seconde au paiement, sans sacrifier la conversion à l'esthétique.",
    approach:
      "Des visuels produit photoréalistes générés et retouchés par nos soins, un noir profond qui laisse la lumière sculpter le verre, et un parcours d'achat réduit à l'essentiel. Chaque fiche produit s'ouvre comme un rituel : la matière d'abord, les notes ensuite, l'achat en un geste.",
    quote: {
      text: "Le luxe ne se montre pas. Il se ressent.",
      author: "Sentia — pages maison",
    },
  },
  {
    slug: "opticvision",
    title: "OpticVision",
    sector: "Lunetterie premium",
    pitch: "« La vision, sculptée comme un objet rare. » Un hero onirique, un minimalisme aérien.",
    tags: ["Retail", "Branding", "Motion"],
    year: "2024",
    cover: "/assets/work/opticvision-cover.webp",
    detail: "/assets/work/opticvision-detail.webp",
    intro:
      "OpticVision façonne des montures en petites séries, entre artisanat et haute technologie. Le site devait élever la lunette au rang d'objet d'art.",
    challenge:
      "Sortir la lunetterie de l'imagerie médicale et du rayonnage. La monture devait flotter, précieuse, dans un espace onirique — tout en gardant un parcours boutique limpide.",
    approach:
      "Un hero suspendu où la monture lévite dans la lumière, un minimalisme aérien fait de vides assumés et de règles fines, et des micro-animations qui répondent au curseur. La collection se découvre comme une galerie, pièce par pièce.",
    quote: {
      text: "La vision, sculptée comme un objet rare.",
      author: "Signature OpticVision",
    },
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
}
