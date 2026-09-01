import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ShareTools } from "@/components/share-tools";
import { SectionHeader } from "@/components/ui";
import { getPublishedStories, getStory } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) {
    return {};
  }

  return {
    title: story.seoTitle,
    description: story.seoDescription,
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: {
      type: "article",
      title: story.seoTitle,
      description: story.seoDescription,
      images: [story.heroImage],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) {
    notFound();
  }

  return (
    <article className="container-shell py-10">
      <JsonLd data={articleJsonLd(story, `/stories/${story.slug}`)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Stories", path: "/stories" },
          { name: story.title, path: `/stories/${story.slug}` },
        ])}
      />
      <nav className="text-sm text-[var(--ink-muted)]" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/stories">Stories</Link>
      </nav>
      <header className="mt-8 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {story.category}
        </p>
        {story.demoNotice ? (
          <p className="mt-4 border border-[var(--gold)] px-3 py-2 text-sm text-[var(--gold)]">
            {story.demoNotice}
          </p>
        ) : null}
        <h1 className="mt-4 font-serif text-5xl leading-none md:text-7xl">{story.title}</h1>
        <p className="mt-5 text-xl leading-8 text-[var(--ink-muted)]">{story.dek}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--ink-muted)]">
          <span>By {story.author}</span>
          <span>{formatDate(story.publishDate)}</span>
        </div>
      </header>
      <div className="relative mt-8 aspect-[16/8] overflow-hidden bg-[var(--line)]">
        <Image
          src={story.heroImage}
          alt={story.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="article-body">
          {story.body.map((block) => (
            <section key={block.heading ?? block.body.slice(0, 20)}>
              {block.heading ? <h2>{block.heading}</h2> : null}
              <p>{block.body}</p>
            </section>
          ))}
        </div>
        <aside className="space-y-8">
          <ShareTools path={`/stories/${story.slug}`} title={story.title} />
          <NewsletterSignup compact />
        </aside>
      </div>
      <section className="mt-10">
        <SectionHeader title="Sources" />
        {story.sources.length ? (
          story.sources.map((source) => (
            <p key={source.title} className="border-t border-[var(--line)] py-3 text-sm">
              {source.url ? <Link href={source.url}>{source.title}</Link> : source.title}
            </p>
          ))
        ) : (
          <p className="text-sm text-[var(--ink-muted)]">
            Source notes will appear here when verified reporting is added.
          </p>
        )}
      </section>
    </article>
  );
}
