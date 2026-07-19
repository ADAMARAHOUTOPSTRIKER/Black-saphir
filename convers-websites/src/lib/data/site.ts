/** Global site copy & structure — edit here to change nav, footer, contact. */

export const SITE = {
  name: "Convers Websites",
  logotype: "CONVERS",
  tagline: "Sites d'exception & films publicitaires",
  email: "hello@converswebsites.com",
  phone: "+33 1 84 80 00 00",
  locations: "Paris — Casablanca",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Behance", href: "https://behance.net" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Vimeo", href: "https://vimeo.com" },
  ],
} as const;

export const NAV = [
  { label: "Studio", href: "/#studio" },
  { label: "Services", href: "/services" },
  { label: "Réalisations", href: "/#realisations" },
  { label: "Contact", href: "/contact" },
] as const;
