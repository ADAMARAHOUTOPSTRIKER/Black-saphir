import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Racontez-nous votre projet — nous répondons sous 48 h.",
};

export default function ContactPage() {
  return <ContactView />;
}
