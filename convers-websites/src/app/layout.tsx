import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Preloader from "@/components/chrome/Preloader";
import Cursor from "@/components/chrome/Cursor";
import Grain from "@/components/chrome/Grain";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import FloatingContact from "@/components/chrome/FloatingContact";
import SmoothScroll from "@/components/providers/SmoothScroll";
import TransitionProvider from "@/components/providers/TransitionProvider";

/* Self-hosted variable fonts (fontsource) — no network needed at build. */
const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-var.woff2", style: "normal", weight: "100 900" },
    { path: "../fonts/fraunces-var-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = localFont({
  src: "../fonts/inter-var.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
const oswald = localFont({
  src: "../fonts/oswald-var.woff2",
  weight: "200 700",
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Convers Websites — Sites d'exception & films publicitaires",
    template: "%s — Convers Websites",
  },
  description:
    "Studio créatif haut de gamme. Convers Websites conçoit des sites d'exception et des films publicitaires cinématiques pour les marques qui refusent l'ordinaire.",
  openGraph: {
    title: "Convers Websites",
    description: "Sites d'exception & films publicitaires — l'art de la première impression.",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} ${oswald.variable} antialiased`}>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-bg"
        >
          Aller au contenu
        </a>
        <Preloader />
        <TransitionProvider>
          <SmoothScroll>
            <Cursor />
            <Grain />
            <Header />
            <main id="contenu">{children}</main>
            <Footer />
            <FloatingContact />
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}
