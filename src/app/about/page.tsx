import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { getPerson } from "@/lib/people";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Allison Haunss",
  description: "About Allison Haunss and the mission of Working Woman Report.",
};

export default function AboutPage() {
  const person = getPerson(siteConfig.reporter.slug);

  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="About"
        title={person?.name ?? siteConfig.reporter.name}
        dek={person?.role ?? siteConfig.reporter.role}
      />
      <div className="grid gap-10 lg:grid-cols-[0.65fr_0.35fr]">
        <section className="article-body">
          <h2>Biography</h2>
          {(person?.verifiedBio ?? ["Founder and reporter for Working Woman Report."]).map(
            (line) => (
              <p key={line}>{line}</p>
            ),
          )}
          <h2>Working Woman Report Mission</h2>
          <p>
            Working Woman Report covers entrepreneurship, business, careers, money, lifestyle,
            health, technology, entertainment, and success stories through a television-ready
            weekly reporting model.
          </p>
        </section>
        <aside className="space-y-8">
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Reporter Page</h2>
            <Link
              className="mt-3 inline-block underline"
              href={siteConfig.reporter.profilePath}
            >
              View Allison Haunss profile
            </Link>
          </div>
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Verified Coverage Areas</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
              Journalism, television reporting, founder interviews, business, careers, and
              women-focused success stories.
            </p>
          </div>
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Placeholders To Verify</h2>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--ink-muted)]">
              {(person?.placeholders ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Contact</h2>
            <p className="mt-3 text-sm">{siteConfig.contactEmail}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
