import type { Metadata } from "next";
import Link from "next/link";
import { EditorialEmptyState } from "@/components/empty-state";
import { StoryCard } from "@/components/story-card";
import { SectionHeader } from "@/components/ui";
import { VideoEmbed } from "@/components/video-embed";
import { getCurrentWeeklyStory, getWeeklyStories } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getDailyNewsRecords, getSuccessStoryRecords } from "@/lib/legacy";

export const metadata: Metadata = {
  title: "Watch",
  description:
    "Working Woman Report video hub for full weekly segments, shorts, and archive clips.",
};

export default function WatchPage() {
  const current = getCurrentWeeklyStory();
  const weekly = getWeeklyStories().filter((story) => !story.isDemo);
  const successStories = getSuccessStoryRecords();
  const dailyNews = getDailyNewsRecords();

  if (!current) {
    return (
      <EditorialEmptyState
        title="The next Working Woman Report video package is coming soon."
        dek="Full segments, YouTube metadata, shorts, transcript, and related video slots are ready for the first approved report."
      />
    );
  }

  return (
    <div className="container-shell py-10">
      <SectionHeader
        eyebrow="Video"
        title="Watch"
        dek="Full segments, weekly reports, shorts, success stories, and archived video packages."
      />
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <VideoEmbed youtubeVideoId={current.youtubeVideoId} title={current.title} />
        <div>
          <h1 className="font-serif text-4xl leading-tight">{current.title}</h1>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-muted)]">{current.summary}</p>
        </div>
      </section>
      <section className="mt-12">
        <SectionHeader title="Weekly Reports" />
        <div className="grid gap-8 md:grid-cols-3">
          {weekly.map((story) => (
            <StoryCard key={story.slug} story={story} href={`/this-week/${story.slug}`} />
          ))}
        </div>
      </section>
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        {["YouTube Videos", "Shorts / Reels"].map((title) => (
          <div key={title} className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
              Add confirmed video URLs in each weekly story and social package.
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12 border-t border-[var(--line)] pt-6">
        <SectionHeader
          eyebrow="The Show"
          title="Success Stories"
          dek={`${successStories.length} legacy record${successStories.length === 1 ? "" : "s"}, metadata only.`}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {successStories.slice(0, 8).map((record) => (
            <div key={record.originalUrl} className="border border-[var(--line)] p-4">
              <p className="text-xs text-[var(--ink-muted)]">
                {formatDate(record.publishedDate)}
              </p>
              <p className="mt-1 text-sm font-medium leading-snug">{record.title}</p>
            </div>
          ))}
        </div>
        <Link href="/show/success-stories" className="mt-4 inline-block underline">
          View all
        </Link>
      </section>

      <section className="mt-12 border-t border-[var(--line)] pt-6">
        <SectionHeader
          eyebrow="The Show"
          title="Daily News Archive"
          dek={`${dailyNews.length} legacy record${dailyNews.length === 1 ? "" : "s"}, metadata only.`}
        />
        <Link href="/show/daily-news" className="mt-2 inline-block underline">
          Browse the daily news archive
        </Link>
      </section>
    </div>
  );
}
