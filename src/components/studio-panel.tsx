"use client";

import { CopyButton } from "@/components/copy-button";
import type { SocialPackage, WeeklyStory } from "@/lib/content/schema";

const checklist = [
  "Research complete",
  "Sources verified",
  "Names verified",
  "Numbers verified",
  "Dates verified",
  "Rights to images/video confirmed",
  "Headline approved",
  "Article approved",
  "Video approved",
  "Transcript checked",
  "Captions checked",
  "Thumbnail approved",
  "YouTube metadata ready",
  "Instagram ready",
  "Facebook ready",
  "TikTok ready",
  "X ready",
  "SEO ready",
  "Accessibility checked",
  "Allison approval",
  "Publish website",
  "Publish video",
  "Publish social",
  "Record analytics",
];

function PreviewCard({ title, value }: { title: string; value: string | string[] }) {
  const text = Array.isArray(value) ? value.join("\n") : value;
  return (
    <section className="border border-[var(--line)] bg-[var(--paper)] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">{title}</h2>
        <CopyButton value={text} />
      </div>
      <pre className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[var(--ink-muted)]">
        {text}
      </pre>
    </section>
  );
}

export function StudioPanel({
  story,
  socialPackage,
}: {
  story: WeeklyStory;
  socialPackage: SocialPackage;
}) {
  return (
    <div className="grid gap-10">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Weekly Topic", story.title],
          ["Article", story.dek],
          ["SEO", socialPackage.website.seoDescription],
        ].map(([label, value]) => (
          <div key={label} className="border-t border-[var(--line)] pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {label}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-serif text-3xl">Publishing Checklist</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {checklist.map((item) => (
            <label
              key={item}
              className={
                item === "Allison approval"
                  ? "flex min-h-11 items-center gap-3 border-2 border-[var(--accent)] bg-[var(--paper)] px-3 text-sm font-semibold"
                  : "flex min-h-11 items-center gap-3 border border-[var(--line)] bg-[var(--paper)] px-3 text-sm"
              }
            >
              <input type="checkbox" className="size-4" />
              {item}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl">Social Previews</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <PreviewCard
            title="YouTube"
            value={`${socialPackage.youtube.title}\n\n${socialPackage.youtube.description}`}
          />
          <PreviewCard title="Instagram" value={socialPackage.instagram.caption} />
          <PreviewCard title="Facebook" value={socialPackage.facebook.post} />
          <PreviewCard
            title="TikTok"
            value={`${socialPackage.tiktok.hook}\n\n${socialPackage.tiktok.caption}`}
          />
          <PreviewCard title="X Thread" value={socialPackage.x.thread} />
          <PreviewCard
            title="Newsletter"
            value={`${socialPackage.newsletter.subject}\n\n${socialPackage.newsletter.body}`}
          />
        </div>
      </section>
    </div>
  );
}
