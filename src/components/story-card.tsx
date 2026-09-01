import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";

export type CardStory = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  publishDate: string;
  heroImage: string;
  heroImageAlt: string;
};

export function StoryCard({ story, href }: { story: CardStory; href: string }) {
  return (
    <article className="group border-t border-[var(--line)] pt-4">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--line)]">
          <Image
            src={story.heroImage}
            alt={story.heroImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {story.category}
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight group-hover:underline">
          {story.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{story.dek}</p>
        <p className="mt-3 text-xs text-[var(--ink-muted)]">{formatDate(story.publishDate)}</p>
      </Link>
    </article>
  );
}
