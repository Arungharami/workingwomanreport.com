import type { Metadata } from "next";
import { StoryCard } from "@/components/story-card";
import { SectionHeader } from "@/components/ui";
import { VideoEmbed } from "@/components/video-embed";
import { getCurrentWeeklyStory, getWeeklyStories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Watch",
  description: "Working Woman Report video hub for full weekly segments, shorts, and archive clips.",
};

export default function WatchPage() {
  const current = getCurrentWeeklyStory();
  const weekly = getWeeklyStories();

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
      <section className="mt-12 grid gap-8 md:grid-cols-3">
        {["YouTube Videos", "Shorts / Reels", "Success Stories"].map((title) => (
          <div key={title} className="border-t border-[var(--line)] pt-4">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
              Add confirmed video URLs in each weekly story and social package.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
