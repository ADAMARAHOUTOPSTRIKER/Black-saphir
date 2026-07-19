import type { Metadata } from "next";
import ServicesView from "@/components/services/ServicesView";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Création de sites d'exception et production de films publicitaires — deux métiers, une seule signature.",
};

export default function ServicesPage() {
  return <ServicesView />;
}
