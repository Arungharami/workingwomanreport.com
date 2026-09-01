import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { SectionHeader } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Allison Haunss",
  description: "About Allison Haunss and the mission of Working Woman Report.",
};

export default function AboutPage() {
  const person = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/people/allison-haunss.json"), "utf8"),
  ) as { name: string; role: string; verifiedBio: string[]; placeholders: string[] };

  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="About"
        title={person.name}
        dek={person.role}
      />
      <div className="grid gap-10 lg:grid-cols-[0.65fr_0.35fr]">
        <section className="article-body">
          <h2>Biography</h2>
          {person.verifiedBio.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <h2>Working Woman Report Mission</h2>
          <p>
            Working Woman Report covers entrepreneurship, business, careers,
            money, lifestyle, health, technology, entertainment, and success
            stories through a television-ready weekly reporting model.
          </p>
        </section>
        <aside className="space-y-8">
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Verified Coverage Areas</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
              Journalism, television reporting, founder interviews, business,
              careers, and women-focused success stories.
            </p>
          </div>
          <div className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">Placeholders To Verify</h2>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--ink-muted)]">
              {person.placeholders.map((item) => (
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
