import Image from "next/image";
import Link from "next/link";
import { EditorialEmptyState } from "@/components/empty-state";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { StoryCard } from "@/components/story-card";
import { ButtonLink, Eyebrow, SectionHeader } from "@/components/ui";
import { VideoEmbed } from "@/components/video-embed";
import { getCurrentWeeklyStory, getPublishedStories } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const weekly = getCurrentWeeklyStory();
  const stories = getPublishedStories();

  if (!weekly) {
    return (
      <>
        <EditorialEmptyState />
        <section className="container-shell py-8">
          <SectionHeader
            eyebrow="Preparation"
            title="One Topic. One Canonical Story. Every Channel."
            dek="The production system is ready for the first approved weekly report, video package, newsletter summary, and social distribution kit."
          />
        </section>
        <section className="container-shell py-10">
          <NewsletterSignup />
        </section>
      </>
    );
  }

  return (
    <>
      <section className="border-b border-[var(--line)] bg-[var(--foreground)] py-3 text-[var(--background)]">
        <div className="container-shell flex flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between">
          <p className="font-semibold">Latest: {weekly.shortTitle ?? weekly.title}</p>
          <Link href={`/this-week/${weekly.slug}`} className="underline">
            Read the current reporting package
          </Link>
        </div>
      </section>

      <section className="container-shell grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Eyebrow>This Week</Eyebrow>
          {weekly.demoNotice ? (
            <p className="mt-4 inline-block border border-[var(--gold)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
              Demo content
            </p>
          ) : null}
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.98] md:text-7xl">
            {weekly.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">
            {weekly.dek}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--ink-muted)]">
            <span>{weekly.category}</span>
            <span>{formatDate(weekly.publishDate)}</span>
            <span>Reported by {weekly.reporter}</span>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="#watch-report">Watch</ButtonLink>
            <ButtonLink href={`/this-week/${weekly.slug}`} variant="secondary">
              Read Story
            </ButtonLink>
          </div>
        </div>
        <div className="relative aspect-[16/11] overflow-hidden bg-[var(--line)]">
          <Image
            src={weekly.heroImage}
            alt={weekly.heroImageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="watch-report" className="bg-[var(--paper)] py-12">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <VideoEmbed youtubeVideoId={weekly.youtubeVideoId} title={weekly.title} />
          <div>
            <SectionHeader eyebrow="Watch" title="Watch the Report" />
            <p className="text-sm leading-6 text-[var(--ink-muted)]">{weekly.summary}</p>
            <div className="mt-6 grid gap-3">
              {weekly.keyTakeaways.slice(0, 5).map((takeaway) => (
                <p key={takeaway} className="border-t border-[var(--line)] pt-3 text-sm">
                  {takeaway}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeader
          eyebrow="Distribution"
          title="This Week Everywhere"
          dek="One reporting package, adapted for the channels where the audience watches, reads, and shares."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.values(siteConfig.social)
            .slice(0, 5)
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.configured ? item.url : "/studio"}
                  key={item.label}
                  className="border border-[var(--line)] bg-[var(--paper)] p-4"
                >
                  <Icon size={22} />
                  <h3 className="mt-4 font-semibold">{item.label}</h3>
                  <p className="mt-2 text-sm text-[var(--ink-muted)]">
                    {item.configured ? "Configured channel" : "Awaiting confirmed URL"}
                  </p>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="container-shell py-8">
        <SectionHeader eyebrow="Latest" title="Latest Stories" />
        <div className="grid gap-8 md:grid-cols-3">
          {stories.slice(0, 6).map((story) => (
            <StoryCard key={story.slug} story={story} href={`/stories/${story.slug}`} />
          ))}
        </div>
      </section>

      {[
        ["Success Stories", "Success Stories"],
        ["Business & Money", "Money"],
        ["Career & Leadership", "Career"],
        ["Health & Lifestyle", "Life & Style"],
        ["Technology", "Technology"],
      ].map(([title, category]) => (
        <section key={title} className="container-shell py-8">
          <SectionHeader title={title} />
          <div className="grid gap-8 md:grid-cols-3">
            {stories
              .filter((story) => story.category === category)
              .slice(0, 3)
              .map((story) => (
                <StoryCard key={story.slug} story={story} href={`/stories/${story.slug}`} />
              ))}
          </div>
        </section>
      ))}

      <section className="container-shell py-8">
        <SectionHeader eyebrow="Most Watched" title="Weekly Video Archive" />
        <StoryCard story={weekly} href={`/this-week/${weekly.slug}`} />
      </section>

      <section className="container-shell py-10">
        <NewsletterSignup />
      </section>
    </>
  );
}
