import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS, getNextProject, getProject } from "@/lib/data/projects";
import CaseStudy from "@/components/work/CaseStudy";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Étude de cas`,
    description: project.pitch,
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudy project={project} next={getNextProject(slug)} />;
}
