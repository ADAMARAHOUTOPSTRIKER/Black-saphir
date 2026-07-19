import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Showreel from "@/components/sections/Showreel";
import Process from "@/components/sections/Process";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import CtaBand from "@/components/sections/CtaBand";
import SectionDots from "@/components/chrome/SectionDots";

export default function Home() {
  return (
    <>
      <SectionDots />
      <Hero />
      <Manifesto />
      <Services />
      <Work />
      <Showreel />
      <Process />
      <Stats />
      <Testimonials />
      <CtaBand />
    </>
  );
}
