import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ShareTools } from "@/components/share-tools";
import { SocialFollow } from "@/components/social-follow";
import { StoryCard } from "@/components/story-card";
import { Eyebrow, SectionHeader } from "@/components/ui";
import { VideoEmbed } from "@/components/video-embed";
import {
  getPublishedStories,
  getWeeklyStories,
  getWeeklyStory,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd, videoJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWeeklyStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getWeeklyStory(slug);
  if (!story) {
    return {};
  }

  return {
    title: story.seoTitle,
    description: story.seoDescription,
    alternates: { canonical: `/this-week/${story.slug}` },
    openGraph: {
      type: "article",
      title: story.seoTitle,
      description: story.seoDescription,
      images: [story.heroImage],
    },
  };
}

export default async function WeeklyStoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getWeeklyStory(slug);
  if (!story) {
    notFound();
  }
  const related = getPublishedStories().filter((item) =>
    story.relatedStories.includes(item.slug),
  );

  return (
    <article>
      <JsonLd data={articleJsonLd(story, `/this-week/${story.slug}`)} />
      <JsonLd data={videoJsonLd(story)} />
      <div className="container-shell py-8">
        <nav className="text-sm text-[var(--ink-muted)]" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/this-week">This Week</Link>
        </nav>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_0.15fr]">
          <header>
            <Eyebrow>{story.category}</Eyebrow>
            {story.demoNotice ? (
              <p className="mt-4 border border-[var(--gold)] px-3 py-2 text-sm text-[var(--gold)]">
                {story.demoNotice}
              </p>
            ) : null}
            <h1 className="mt-4 max-w-5xl font-serif text-5xl leading-none md:text-7xl">
              {story.title}
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-[var(--ink-muted)]">
              {story.dek}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--ink-muted)]">
              <span>By {story.reporter}</span>
              <span>Published {formatDate(story.publishDate)}</span>
              {story.updatedDate ? <span>Updated {formatDate(story.updatedDate)}</span> : null}
            </div>
          </header>
          <ShareTools path={`/this-week/${story.slug}`} title={story.title} />
        </div>
      </div>
      <div className="relative aspect-[16/8] w-full bg-[var(--line)]">
        <Image
          src={story.heroImage}
          alt={story.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="container-shell grid gap-10 py-10 lg:grid-cols-[0.72fr_0.28fr]">
        <div>
          <section className="mb-8 border-y border-[var(--line)] py-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Key Takeaways
            </h2>
            <ul className="mt-4 grid gap-3">
              {story.keyTakeaways.map((takeaway) => (
                <li key={takeaway} className="text-sm leading-6">
                  {takeaway}
                </li>
              ))}
            </ul>
          </section>
          <div className="article-body">
            {story.articleBody.map((block) => (
              <section key={block.heading ?? block.body.slice(0, 20)}>
                {block.heading ? <h2>{block.heading}</h2> : null}
                <p>{block.body}</p>
              </section>
            ))}
          </div>
          <section className="mt-10">
            <SectionHeader eyebrow="Segment" title="Embedded TV / YouTube Segment" />
            <VideoEmbed youtubeVideoId={story.youtubeVideoId} title={story.title} />
          </section>
          {story.transcript ? (
            <section className="mt-10">
              <SectionHeader eyebrow="Accessibility" title="Transcript" />
              <p className="text-sm leading-7 text-[var(--ink-muted)]">{story.transcript}</p>
            </section>
          ) : null}
          <section className="mt-10">
            <SectionHeader eyebrow="Sources" title="Source Notes" />
            {story.sources.map((source) => (
              <p key={source.title} className="border-t border-[var(--line)] py-3 text-sm">
                {source.url ? <Link href={source.url}>{source.title}</Link> : source.title}
                {source.note ? ` - ${source.note}` : ""}
              </p>
            ))}
          </section>
        </div>
        <aside className="space-y-8">
          <SocialFollow />
          <NewsletterSignup compact />
        </aside>
      </div>
      <section className="container-shell py-8">
        <SectionHeader title="Related Coverage" />
        <div className="grid gap-8 md:grid-cols-3">
          {related.map((item) => (
            <StoryCard key={item.slug} story={item} href={`/stories/${item.slug}`} />
          ))}
        </div>
      </section>
    </article>
  );
}
