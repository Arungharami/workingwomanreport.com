import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { SectionHeader } from "@/components/ui";
import { getPeople, getPerson } from "@/lib/people";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPeople().map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) {
    return {};
  }

  return {
    title: person.name,
    description: person.shortBio,
    alternates: { canonical: `/people/${person.slug}` },
  };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) {
    notFound();
  }

  return (
    <div className="container-shell py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: person.name,
          jobTitle: person.role,
          url: `${siteConfig.url}/people/${person.slug}`,
          sameAs: Object.values(person.socials),
        }}
      />
      <nav className="text-sm text-[var(--ink-muted)]" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / People
      </nav>
      <SectionHeader eyebrow="Reporter Profile" title={person.name} dek={person.role} />
      <div className="grid gap-10 lg:grid-cols-[0.66fr_0.34fr]">
        <section className="article-body">
          {person.fullBio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h2>Coverage Areas</h2>
          <p>{person.areasOfCoverage.join(", ")}.</p>
        </section>
        <aside className="space-y-8">
          {person.photo ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--line)]">
              <Image
                src={person.photo}
                alt={person.photoAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="border border-[var(--line)] bg-[var(--paper)] p-5">
              <h2 className="font-serif text-2xl">Photo Needed</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
                Add an approved Allison headshot after image rights are confirmed.
              </p>
            </div>
          )}
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Verified Links</h2>
            <div className="mt-3 grid gap-2 text-sm">
              <Link href={person.website} className="underline">
                Working Woman Report
              </Link>
              {Object.entries(person.socials).map(([platform, url]) => (
                <Link key={platform} href={url} className="underline">
                  {platform.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Still To Verify</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--ink-muted)]">
              {person.placeholders.map((placeholder) => (
                <li key={placeholder}>{placeholder}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
