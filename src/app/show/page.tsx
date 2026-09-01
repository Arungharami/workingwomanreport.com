import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, SectionHeader } from "@/components/ui";
import { EditorialEmptyState } from "@/components/empty-state";
import { VideoEmbed } from "@/components/video-embed";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { formatDate } from "@/lib/format";
import { getCurrentWeeklyStory } from "@/lib/content";
import {
  getDailyNewsRecords,
  getOwnedHistoricalRecords,
  getSuccessStoryRecords,
} from "@/lib/legacy";

export const metadata: Metadata = {
  title: "The Show",
  description:
    "Working Woman Report, the television show with Allison Haunss — latest segment, show history, success stories, and daily news archive.",
};

export default function ShowPage() {
  const current = getCurrentWeeklyStory();
  const historical = getOwnedHistoricalRecords();
  const successStories = getSuccessStoryRecords();
  const dailyNews = getDailyNewsRecords();
  const showRecord = historical.find((r) => r.slug === "about-the-show");
  const rnnRecord = historical.find((r) => r.slug === "working-woman-report-now-on-rnn-tv");

  return (
    <div>
      <section className="border-b border-[var(--line)] bg-[var(--foreground)] text-[var(--background)]">
        <div className="container-shell grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
              The Show
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.98] md:text-7xl">
              Working Woman Report
            </h1>
            <p className="mt-3 text-xl opacity-85">with Allison Haunss</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 opacity-85">
              A television and editorial newsroom exploring female-inspired business and
              entrepreneurship — one authoritative weekly reporting package, adapted for every
              channel.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/watch">Watch Latest</ButtonLink>
              <ButtonLink href="/show/archive" variant="secondary">
                Show Archive
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src="/images/show-hero.svg"
              alt="Working Woman Report broadcast set illustration"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="container-shell py-10">
        {current ? (
          <section>
            <SectionHeader eyebrow="This Week" title="Latest Segment" />
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <VideoEmbed youtubeVideoId={current.youtubeVideoId} title={current.title} />
              <div>
                <h3 className="font-serif text-3xl leading-tight">{current.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
                  {current.summary}
                </p>
                <Link
                  href={`/this-week/${current.slug}`}
                  className="mt-4 inline-block underline"
                >
                  Read the full report
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <EditorialEmptyState
            title="The next segment is in production."
            dek="The show's production system is ready for Allison's next approved weekly package."
          />
        )}

        {showRecord ? (
          <section className="mt-14 border-t border-[var(--line)] pt-8">
            <SectionHeader eyebrow="About" title="About The Show" />
            <p className="max-w-3xl text-lg leading-8 text-[var(--ink-muted)]">
              The Working Woman Report is a half-hour lifestyle show exploring female-inspired
              businesses and entrepreneurship — introducing women from all walks of life to
              help others turn their own ambitions into reality.
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              From the show&rsquo;s original {formatDate(showRecord.publishedDate)}{" "}
              description.
            </p>
          </section>
        ) : null}

        <section className="mt-14 border-t border-[var(--line)] pt-8">
          <SectionHeader
            eyebrow="Success Stories"
            title="Success Stories"
            dek={`${successStories.length} legacy record${successStories.length === 1 ? "" : "s"} — metadata only, pending rights review.`}
          />
          {successStories.length ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {successStories.slice(0, 8).map((record) => (
                <li key={record.originalUrl} className="border border-[var(--line)] p-4">
                  <p className="text-xs text-[var(--ink-muted)]">
                    {formatDate(record.publishedDate)}
                  </p>
                  <p className="mt-1 font-medium leading-snug">{record.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--ink-muted)]">No success-story records found.</p>
          )}
          <Link href="/show/success-stories" className="mt-4 inline-block underline">
            View all success stories
          </Link>
        </section>

        <section className="mt-14 border-t border-[var(--line)] pt-8">
          <SectionHeader
            eyebrow="Archive"
            title="Daily News Archive"
            dek={`${dailyNews.length} legacy record${dailyNews.length === 1 ? "" : "s"} from the show's daily-news segment.`}
          />
          <Link href="/show/daily-news" className="mt-2 inline-block underline">
            Browse the daily news archive
          </Link>
        </section>

        {rnnRecord ? (
          <section className="mt-14 border-t border-[var(--line)] pt-8">
            <SectionHeader eyebrow="Broadcast History" title="On the Air" />
            <p className="max-w-3xl text-sm leading-7 text-[var(--ink-muted)]">
              Working Woman Report aired on RNN-TV, a full-power New York market television
              station, as recorded in a {formatDate(rnnRecord.publishedDate)} show update.
              Current broadcast placement should be confirmed with Allison before republishing.
            </p>
          </section>
        ) : null}

        <section className="mt-14 border-t border-[var(--line)] pt-8">
          <NewsletterSignup />
        </section>
      </div>
    </div>
  );
}
