"use client";

import { CopyButton } from "@/components/copy-button";
import { AnalyticsReport } from "@/components/analytics-report";
import { blankWeeklyAnalyticsReport } from "@/lib/analytics-report";
import type { SocialPackage, WeeklyStory } from "@/lib/content/schema";

const workflow = [
  "Idea",
  "Research",
  "Reporting / Interview",
  "TV Segment",
  "Master Story",
  "Allison Review",
  "Approved",
  "Website",
  "YouTube",
  "Instagram",
  "Facebook",
  "TikTok",
  "X",
  "Analytics",
];

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
  const completePackage = JSON.stringify({ story, socialPackage }, null, 2);

  return (
    <div className="grid gap-10">
      <section className="flex flex-col gap-4 border border-[var(--line)] bg-[var(--paper)] p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            This Week
          </p>
          <h2 className="mt-3 max-w-4xl font-serif text-4xl leading-tight">{story.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            <span>Status: {story.status}</span>
            <span>Air: {story.airDate || "TBD"}</span>
            <span>Publish: {story.publishDate || "TBD"}</span>
            <span>Allison approval: required</span>
          </div>
        </div>
        <CopyButton value={completePackage} label="Copy Complete Package" />
      </section>

      <section>
        <h2 className="font-serif text-3xl">Weekly Workflow</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step) => (
            <div key={step} className="border border-[var(--line)] bg-[var(--paper)] p-3">
              <p className="text-sm font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "Source Material",
            story.sources.length
              ? story.sources.map((s) => s.title).join("\n")
              : "Sources not entered",
          ],
          [
            "Interview Notes",
            "Add notes to the weekly story record or linked production document.",
          ],
          ["Transcript", story.transcript || "Transcript not entered"],
          ["Media Assets", story.heroImage ? story.heroImage : "Media paths not entered"],
        ].map(([label, value]) => (
          <div key={label} className="border-t border-[var(--line)] pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {label}
            </p>
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--ink-muted)]">
              {value}
            </pre>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <PreviewCard title="Master Story" value={`${story.title}\n\n${story.dek}`} />
        <PreviewCard title="Key Takeaways" value={story.keyTakeaways} />
        <PreviewCard
          title="SEO"
          value={`${story.seoTitle}\n${story.seoDescription}\nSlug: ${story.slug}\nKeywords: ${story.tags.join(", ")}`}
        />
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

      <section>
        <h2 className="font-serif text-3xl">Final Output</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Ready for website",
            "Ready for YouTube",
            "Ready for Instagram",
            "Ready for Facebook",
            "Ready for TikTok",
            "Ready for X",
          ].map((item) => (
            <label
              key={item}
              className="flex min-h-11 items-center gap-3 border border-[var(--line)] bg-[var(--paper)] px-3 text-sm"
            >
              <input type="checkbox" className="size-4" />
              {item}
            </label>
          ))}
        </div>
      </section>

      <AnalyticsReport
        report={{
          ...blankWeeklyAnalyticsReport,
          week: story.publishDate,
          topic: story.title,
        }}
      />
    </div>
  );
}
